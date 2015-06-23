import React from 'react';

let Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired
  },
  viewBox() {
    let data = this.props.data;
    if (!data.length) { return '0 0 0 0'; }
    let sorted = data.map(function (d) {
      return d.count;
    }).sort(function (a, b) {
      return a - b;
    });
    let max = sorted[sorted.length - 1];
    let min = sorted[0];
    let last = data[data.length - 1].time;
    let first = data[0].time;
    return [first, (max * -1), last - first, (max - min)].join(' ');
  },
  points() {
    return this.props.data.map(function (d, i) {
      return [d.time, d.count * -1].join();
    }).join(' ');
  },
  render() {
    return (<svg viewBox={this.viewBox()} width="100%" height="70%">
            <polyline strokeWidth="3" fill="cornflowerblue" stroke="cornflowerblue" points={this.points()}/>
            </svg>);
  }
});

export default Chart;
