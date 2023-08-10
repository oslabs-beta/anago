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
  Legend,
);

const MetricDisplay = ({ metricId }) => {
  //useEffect(() => {
  //   console.log('in use effect', currentDashboard);
  //   currentDashboard.metrics.forEach(metricId => {
  //     //console.log(`/api/data/metrics/${metricId}`)
  //     fetch(`/api/data/metrics/${metricId}`, {
  //       method: 'GET',
  //     })
  //       .then(data => data.json())
  //       .then(data => {
  //         console.log('fetched data', data);
  //         const newMetrics = [...currentMetrics];
  //         if (newMetrics.length === 8) return;
  //         else {
  //           newMetrics.push(<MetricDisplay key={metricId} />);
  //           setCurrentMetrics(newMetrics);
  //         }
  //       });
  //   });
  // }, [currentUser]);

  return (
    <div>
      <h1>This is a metric named {metricId}</h1>
    </div>
  );
};

export default MetricDisplay;
