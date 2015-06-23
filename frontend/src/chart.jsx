import React from 'react';
import Highcharts from 'react-highcharts';

let dateMultiple = 24 * 60 * 60 * 1000;

let Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    term: React.PropTypes.string.isRequired
  },
  points() {
    return this.props.data.map(function (d, i) {
      return [d.time * dateMultiple, d.count];
    });
  },
  config() {
    return {
      title: {text: 'Adverse events'},
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
      series: [{
        name: this.props.term,
        data: this.points()
      }]
    };
  },
  render() {
    return (<Highcharts config={this.config()}/>);
  }
});

export default Chart;
