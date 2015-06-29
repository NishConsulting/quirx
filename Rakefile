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
    unless listener[frontend_port]
      sh("ruby -run -e httpd -- frontend/build --port=%s &" % frontend_port)
    end
  end

  task ci: %i[serve_frontend ensure_rack spec]

  task default: :spec

  namespace :deploy do
    task frontend: %i[frontend:clean frontend:build frontend:commit]

    task :backend do
      sh("git push -f heroku master")
    end

  end

  namespace :frontend do
    task build: :dotenv do
      sh("cd frontend && npm run pack")
    end

    task :clean do
      sh("rm -rf frontend/build")
    end

    task :clone do
      sh("git clone -b gh-pages git@github.com:hashrocketeer/quirx.git temp-gh-pages")
    end

    task commit: :clone do
      Dir.chdir 'temp-gh-pages' do
        sh("cp -r ../frontend/build/* .")
        sh("git add -A")
        sh("git commit -m 'deploy frontend'")
        sh("git push")
      end
      sh("rm -rf temp-gh-pages")
    end
  end

  task deploy: %i[deploy:frontend deploy:backend]
rescue LoadError
end
