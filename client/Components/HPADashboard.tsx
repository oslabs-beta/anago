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
import TableDisplay from './TableData';
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
  const userData = useRouteLoaderData('home') as UserData;
  const metricIds = Object.keys(userData.metrics).slice(7);
  //   metricIds.map(id => {
  //     console.log(userData.metrics[id]);
  //   });
  const table: string[] = [];
  const doubleLineGraph: string[] = [];
  metricIds.forEach(id => {
    userData.metrics[id].graphType === 0
      ? table.push(id)
      : doubleLineGraph.push(id);
  });

  return <div>{/* <TableDisplay metricIds={table} /> */}</div>;
};

export default HPADisplay;
