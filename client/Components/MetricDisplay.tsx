import React, { useContext, useEffect, useState } from 'react';
import { Props, StoreContext } from '../stateStore';
import { MetricProps } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class MetricDisplay extends React.Component<any, any> {
  constructor(props) {
    console.log('constructor');
    super(props);
    this.state = {
      data: {},
      metricId: props.metricId,
    };
  }

  demoData = {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      { label: 'default', data: [1, 2, 3, 4, 5] },
      { label: 'kube', data: [1, 2, 4, 4, 5] },
      { label: 'monitoring', data: [5, 4, 3, 4, 3] },
    ],
  };

  // componentDidMount(): void {
  //   console.log('mounted: fetching');
  //   fetch('/api/data/metrics/' + this.state.metricId)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log(
  //         'Data results coming from ',
  //         this.state.metricId,
  //         ': ',
  //         res
  //       );
  //       this.setState({
  //         data: {
  //           labels: [1, 2, 3, 4, 5],
  //           dataSets: [
  //             { label: 'default', data: [1, 2, 3, 4, 5] },
  //             { label: 'kube', data: [1, 2, 4, 4, 5] },
  //             { lable: 'monitoring', data: [5, 4, 3, 4, 3] },
  //           ],
  //         },
  //       });
  //     });
  // }

  // const [dataSet, setDataSet] = useState<any>({});

  // useEffect(() => {
  //   fetch('/api/data/metrics/' + metricId)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       console.log('Data results coming from ', metricId, ': ', res);
  //       setDataSet({
  //         labels: [1, 2, 3, 4, 5],
  //         dataSets: [
  //           { label: 'default', data: [1, 2, 3, 4, 5] },
  //           { label: 'kube', data: [1, 2, 4, 4, 5] },
  //           { lable: 'monitoring', data: [5, 4, 3, 4, 3] },
  //         ],
  //       });
  //     });
  // }, []);

  render() {
    // if (!this.state.data.hasOwnProperty('labels')) {
    //   return <div className="metric-display" />;
    // }
    return (
      <div className="metric-display">
        <Line className="metric" data={this.demoData}></Line>
      </div>
    );
  }
}

export default MetricDisplay;
