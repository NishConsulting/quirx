require 'spec_helper'
require 'capybara/rspec'

Capybara.app_host = ENV['ALLOW_ORIGIN']

describe 'visitor searches', :js, type: :feature do
  specify 'visitor sees totals chart' do
    visit '/'
    fill_in 'Term', with: 'adderall'
    click_on 'Search'

    within '#results svg' do
      within 'text.highcharts-title' do
        expect(page).to have_content '2178 Adverse Events Matching "adderall"'
      end
      expect(page).to have_selector 'g.highcharts-series path'
    end
  end

  context 'sex bucket' do
    specify 'visitor adds sex series to totals chart' do
      visit '/'
      fill_in 'Term', with: 'adderall'
      check 'sex'
      click_on 'Search'

      within '#facets .sex' do
        expect(page).to have_content 'Adverse Events by Sex'
      end
    end
  end
end
