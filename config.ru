require 'pathname'
$:.unshift Pathname(__FILE__).dirname.join 'lib'
require 'quirx/app'
require 'newrelic_rpm' if ENV['RACK_ENV'] == 'production'

map '/' do
  run Quirx::App.new
end
