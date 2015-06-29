module Quirx
  class Event
    SEC_PER_DAY = 60 * 60 * 24
    attr_reader :data
    def initialize(data)
      @data = data
      if time = data.delete('time')
        data['term'] = format_time(time)
      end
    end

    def to_json(*)
      data.to_json
    end

    private

    def format_time(time)
      Time.strptime(time, '%Y%m%d').strftime('%s').to_i / SEC_PER_DAY
    end
  end
end
