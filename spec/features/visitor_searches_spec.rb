require 'capybara/rspec'
require 'capybara/poltergeist'
require 'app'

Capybara.javascript_driver = :poltergeist
Capybara.app = App

describe 'visitor searches', :js, type: :feature do
  it 'sees a count' do
    visit '/'
    fill_in 'Search', with: 'engorged'
    click_on 'Search'
    expect(page).to have_content '100 events matched "engorged"'
  end
end
