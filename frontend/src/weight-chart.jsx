import React from 'react';
import _ from 'lodash';
import Highcharts from 'react-highcharts';

let WeightChart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
  },
  shouldComponentUpdate(props, state) {
    return !_.isEqual(this.props.data, props.data);
  },
  points() {
    return _.chain(this.props.data).sortBy(function (d) {
      return d.term;
    }).map(function (d) {
      return [d.term, d.count];
    }).value();
  },
  config() {
    return {
      title: {text: 'Adverse Events by Weight'},
      credits: { text: 'open fda', href: 'https://open.fda.gov' },
      xAxis: {
        title: {text: 'Weight (kg)'}
      },
      yAxis: {
        title: {
          text: 'Event count'
        },
        min: 0
      },
      plotOptions: {
        line: {
          tooltip: {
            headerFormat: '<b>{point.key} kg</b><br>'
          }
        }
      },
      series: [{
        name: 'count',
        data: this.points()
      }]
    };
  },
  render() {
    return (<Highcharts config={this.config()}/>);
  }
});

export default WeightChart;
