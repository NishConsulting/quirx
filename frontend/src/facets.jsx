import React from 'react';
import _ from 'lodash';
import WeightChart from 'weight-chart';
import SexChart from 'sex-chart';

let Facets = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    select: React.PropTypes.func.isRequired
  },
  changeSex(term, label) {
    this.props.select('sex', term, label);
  },
  selectWeights() {
    let [min, max] = _.chain(arguments).map(function (f) {
      let res = 1e2;
      return Math.round(f * res) / res;
    }).sortBy().value();

    // this.props.select('weight', [min, max].join('..'), `${min}kg - ${max}kg`);
    this.props.select('weight', [min, max].join('..'), '');
  },
  chartFor(facet) {
    const charts = {
      sex: (<SexChart data={facet.data} click={this.changeSex} />),
      weight: (<WeightChart data={facet.data} select={this.selectWeights}/>)
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

export default Facets;
