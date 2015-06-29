require 'spec_helper'
require 'quirx/event'
require 'json'

describe Quirx::Event do
  let(:event) { described_class.new 'time' => '20040209', 'count' => 3 }

  describe '#time' do
    it 'includes the epoch version of the silly stamp' do
      expect(JSON.parse(event.to_json)['term']).to eq 12457
    end
  end

  it 'can has json dump' do
    expect(JSON.dump([event])).to eq JSON.dump([{"count" => 3, "term" => 12457}])
  end
end
