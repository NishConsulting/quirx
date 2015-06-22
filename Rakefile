begin
  require 'uri'
  require 'rspec/core/rake_task'
  require 'dotenv/tasks'
  RSpec::Core::RakeTask.new(:spec) do |task|
    task.verbose = false
  end

  listener = ->(pid) {
    system ("lsof -i tcp:%s" % pid), out: "/dev/null", err: "/dev/null"
  }

  task ensure_rack: :dotenv do
    rack_port = URI(ENV.fetch('QUIRX_API_HOST')).port
    spawn("bundle exec rackup") unless listener[rack_port]
  end

  task serve_frontend: :dotenv do
    frontend_port = URI(ENV.fetch('ALLOW_ORIGIN')).port
    sh("cd frontend && npm install && npm run pack")
    sh("cp frontend/templates/dev/index.html frontend/build")
    unless listener[frontend_port]
      sh("ruby -run -e httpd -- frontend/build --port=%s &" % frontend_port)
    end
  end

  task ci: %i[serve_frontend ensure_rack spec]

  task default: :spec
rescue LoadError
end
