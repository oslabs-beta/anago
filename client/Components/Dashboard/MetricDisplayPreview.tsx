import { useEffect, useState } from 'react';
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
  Legend
);

//
// Largely a copy of Metric Display, but takes fetched data instead of metricId
//

const MetricDisplay = ({ lookupType, metricData }) => {
  //state to handle modal and handling fetched data router
  const [open, setOpen]: any = useState(false);

  // display options for metrics
  const options: any = {
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
  };

  // Most axes should always start at 0, but some may not -- uncomment next line and add items that may not need 0-basis for plotting
  // if (![].includes(lookupType))
  Object.assign(options, { scales: { y: { beginAtZero: true } } });
  // Some axes should go up to ~100
  if ([4, 7].includes(lookupType))
    Object.assign(options, {
      scales: { y: { suggestedMax: 100, suggestedMin: 0 } },
    });

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='metric-container'>
      <Line data={metricData} options={options} onClick={openModal} />
      <div className='modal'>
        {/* {metricId && <button onClick={openModal}>See more</button>} */}
        <Modal open={open} onClose={closeModal}>
          <h4 className='metric-title'>Query Preview</h4>
          <Line
            data={metricData}
            options={{
              ...options,
              plugins: {
                legend: {
                  display: true,
                },
              },
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default MetricDisplay;
