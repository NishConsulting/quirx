import React from 'react';
import Chart from 'chart';
import SexChart from 'sex-chart';
import WeightChart from 'weight-chart';
import _ from 'lodash';
import api from 'api';

/*
app:
  pendingRequests: 0
  term: ''
  activeFacets: ['weight']
  data: []
  facets:
    - name: 'weight', data: [], active: true
    - name: 'sex', data
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
      result.push(<li key={name}><label>{name}<input ref={name} type='checkbox'/></label></li>);
    }, []);
    return (
      <form onSubmit={this.search}>
        <fieldset>
          <label htmlFor='search'>Search</label>
          <input ref='term' id='search' type='search' autoFocus />
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

let Results = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    term: React.PropTypes.string.isRequired
  },
  chart() {
    let chart = '';
    if (this.props.data.length) {
      chart = (
          <Chart data={this.props.data} term={this.props.term}/>
      );
    }
    return chart;
  },
  render() { return (<section id='results'>{this.chart()}</section>); }
});

let Facets = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
  },
  chartFor(facet) {
    const charts = {
      sex: (<SexChart data={facet.data}/>),
      weight: (<WeightChart data={facet.data}/>),
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
        {name: 'weight', active: false, data: [] },
        {name: 'sex', active: false, data: [] }
      ],
      data: []
    };
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

    api.events(term, 'date').then((response)=> {
      if (response.events !== this.state.data) {
        this.setState({
          data: response.events,
          requests: this.state.requests - 1
        });
      }
    });

    this.activeFacets().forEach((f)=> {
      api.events(term, f.name).then((response)=> {
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
  render() {
    return (
      <main>
        <Form onUserInput={this.formChanged} term={this.state.term} facets={this.facetMap()} />
        <Results data={this.state.data} term={this.state.term}/>
        <Facets data={this.activeFacets()} />
      </main>
    );
  }
});
React.render(<App />, document.getElementById('content'));
