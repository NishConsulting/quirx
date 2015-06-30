require 'spec_helper'
require 'quirx/api'

describe Quirx::API do
  let :api do
    described_class.new uri: 'https://api.fda.gov/drug/event.json?api_key=%s' % ENV['FDA_API_KEY']
  end

  describe '#events' do
    it 'returns time series without search' do
      expect(api.events.size).to eq 3668
    end

    it 'returns time series for a given search' do
      expect(api.events(q: 'adderall').size).to eq 2178
    end

    it 'returns an empty set when there are no matches' do
      expect(api.events q: 'spiders').to be_empty
    end

    context 'when count is sex' do
      it 'returns the events grouped by sex' do
        events =  api.events(q: 'adderall', count: 'sex')
        expect(events.map(&:term)).to match_array 3.times
      end
    end
  end
end
