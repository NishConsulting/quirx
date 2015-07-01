import React from 'react';
import Chart from 'chart';
import Facets from 'facets';
import Form from 'form';
import api from 'api';
import _ from 'lodash';
require('./styles.css');

/*
app:
  pendingRequests: 0
  term: ''
  series:
    total: []
    sex:
      - label: 'sex: male'
      - data: []
    weight: []
  facets:
    - name: 'weight', data: [], active: true, filter: 48.8
    - name: 'sex', data [], active: true, filter: 0
    - name: 'drug', data
*/
let App = React.createClass({
  getInitialState() {
    return {
      requests: 0,
      term: '',
      facets: [
        {name: 'weight', active: false, data: [], filter: null},
        {name: 'sex', active: false, data: [], filter: null}
      ],
      series: {total: []}
    };
  },
  filter() {
  },
  formChanged(term, facets) {
    let updatedFacets = this.state.facets.map(function (facet) {
      facet.active = facets[facet.name];
      return facet;
    });

    this.setState({
      term: term,
      facets: updatedFacets,
      requests: this.state.requests + 1
    });

    api.events({q: term, count: 'date'}).then((response)=> {
      this.setState({
        series: { total: response.events },
        requests: this.state.requests - 1
      });
    });

    this.activeFacets().forEach((f)=> {
      api.events({q: term, count: f.name}).then((response)=> {
        if (response.events !== f.data) {
          f.data = response.events;
          let others = this.state.facets.filter(function (facet) {
            return facet.name !== f.name;
          });
          others.push(f);
          this.setState({facets: others});
        }
      });
    });
  },
  facetMap() {
    return this.state.facets.reduce(function (o, f) {
      o[f.name] = f.active;
      return o;
    }, {});
  },
  activeFacets() {
    return this.state.facets.filter(function (f) { return f.active; });
  },
  addSeriesForFacet(facetName, term, label) {
    let query = {q: this.state.term, count: 'date'};
    let facet = _.chain(this.state.facets).where({name: facetName}).first().value();
    facet.filter = term;
    this.setState({facets: this.state.facets});
    query[facetName] = term;
    api.events(query)
    .then((response)=> {
      this.state.series[`${facetName}: ${label}`] = response.events;
      this.setState({series: this.state.series});
    });
  },
  series() {
    return _.transform(this.state.series, function (result, value, name) {
      result.push({name: name, data: value});
    }, []);
  },
  render() {
    return (
      <main>
        <Form onUserInput={this.formChanged} term={this.state.term} facets={this.facetMap()} />
        <Chart series={this.series()} term={this.state.term} />
        <Facets data={this.activeFacets()} select={this.addSeriesForFacet} />
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
