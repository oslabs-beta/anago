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

const MetricDisplay = ({ metricData }) => {
  //state to handle modal and handling fetched data router
  const [open, setOpen]: any = useState(false);

  // display options for metrics
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className="metric-container">
      <Line data={metricData} options={options} onClick={openModal} />
      <div className="modal">
        {/* {metricId && <button onClick={openModal}>See more</button>} */}
        <Modal open={open} onClose={closeModal}>
          <h4 className="metric-title">Query Preview</h4>
          <Line data={metricData} />
        </Modal>
      </div>
    </div>
  );
};

export default MetricDisplay;
