import React from 'react';
import Chart from 'chart';

let get = function (url, query) {
  return new Promise(function (fulfill, reject) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        fulfill(JSON.parse(request.responseText));
      }
    };
    request.send(query);
  });
};

let Form = React.createClass({
  getInitialState() {
    return {term: '', requests: 0};
  },
  search(e) {
    e.preventDefault();
    let term = e.target.search.value;
    this.setState({term: term, requests: this.state.requests + 1});
    get(`${API_URL}/events.json?q=${term}`).then(function (response) {
      if (response.events !== this.state.events) {
        this.props.onResultsChange(response.events, term);
      }
      this.setState({events: response.events, requests: this.state.requests - 1});
    }.bind(this));
  },
  summary() {
    let summary;
    if (this.state.requests > 0) {
      summary = (<p>Searching for "{this.state.term}" &hellip;</p>);
    } else if (this.state.term) {
      summary = (
        <section>
        <p>{this.state.events.length} events matched "{this.state.term}"</p>
        </section>
      );
    }
    return summary;
  },
  render() {
    return (
      <form onSubmit={this.search}>
        <label htmlFor='search'>Search</label>
        <input id='search' type='search' autoFocus />
        <input type='submit' value='Search' />
        {this.summary()}
      </form>
    );
  }
});

let Results = React.createClass({
  getInitialState() {
    return {results: []};
  },
  chart() {
    let chart = '';
    if (this.state.results.length) {
      chart = (
          <Chart data={this.state.results} term={this.state.term}/>
      );
    }
    return chart;
  },
  render() {
    return (
      <section id='results'>
        {this.chart()}
      </section>
    );
  }
});

let App = React.createClass({
  resultsChanged(results, term) {
    this.refs.results.setState({results: results, term: term});
  },
  render() {
    return (
      <main>
        <Form onResultsChange={this.resultsChanged} />
        <Results ref='results' />
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
