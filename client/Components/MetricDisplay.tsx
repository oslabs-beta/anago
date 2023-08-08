import React, { useContext, useEffect, useState } from 'react';
import { Props, StoreContext } from '../stateStore';
import { MetricProps } from '../types';
//ChartJS imports
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

class MetricDisplay extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {data: {}};
  }

  componentDidMount(): void {
    console.log('mounted: fetching');
    fetch('/api/data/metrics/' + this.props.metricId)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          data: res,
        });
      });
  }

  render() {
    if (!this.state.data.hasOwnProperty('labels')) {
      return <div className="metric-display" />;
    }
    return (
      <div className="metric-display">
        <Line className="metric" data={this.state.data}></Line>
      </div>
    );
  }
}

export default MetricDisplay;
