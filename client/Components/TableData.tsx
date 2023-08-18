import React, { useEffect, useState } from 'react';
import { UserData } from '../../types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Colors,
// } from 'chart.js';
// import { Line, Chart } from 'react-chartjs-2';
// import { useRouteLoaderData } from 'react-router-dom';
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Colors,
//   Title,
//   Tooltip,
//   Legend,
// );

const TableDisplay = ({ metricIds }) => {
  const [metricData, setMetricData]: any = useState({}[]);

  //   // display options for metrics
  //   const options = {
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //     },
  //   };
    
  //fetching data from Prometheus
  useEffect(() => {
    metricIds.forEach(async id => {
      try {
        const response = await fetch(`/api/data/metrics/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        console.log('fetched data', id, data);
        setMetricData(metricData.push(data));
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  return <div></div>;
};

export default TableDisplay;
