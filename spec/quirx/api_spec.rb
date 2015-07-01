require 'spec_helper'
require 'quirx/api'

describe Quirx::API do
  let :api do
    described_class.new uri: 'https://api.fda.gov/drug/event.json?api_key=%s' % ENV['FDA_API_KEY']
  end

  describe '#events' do
    it 'raises without search' do
      expect do
        api.events.size
      end.to raise_error described_class::MalformedRequestError
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
        expect(events.map(&:term)).to match_array [0, 1, 2]
      end

    end

    it 'filters by sex' do
      total_events    = api.events(q: 'adderall').size
      filtered_events = api.events(q: 'adderall', sex: '1').size
      expect(filtered_events).to be < total_events
    end

    it 'filters by weight range' do
      total_events    = api.events(q: 'adderall').size
      filtered_events = api.events(q: 'adderall', weight: '95..100').size
      expect(filtered_events).to be < total_events
    end
  end
end
