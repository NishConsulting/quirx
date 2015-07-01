import React from 'react';
import _ from 'lodash';
import Highcharts from 'react-highcharts';

let WeightChart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    select: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      select: function (min, max) {
        console.log(min, max);
      }
    };
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
      chart: {
        zoomType: 'x',
        events: {
          selection: (e)=> {
            e.preventDefault();
            let {min: min, max: max, axis: axis} = e.xAxis[0];

            axis.removePlotBand('selection-band');
            axis.addPlotBand({
              id: 'selection-band',
              from: min,
              to: max,
              color: 'rgba(0, 0, 0, 0.2)'
            });
            this.props.select(min, max);
          }
        }
      },
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
