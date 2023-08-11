import { useEffect, useState } from 'react';
import { UserData } from '../types';
import { Modal } from 'react-responsive-modal';
// import 'react-responsive-modal/styles.css';

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
import {
  useLocation,
  useNavigate,
  useRouteLoaderData,
  Link,
  useParams,
} from 'react-router-dom';
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

const MetricDisplay = ({ metricId }) => {
  const userData = useRouteLoaderData('home') as UserData;

  const { id } = useParams();

  const [open, setOpen]: any = useState(false);
  const [metricData, setMetricData]: any = useState({});

  useEffect(() => {
    console.log('Current user in metric:', userData);
    fetch(`/api/data/metrics/${metricId}`, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        console.log('fetched data', data);
        setMetricData(data);
      })
      .catch(err => console.log(err));
  }, []);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  console.log('metric data: ', metricData);

  return (
    <div className='metric-container'>
      <h4 className='metric-title'>{userData.metrics[metricId].metricName}</h4>
      {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
          <h4 className='metric-title'>
            {userData.metrics[metricId].metricName}
          </h4>
          {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
        </Modal>
      </div>
    </div>
  );
};
// const MetricDisplay = ({ metricId }) => {
//   const { currentUser }: any = useContext(StoreContext);
//   const [metricData, setMetricData]: any = useState({});

//   useEffect(() => {
//     console.log('Current user:', currentUser);
//     fetch(`/api/data/metrics/${metricId}`, {
//       method: 'GET',
//     })
//       .then((data) => data.json())
//       .then((data) => {
//         console.log('fetched data', data);
//         setMetricData(data);
//       });
//   }, []);

//   console.log('metric data: ', metricData);
//   return (
//     <div className="metric-container">
//       <h4 className="metric-title">
//         {currentUser.metrics[metricId].metricName}
//       </h4>
//       {metricData.hasOwnProperty('labels') && <Line data={metricData} />}
//     </div>
//   );
// };

export default MetricDisplay;
