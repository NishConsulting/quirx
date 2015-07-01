require 'json'
require 'quirx/event'

module Quirx
  class Facet
    attr_reader :path

    def initialize(path:, filter:)
      @path, @filter = path, filter.new(path)
    end

    def filter(by)
      @filter.filter(by)
    end
  end

  class Filter
    def initialize(path)
      @path = path
    end

    def filter(by)
      "(#@path:%s)" % CGI.escape(by)
    end
  end

  class RangeFilter < Filter
    def initialize(path)
      @path = path
    end

    def filter(range)
      "#@path:[%s+TO+%s]" % parse_range(range)
    end

    private

    def parse_range(s)
      s.split('..', 2).map(&:to_f).sort
    end
  end

  class DateRangeFilter < Filter
    DEFAULT_DATE_RANGE= Date.new(2000,1,1)..Date.today

    def filter(date_range: DEFAULT_DATE_RANGE)
      "#@path:[%s+TO+%s]" % date_range.minmax.map(&format)
    end

    private

    def format
      ->(date) {
        date.strftime('%Y%m%d')
      }
    end
  end

  class API
    MalformedRequestError = Class.new(StandardError)
    attr_reader :uri
    def initialize(uri:)
      @uri = URI(uri)
      @facets = {
        date:   Facet.new(path: 'receivedate', filter: DateRangeFilter),
        weight: Facet.new(path: 'patient.patientweight', filter: RangeFilter),
        sex:    Facet.new(path: 'patient.patientsex', filter: Filter),
        drug:   Facet.new(path: 'patient.drug.medicinalproduct', filter: Filter)
      }
    end

    def events(count: :date, q: (raise MalformedRequestError), **search)
      count = @facets.fetch(count.intern).path

      u = uri.dup

      u.query = [
        uri.query,
        "search=#{search_clause(**search.merge(drug: q))}",
        "count=#{count}"
      ].join('&')

      fetch(u)
    end

    private

    def fetch(url)
      JSON.parse(Net::HTTP.get(url))
        .fetch("results", [])
        .map(&Event.method(:new))
    end

    def search_clause(params)
      params.map do |key, value|
        @facets.fetch(key).filter(value)
      end.join('+AND+')
    end
  end
end
