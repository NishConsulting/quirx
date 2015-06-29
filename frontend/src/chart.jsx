import React from 'react';
import Highcharts from 'react-highcharts';
import _ from 'lodash';

let dateMultiple = 24 * 60 * 60 * 1000;

const normalizePoints = function (data) {
  return data.map(function (d, i) {
    return [d.term * dateMultiple, d.count];
  });
};

let Chart = React.createClass({
  propTypes: {
    series: React.PropTypes.array.isRequired,
    term: React.PropTypes.string.isRequired
  },
  shouldComponentUpdate(props, state) {
    return !_.isEqual(this.props.series, props.series);
  },
  totalCount() {
    return _.find(this.props.series, function (s) {
      return s.name === 'total';
    }).data.length;
  },
  title() {
    return `${this.totalCount()} Adverse Events Matching "${this.props.term}"`;
  },
  config() {
    return {
      title: {text: this.title()},
      credits: { text: 'open fda', href: 'https://open.fda.gov' },
      xAxis: {
        type: 'datetime',
        title: {text: 'Date'}
      },
      yAxis: {
        title: {
          text: 'Event count'
        },
        min: 0
      },
      series: _.map(this.props.series, function (series) {
        return {
          name: series.name,
          data: normalizePoints(series.data)
        };
      })
    };
  },
  render() {
    let chart = '';
    if (this.totalCount()) {
      chart = (<Highcharts config={this.config()}/>);
    }
    return (<section id='results'>
            {chart}
            </section>);
  }
});

export default Chart;
