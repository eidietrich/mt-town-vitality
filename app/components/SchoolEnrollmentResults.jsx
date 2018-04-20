import React from 'react';

import TrendChart from './TrendChart.jsx';

export default class SchoolEnrollmentResults extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  render() {
    if(this.props.data === null) return null;

    const data = this.props.data.enrollment;

    const curYear = data.slice(-1)[0].year
    const curEnrollment = data.slice(-1)[0].enrollment
    const baseline = data[0].enrollment
    const baseYear = data[0].year
    const change = curEnrollment - baseline;
    const changeDirection = (change >= 0) ? 'up' : 'down'

    // enrollmentList = enrollment.enrollment.map(d => {
    //     return (<li key={d.year}>
    //       {`${d.year}: ${d.enrollment}`}
    //     </li>);
    //   }

    const description = `${curEnrollment} high school students in ${curYear} (${changeDirection} ${Math.abs(change)} from ${baseYear})`

    // calculate percent change
    data.forEach(d => {
      d.index = (d.enrollment / baseline - 1) * 100;
    })
    // const yMax = max(data, d => d.enrollment)

    const lineChart = <TrendChart
      data={data}
      trendFunction={(d, i, data) => {
        const baseline = data[0].enrollment;
        return {
          x: d.year,
          y: (d.enrollment / baseline - 1) * 100
        }
      }}
    />

    return (
      <div>
        <h4>Enrollment</h4>
        <p>{description}</p>
        {lineChart}
        <p>Data: Montana Office of Public Instruction</p>
      </div>
    );
  }


}