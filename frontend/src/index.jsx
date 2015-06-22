import React from 'react';

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
  getInitialState: function () {
    return {events: [], term: ''};
  },
  search: function (e) {
    e.preventDefault();
    let term = e.target.search.value;
    this.setState({term: term});
    get(`${API_URL}/events.json?q=${term}`).then(function (response) {
      this.setState({events: response.events});
    }.bind(this));
  },
  render: function () {
    return (
      <main>
      <form onSubmit={this.search}>
        <label htmlFor='search'>Search</label>
        <input id='search' type='search' autoFocus />
        <input type='submit' value='Search' />
      </form>
      <p>{this.state.events.length} events matched "{this.state.term}"</p>
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
