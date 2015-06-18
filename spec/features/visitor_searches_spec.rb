require 'capybara/rspec'
require 'app'

describe 'visitor searches', :js, type: :feature do
  before { Capybara.app = App }
  it 'sees a count' do
    visit '/'
    fill_in 'Search', with: 'engorged'
    click_on 'Search'
    expect(page).to have_content '100 events matched "engorged"'
  end
end
