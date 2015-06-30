import React from 'react';
import Chart from 'chart';
import SexChart from 'sex-chart';
import WeightChart from 'weight-chart';
import _ from 'lodash';
import api from 'api';
require('./styles.css');

/*
app:
  pendingRequests: 0
  term: ''
  series:
    total: []
    sex: []
    weight: []
  facets:
    - name: 'weight', data: [], active: true, filter: 48.8
    - name: 'sex', data [], active: true, filter: 0
    - name: 'drug', data
*/

let Form = React.createClass({
  propTypes: {
    onUserInput: React.PropTypes.func.isRequired,
    term: React.PropTypes.string.isRequired,
    facets: React.PropTypes.object.isRequired
  },
  search(e) {
    e.preventDefault();
    let updatedFacets = _.transform(this.props.facets, (result, value, name)=> {
      result[name] = this.refs[name].getDOMNode().checked;
    });
    this.props.onUserInput(this.refs.term.getDOMNode().value, updatedFacets);
  },
  render() {
    let facetToggles = _.transform(this.props.facets, function (result, value, name) {
      result.push(<li key={name}><label><input ref={name} type='checkbox'/> {name}</label></li>);
    }, []);
    return (
      <form onSubmit={this.search}>
        <fieldset>
          <legend>Search</legend>
          <label htmlFor='search'>Term</label>
          <input ref='term' id='search' name='term' type='search' autoFocus required />
          <input type='submit' value='Search' />
        </fieldset>
        <fieldset>
          <legend>Facets</legend>
          <ul>
            {facetToggles}
          </ul>
        </fieldset>
      </form>
    );
  }
});

let Facets = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired
  },
  changeSex(v) {
    this.props.select({sex: v});
  },
  chartFor(facet) {
    const charts = {
      sex: (<SexChart data={facet.data} click={this.changeSex} />),
      weight: (<WeightChart data={facet.data}/>)
    };
    return charts[facet.name];
  },
  render() {
    let items = this.props.data.map((facet)=> {
      return (<li className={facet.name} key={facet.name}>{this.chartFor(facet)}</li>);
    });
    return (<ul id='facets'>{items}</ul>);
  }
});

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
  filterByFacet(filter) {
    const name = _.keys(filter)[0];

    let facet = _.chain(this.state.facets).where({name: name}).first().value();
    facet.filter = filter[name];
    this.setState({facets: this.state.facets});
    api.events(_.merge({q: this.state.term, count: 'date'}, filter))
    .then((response)=> {
      this.state.series[name] = response.events;
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
        <Facets data={this.activeFacets()} select={this.filterByFacet} />
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
