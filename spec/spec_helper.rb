require 'yaml'
require 'pathname'
Pathname('env.yml').tap do |file|
  YAML.load_file(file.to_s).each do |key, value|
    ENV[key.upcase] = value
  end if file.exist?
end
