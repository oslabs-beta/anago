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
import IndivDLG from './IndivDLG';

const DoubleLineGraph = ({ metricIds }) => {
  const userData = useRouteLoaderData('home') as UserData;
  const queriesById = {
    'HTTP Requests Total': metricIds[0],
    'Number of Pods': metricIds[1],
  };

  //state to handle modal and handling fetched data router
  const [open, setOpen]: any = useState(false);
  const [metricData, setMetricData] = useState<any>({});
  const [fetchCount, setFetchCount] = useState<number>(0);
  const [graphData, setGraphData] = useState<any>(undefined);

  interface graphShape {
    labels: any[];
    datasets: any[];
    pointStyle: boolean;
  }

  const shapeData = () => {
    const cacheByHPA = {};
    // transform the data into the shape required for Chartjs multi axis line chart
    const finalShape: graphShape | any = {
      labels: metricData[queriesById['HTTP Requests Total']].labels,
      datasets: [],
    };

    // filter data to display a graph for each deployed hpa
    metricData[queriesById['Number of Pods']].datasets.forEach(obj => {
      cacheByHPA[
        obj.label.slice(obj.label.indexOf(`"`) + 1, obj.label.indexOf(`-`))
      ] = JSON.parse(JSON.stringify(finalShape));

      cacheByHPA[
        obj.label.slice(obj.label.indexOf(`"`) + 1, obj.label.indexOf(`-`))
      ].datasets.push({
        label: obj.label,
        data: obj.data,
        pointStyle: false,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      });
    });

    // assign HTTP Requests Total, organized by endpoints, to the graph
    metricData[queriesById['HTTP Requests Total']].datasets.forEach(obj => {
      let r = Math.random() * 100 + 127;
      if (
        cacheByHPA.hasOwnProperty(obj.label.slice(9, obj.label.indexOf(`-`)))
      ) {
        cacheByHPA[obj.label.slice(9, obj.label.indexOf(`-`))].datasets.push({
          label: obj.label,
          data: obj.data,
          pointStyle: false,
          borderColor: `rgb(${r}, 99, 132)`,
          backgroundColor: `rgba(${r}, 99, 132, 0.5)`,
          yAxisID: 'y',
        });
      }
    });
    // only display graphs that have metrics for both Pod Count and HTTP Requests
    Object.keys(cacheByHPA).forEach(key => {
      if (cacheByHPA[key].datasets.length < 2) {
        delete cacheByHPA[key];
      }
    });
    setGraphData(cacheByHPA);
  };

  const getPodsAndRequests = async () => {
    const currMetricCache: any = metricData;
    let count = 0;
    metricIds.forEach(id => {
      fetch(`/api/data/metrics/${id}`, {
        method: 'GET',
      })
        .then(data => data.json())
        .then(data => {
          currMetricCache[id] = data;
          setMetricData(currMetricCache);
          count += 1;
          setFetchCount(count);
        })
        .catch(err => console.log('Error fetching from Prometheus: ', err));
    });
  };

  //fetching data from Prometheus
  useEffect(() => {
    getPodsAndRequests();
  }, []);

  //   create double line graph once both metrics have been retrieved
  useEffect(() => {
    if (fetchCount === 2) {
      shapeData();
    }
  }, [fetchCount]);

  return (
    <div>
      {graphData &&
        Object.keys(JSON.parse(JSON.stringify(graphData))).map(hpa => {
          let title = hpa.slice(0, 1).toUpperCase() + hpa.slice(1);
          return <IndivDLG graphData={graphData[hpa]} graphTitle={title} />;
        })}
    </div>
  );
};

export default DoubleLineGraph;
