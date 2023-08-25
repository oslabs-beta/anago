import React, { useEffect, useState } from 'react';
import { UserData } from '../../../types';
import { Modal } from 'react-responsive-modal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Line, Chart } from 'react-chartjs-2';
import { useRouteLoaderData } from 'react-router-dom';
import TableDisplay from './TableDisplay';
import DoubleLineGraph from './DoubleLineGraph';
import AlertBar from '../AlertBar';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
  Title,
  Tooltip,
  Legend,
);

const HPADisplay = () => {
  const [tableData, setTableData]: any = useState(new Map());
  const [fetchCount, setFetchCount] = useState(0);

  const userData = useRouteLoaderData('home') as UserData;
  const metricIds: string[] = userData.dashboards[1].metrics;

  // split metrics into their appropriate grouping components
  const table: string[] = [];
  const log = metricIds[metricIds.length - 1];
  const doubleLineGraph: string[] = [];
  metricIds.slice(0, metricIds.length - 1).forEach(id => {
    userData.metrics[id].graphType === 0
      ? table.push(id)
      : doubleLineGraph.push(id);
  });

  // fetch hpa table specific metrics to display
  const getTableData = async () => {
    // perserve the order of the metric results after fetching
    const tableOrder = tableData;
    let count = 0;
    table.forEach(async id => {
      tableOrder.set(id, null);

      fetch(`/api/data/metrics/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((data: Response): any => {
          return data.json();
        })
        .then(data => {
          tableOrder.set(id, data);
          setTableData(tableOrder);
          count += 1;
          setFetchCount(count);
        })
        .catch(err =>
          console.log('Error fetching metrics from Prometheus:', err),
        );
    });
  };

  // fetch hpa table data on mount
  useEffect(() => {
    getTableData();
  }, []);

  return (
    <div>
      <AlertBar />
      <h2 className='dashboard-title'>HPA Monitoring & Testing Suite</h2>
      {fetchCount === 7 && (
        <TableDisplay
          tableData={tableData}
          logId={log}
          graphIds={doubleLineGraph}
        />
      )}
      <DoubleLineGraph metricIds={doubleLineGraph} />
    </div>
  );
};

export default HPADisplay;
