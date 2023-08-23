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
  }

  // let indivGraphs: any;
  // const createIndivGraphs = cacheByHPA => {
  //   indivGraphs = Object.values(cacheByHPA).map(graphObj => {
  //     return <IndivDLG graphData={graphObj} />;
  //   });
  //   setGraphData(Object.values(cacheByHPA));
  //   console.log('complete');
  //   // setGraphData(true);
  // };

  const shapeData = () => {
    const cacheByHPA = {};
    // transform the data into the shape required for Chartjs multi axis line chart
    const finalShape: graphShape = {
      labels: metricData[queriesById['HTTP Requests Total']].labels,
      datasets: [
        // {
        //   label: metricData[queriesById['Number of Pods']].datasets[0].label,
        //   data: metricData[queriesById['Number of Pods']].datasets[0].data,
        //   borderColor: 'rgb(53, 162, 235)',
        //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
        //   yAxisID: 'y1',
        // },
      ],
    };

    // "created_by_name": "alertmanager-prometheus-kube-prometheus-alertmanager"
    // label: 'created_by_name="pithy-deployment-f77bd655c"';
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
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      });
      console.log('DoubleLineGraph cache', cacheByHPA);
    });

    // assign HTTP Requests Total, organized by endpoints, to the graph
    /*
    metricData[queriesById['HTTP Requests Total']].datasets.forEach(obj => {
      console.log('http req obj.label', obj.label);
      let r = Math.random() * 100 + 127;
      // finalShape.datasets.push({
      //   label: obj.label,
      //   data: obj.data,
      //   borderColor: `rgb(${r}, 99, 132)`,
      //   backgroundColor: `rgba(${r}, 99, 132, 0.5)`,
      //   yAxisID: 'y',
      // });
    });
    */
    //  "service": "prometheus-kube-prometheus-prometheus"
    metricData[queriesById['HTTP Requests Total']].datasets.forEach(obj => {
      let r = Math.random() * 100 + 127;
      console.log('obj.label', obj.label.slice(9, obj.label.indexOf(`-`)));
      if (
        cacheByHPA.hasOwnProperty(obj.label.slice(9, obj.label.indexOf(`-`)))
      ) {
        cacheByHPA[obj.label.slice(9, obj.label.indexOf(`-`))].datasets.push({
          label: obj.label,
          data: obj.data,
          borderColor: `rgb(${r}, 99, 132)`,
          backgroundColor: `rgba(${r}, 99, 132, 0.5)`,
          yAxisID: 'y',
        });
      }
    });

    // setGraphData(finalShape);
    setGraphData(cacheByHPA);
    // createIndivGraphs(cacheByHPA);
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
        .catch(err => console.log(err));
    });
  };

  //fetching data from Prometheus
  useEffect(() => {
    getPodsAndRequests();
  }, []);

  //   create double line graph once both metrics have been retrieved
  useEffect(() => {
    if (fetchCount === 2) {
      console.log('metricData', metricData);
      shapeData();
    }
  }, [fetchCount]);

  return (
    <div>
      {graphData &&
        Object.values(JSON.parse(JSON.stringify(graphData))).map(graphObj => {
          return <IndivDLG graphData={graphObj} />;
        })}
    </div>
  );
};

export default DoubleLineGraph;
