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

  namespace :ci do
    task ensure_rack: :dotenv do
      spawn("bundle exec rackup") unless listener[9292]
    end

    task serve_frontend: 'frontend:build' do
      frontend_port = URI(ENV.fetch('ALLOW_ORIGIN')).port
      spawn("ruby -run -e httpd -- frontend/build --port=%s" % frontend_port) unless listener[frontend_port]
    end
  end

  task ci: %i[ci:serve_frontend ci:ensure_rack spec]

  task default: :spec

  namespace :deploy do
    task frontend: %i[frontend:build frontend:commit]

    task :backend do
      sh("git push -f heroku master")
    end
  end
  task deploy: %i[deploy:frontend deploy:backend]

  namespace :frontend do
    task install: :dotenv do
      Dir.chdir 'frontend' do
        sh("npm install")
      end
    end

    task build: :install do
      Dir.chdir 'frontend' do
        sh("npm run pack")
      end
    end

    task :commit do
      sh("git clone -b gh-pages git@github.com:nishconsulting/quirx.git temp-gh-pages")
      begin
        Dir.chdir 'temp-gh-pages' do
          sh("cp -r ../frontend/build/* .")
          sh("cp ../frontend/src/favicon.ico .")
          sh("git add -A")
          sh("git commit -m 'deploy frontend'")
          sh("git push")
        end
      ensure
        sh("rm -rf temp-gh-pages")
      end
    end
  end

  namespace :serve do
    task frontend: 'frontend:install' do
      Dir.chdir 'frontend' do
        sh("npm run server:start")
      end
    end

    task backend: :dotenv do
      sh("bundle exec rackup")
    end
  end

rescue LoadError
end
