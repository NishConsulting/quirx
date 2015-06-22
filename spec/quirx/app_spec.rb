require 'spec_helper'
require 'rack/test'
require 'rspec/mocks'
require 'quirx/app'

describe Quirx::App do
  def app
    described_class.new
  end

  include Rack::Test::Methods

  it 'returns json' do
    get 'anything'
    expect(last_response.headers['Content-Type']).to eq 'application/json'
  end

  it 'has access control headers' do
    get 'anything'
    expect(last_response.header['Access-Control-Allow-Origin']).to eq ENV.fetch('ALLOW_ORIGIN')
  end

  it '404s unknown paths' do
    get 'anything'
    expect(last_response.status).to eq 404
  end

  describe 'events.json' do
    it 'passes the query to api' do
      api = double(Quirx::API)
      allow(Quirx::API).to receive(:new) { api }
      allow(api).to receive(:events)
      get '/events.json?q=foobar'
      expect(api).to have_received(:events).with(q:'foobar')
    end
  end
end
