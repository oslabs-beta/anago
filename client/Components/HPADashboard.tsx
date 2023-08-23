import React, { useEffect, useState } from 'react';
import { UserData } from '../../types';
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
  const metricIds: string[] = Object.keys(userData.metrics).slice(7);

  // split metrics into their appropriate grouping components
  const table: string[] = [];
  let log: string | undefined = '';
  const doubleLineGraph: string[] = [];
  metricIds.forEach(id => {
    userData.metrics[id].graphType === 0
      ? table.push(id)
      : doubleLineGraph.push(id);
  });
  log = table.pop();

  // fetch hpa table specific metrics to display
  const getTableData = async () => {
    // perserve the order of the metric results after fetching
    const tableOrder = tableData;
    let count = 0;
    try {
      table.forEach(async id => {
        tableOrder.set(id, null);

        fetch(`/api/data/metrics/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: 'instant',
          }),
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
          .catch(err => console.log('err', err));
      });
    } catch (err) {
      console.log(err);
    }
  };
  //  retrieve hpa table data on mount
  useEffect(() => {
    getTableData();
  }, []);

  return (
    <div>
      {fetchCount === 7 && (
        <TableDisplay
          tableData={tableData}
          logId={log}
          graphIds={doubleLineGraph}
        />
      )}
      <DoubleLineGraph metricIds={doubleLineGraph} />
      {/* reccomendations */}
    </div>
  );
};

export default HPADisplay;
