require 'pathname'
$:.unshift Pathname(__FILE__).dirname.join 'lib'
require 'quirx/app'

map '/' do
  run Quirx::App.new
end
