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

      within '#results .highcharts-legend' do
        expect(all('text').map(&:text)).to eq ['total']
      end

      within '#facets .sex' do
        expect(page).to have_content 'Adverse Events by Sex'

        first('.sex .highcharts-series path').click
      end

      within '#results .highcharts-legend' do
        expect(all('text').map(&:text)).to eq ['total', 'sex: Female']
      end
    end
  end

  context 'weight bucket' do
    specify 'visitor adds weight series to totals chart' do
      visit '/'
      fill_in 'Term', with: 'adderall'
      check 'weight'
      click_on 'Search'

      within '#results .highcharts-legend' do
        expect(all('text').map(&:text)).to eq ['total']
      end

      within '#facets .weight' do
        expect(page).to have_content 'Adverse Events by Weight'

        selection_trigger = <<-JS % [90, 100]
          (function () {
            var container   = document.querySelector('.weight .highcharts-container');
            var weightChart = _.chain(Highcharts.charts).compact().find(function (chart) {
              return chart.container === container;
            }).value();
            weightChart.trigger('selection', {
              xAxis: [{min: %s,max: %s, axis: weightChart.xAxis[0]}],
              preventDefault: function () {}
            });
          })();
        JS
        page.execute_script(selection_trigger)
      end

      within '#results .highcharts-legend' do
        expect(all('text').map(&:text)).to eq ['total', 'weight:']
      end
    end
  end
end
