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

let App = React.createClass({
  getInitialState() {
    return {events: [], term: '', requests: 0};
  },
  search(e) {
    e.preventDefault();
    let term = e.target.search.value;
    this.setState({term: term, requests: this.state.requests + 1});
    get(`${API_URL}/events.json?q=${term}`).then(function (response) {
      this.setState({events: response.events, requests: this.state.requests - 1});
    }.bind(this));
  },
  chart() {
    let chart = '';
    if (this.state.events.length && this.state.requests === 0) {
      chart = (
          <Chart data={this.state.events} term={this.state.term}/>
      );
    }
    return chart;
  },
  summary() {
    let summary;
    if (this.state.requests > 0) {
      summary = (<p>Searching for "{this.state.term}" &hellip;</p>);
    } else if (this.state.term) {
      summary = (<p>{this.state.events.length} events matched "{this.state.term}"</p>);
    }
    return summary;
  },
  render() {
    return (
      <main>
      <form onSubmit={this.search}>
        <label htmlFor='search'>Search</label>
        <input id='search' type='search' autoFocus />
        <input type='submit' value='Search' />
      </form>
      <section id='results'>
      {this.summary()}
      {this.chart()}
      </section>
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
