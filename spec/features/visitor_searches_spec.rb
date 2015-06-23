require 'spec_helper'
require 'capybara/rspec'

Capybara.app_host = ENV['ALLOW_ORIGIN']

describe 'visitor searches', :js, type: :feature do
  it 'sees a count' do
    visit '/'
    fill_in 'Search', with: 'adderall'
    click_on 'Search'
    expect(page).to have_content '2178 events matched "adderall"'
    expect(page).to have_selector 'svg g.highcharts-series path'
  end
end
