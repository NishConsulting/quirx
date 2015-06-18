require 'pathname'
root = Pathname(__FILE__).dirname
require root.join('lib/app')

map '/' do
  run App
end
