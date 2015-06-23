require 'spec_helper'
require 'quirx/event'
require 'json'

describe Quirx::Event do
  let(:event) { described_class.new 'time' => '20040209', 'count' => 3 }

  describe '#time' do
    it 'includes the epoch version of the silly stamp' do
      expect(event.time).to eq 12457
    end
  end

  it 'can has json dump' do
    expect(JSON.dump([event])).to eq JSON.dump([{"time" => 12457, "count" => 3}])
  end
end
