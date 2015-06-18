require 'pathname'
require 'haml'
root = Pathname(__FILE__).join('../..')
App = -> (env) do
  [200, {}, [Haml::Engine.new(root.join('templates/index.haml').read).render]]
end
