import React, { Suspense, useContext, useEffect, useState } from 'react';
import { StoreContext } from '../stateStore';
import { Line } from 'react-chartjs-2';

const MetricDisplay = ({ metricId }) => {
  const { currentMetrics }: any = useContext(StoreContext);
  const [fetchedData, setFetchedData] = useState(false);
  const [dataSet, setDataSet] = useState<any>({});

  useEffect(() => {
    fetch('/api/data/' + metricId)
      .then((res) => res.json())
      .then((res) => {
        console.log('Data results coming from ', metricId, ': ', res);
        setDataSet(res);
        setFetchedData(true);
      });
  }, []);

  if (fetchedData) {
    return (
      <div className="metric-display">
        <Line data={dataSet}></Line>
      </div>
    );
  } else {
    return (
      <div className="metric-display">
        <h3>Loading data...</h3>
      </div>
    );
  }
};

export default MetricDisplay;
