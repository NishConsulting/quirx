require 'spec_helper'
require 'capybara/rspec'

Capybara.app_host = ENV['ALLOW_ORIGIN']

describe 'visitor searches', :js, type: :feature do
  it 'sees a count' do
    visit '/'
    fill_in 'Search', with: 'adderall'
    check 'weight'
    click_on 'Search'

    within '#results svg' do
      within 'text.highcharts-title' do
        expect(page).to have_content '2178 Adverse Events Matching "adderall"'
      end
      expect(page).to have_selector 'g.highcharts-series path'
    end

    within '#facets .weight' do
      expect(page).to have_content 'Adverse Events by Weight'
    end
  end
end
