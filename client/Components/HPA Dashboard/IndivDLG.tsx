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

const IndivDLG = ({ graphData, graphTitle }) => {
  const [open, setOpen]: any = useState(false);
  // customize Chatjs graph options
  const options: any = {
    responsive: true,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'HTTP Request vs Pod Count',
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

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  useEffect(() => {
    graphData.datasets = graphData.datasets.map(el => {
      el.pointStyle = false;
      return el;
    });
  }, []);

  return (
    <div className='metric-container'>
      <h4 className='metric-title'>{graphTitle}</h4>
      {graphData.hasOwnProperty('labels') && (
        <Line data={graphData} options={options} onClick={openModal} />
      )}
      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
          <h4 className='metric-title'>{graphTitle}</h4>
          {graphData.hasOwnProperty('labels') && (
            <Line data={graphData} options={optionsWithLegend} />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default IndivDLG;
