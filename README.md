[![Build Status](https://api.travis-ci.org/NishConsulting/quirx.svg?branch=master)](https://travis-ci.org/NishConsulting/quirx)

# ADS-I-BPA-Development-Prototype
NISH Consulting Inc Response to RFQ 4QTFHS150004 for Agile Delivery Services (ADS I) BPA 
Pool 2: Development :pill: Qui℞

# :pill: Qui℞
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

Qui℞ uses Rspec for unit/integration testing. In order to run the tests, you need to have both the frontend and backend servers running (`rake backend:start` and `rake frontend:start`). Then you can run the tests by typing `rake`

## Deployment

Qui℞ is currently hosted on two platforms: the backend is deployed to PaaS provider [Heroku](https://heroku.com).
The frontend is hosted by [GitHub Pages](https://pages.github.com/).

Qui℞ uses rake to deploy both the frontend and the backend. There are 3 main deploy tasks available.

1. `rake deploy` - Run task 2 and 3.
2. `rake deploy:backend` - Only deploy the backend
3. `rake deploy:frontend` - Only deploy the frontend

## Open Source

Qui℞ is and Open Source project and also utilizes the following Open Source tools:

**Backend**

1. [Ruby](https://www.ruby-lang.org/en/)
2. [Rack](http://rack.github.io/)

**Frontend**

3. [React](http://facebook.github.io/react/)
4. [HighCharts](http://www.highcharts.com/)

**Build**

5. [Rake](https://github.com/ruby/rake)
6. [Webpack](http://webpack.github.io/)

## Process

See [Process](docs/process.md)

## License

Qui℞ is Copyright © 2015 Nish Consulting. It is free software, and may be redistributed under the terms specified in the [LICENSE](LICENSE) file.
