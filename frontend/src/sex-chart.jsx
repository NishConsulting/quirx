import React from 'react';
import Highcharts from 'react-highcharts';
import _ from 'lodash';

const labels = ['Unknown', 'Male', 'Female'];

const SexChart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    click: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      click: function (sex) {
        console.log(labels[sex]);
      }
    };
  },
  shouldComponentUpdate(props, state) {
    return !_.isEqual(this.props.data, props.data);
  },
  points() {
    return this.props.data.map(function (d, i) {
      return [labels[d.term], d.count];
    });
  },
  config() {
    return {
      title: {text: 'Adverse Events by Sex'},
      credits: { text: 'open fda', href: 'https://open.fda.gov' },
      chart: { type: 'pie' },
      plotOptions: {
        series: {
          events: {
            click: (event)=> {
              let sex = event.point.state === 'hover' ? labels.indexOf(event.point.name) : null;
              this.props.click(sex);
            }
          }
        },
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: this.points()
      }]
    };
  },
  render() {
    return (<Highcharts config={this.config()}/>);
  }
});

export default SexChart;
