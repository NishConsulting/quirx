[![Build Status](https://api.travis-ci.org/NishConsulting/quirx.svg?branch=master)](https://travis-ci.org/NishConsulting/quirx)

# Qui℞
Qui℞ helps with finding spikes in FDA anomalies when trying to research and explain their causes.
See our prototype at http://nishconsulting.github.io/quirx

## Development

1. Clone the repo: `git clone https://github.com/NishConsulting/quirx.git`
2. Setup the environment variables using the `.env` file: `cp .env{.example,}`
3. Edit the variables to include your OpenFDA API key. More instructions are found in [.env.example](.env.example)
4. Install the RubyGems: `bundle`
5. Start the backend server: `rake backend:start`
6. Start the frontend server: `rake frontend:start`

Then you can visit `http://localhost:9999` in your browser

## Testing

Qui℞ uses Rspec for unit/integration testing. You can run the tests by typing `rake`

## Deployment

Qui℞ uses rake to deploy both the frontend and the backend. There are 3 main deploy tasks available.

1. `rake deploy` - Run task 2 and 3.
2. `rake deploy:backend` - Only deploy the backend
3. `rake deploy:frontend` - Only deploy the frontend

## Open Source

Qui℞ is and Open Source project and also utilizes the following Open Source tools:

1. [dotenv](https://github.com/bkeepers/dotenv)
2. [git](https://git-scm.com/)
3. [Ruby on Rails](http://rubyonrails.org/)

## Process

[See Process](docs/process.md)

## License

Qui℞ is Copyright © 2015 Nish Consulting. It is free software, and may be redistributed under the terms specified in the MIT-LICENSE file.

## Project tracker

We are using [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/1370420) to manage this project.

