require 'json'
require 'quirx/event'

module Quirx
  class API
    DEFAULT_DATE_RANGE= Date.new(2000,1,1)..Date.today
    attr_reader :uri
    def initialize(uri:)
      @uri = URI(uri)
    end

    def events(count: :date, **search)
      count = {
        date:   'receivedate',
        weight: 'patient.patientweight',
        sex:    'patient.patientsex',
        drug:   'patient.drug.medicinalproduct'
      }.fetch(count.intern)

      u = uri.dup
      u.query = [uri.query, "search=#{search_clause(**search)}", "count=#{count}"].join('&')
      JSON.parse(Net::HTTP.get(u)).fetch("results", []).map(&Event.method(:new))
    end

    private

    def search_clause(date_range: DEFAULT_DATE_RANGE, sex: nil, q: nil)
      date_range   = 'receivedate:[%s+TO+%s]' % date_range.minmax.map(&format)
      product_name = '(patient.drug.medicinalproduct:%s)' % CGI.escape(q) if q
      sex_clause   = '(patient.patientsex:%s)' % CGI.escape(sex) if sex

      [date_range, product_name, sex_clause].compact.join('+AND+')
    end

    def format
      ->(date) {
        date.strftime('%Y%m%d')
      }
    end
  end
end
