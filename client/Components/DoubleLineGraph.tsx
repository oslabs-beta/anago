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
  const [graphData, setGraphData] = useState<any>({});

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  const optionsWithLegend = JSON.parse(JSON.stringify(options));
  optionsWithLegend.plugins.legend.display = true;

  // warm color generator for lines on graph
  //  For Warm color : R from 128 to 255
  //   101 -> 199
  //   0.5
  // 50
  // 150

  const shapeData = () => {
    // transform the data into the shape required for Chartjs multi axis line chart
    const finalShape = {
      labels: metricData[queriesById['HTTP Requests Total']].labels,
      datasets: [
        // TODO: remove hard coded version once getting a response back for num of pods
        {
          label: 'Number of Pods',
          data: metricData[queriesById['Number of Pods']].datasets[0].data,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
        /*
        {
          label: 'Number of Pods',
          data: [
            1, 1, 2, 2, 1, 1, 3, 4, 5, 3, 1, 1, 2, 2, 1, 1, 3, 4, 5, 3, 1, 1, 2,
            2, 1, 1, 3, 4, 5, 3, 1, 1, 2, 2, 1, 1, 3, 4, 5, 3, 1, 1, 2, 2, 1, 1,
            3, 4, 5, 3, 1, 1, 2, 2, 1, 1, 3, 4, 5, 3, 6,
          ],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
        */
      ],
    };
    // assign HTTP Requests Total, organized by endpoints, to the graph
    metricData[queriesById['HTTP Requests Total']].datasets.forEach(obj => {
      let r = Math.random() * 100 + 127;
      finalShape.datasets.push({
        label: obj.label,
        data: obj.data,
        borderColor: `rgb(${r}, 99, 132)`,
        backgroundColor: `rgba(${r}, 99, 132, 0.5)`,
        yAxisID: 'y',
      });
    });

    setGraphData(finalShape);
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

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='metric-container'>
      {/* <h4 className='metric-title'>{userData.metrics[metricId].metricName}</h4> */}
      {graphData.hasOwnProperty('labels') && (
        <Line data={graphData} options={options} onClick={openModal} />
      )}
      <div className='modal'>
        {/* {metricId && <button onClick={openModal}>See more</button>} */}
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
          {/* <h4 className='metric-title'>
            {userData.metrics[metricId].metricName}
          </h4> */}
          {graphData.hasOwnProperty('labels') && (
            <Line data={graphData} options={optionsWithLegend} />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DoubleLineGraph;
