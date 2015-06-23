module Quirx
  class Event
    SEC_PER_DAY = 60 * 60 * 24
    attr_reader :data
    def initialize(data)
      @data = data
    end

    def time
      Time.strptime(data['time'], '%Y%m%d').strftime('%s').to_i / SEC_PER_DAY
    end

    def to_json(*)
      data.merge("time" => time).to_json
    end
  end
end
