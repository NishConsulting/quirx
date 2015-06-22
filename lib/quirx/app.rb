require 'json'
require 'quirx/api'

module Quirx
  class App
    attr_reader :not_found, :origin
    def initialize
      @not_found = [404, {}, JSON.dump(error: 'not found')]
      @origin = ENV.fetch('ALLOW_ORIGIN')
    end

    def call(env)
      route = env.values_at 'REQUEST_METHOD', 'PATH_INFO'
      code, headers, body = case route.join ' '
                            when %r[^GET /events.json$]
                              query = CGI.parse(env['QUERY_STRING'])['q'].first
                              [200, {}, JSON.dump({events: api.events(q: query)})]
                            else
                              not_found
                            end
      [
        code,
        headers.merge(
          'Content-Type'                => 'application/json',
          'Access-Control-Allow-Origin' => origin
        ),
        [body]
      ]
    end

    def api
      Quirx::API.new uri: 'https://api.fda.gov/drug/event.json?api_key=%s' % ENV.fetch('FDA_API_KEY')
    end
  end
end
