import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import MetricDisplay from './MetricDisplay';
import { UserData } from '../../../types';
import {
  useRouteLoaderData,
  useParams,
  Outlet,
  useLocation,
} from 'react-router-dom';
import AddMetric from './AddMetric';
import AlertBar from '../AlertBar';

const Dashboard = () => {
  const userData = useRouteLoaderData('home') as UserData;
  const { id } = useParams();

  const [lastUpdate, setLastUpdate] = useState<Date>();
  const [addMetricModal, setAddMetricModal] = useState(false);
  //edit mode
  const [editMode, setEditMode] = useState<Boolean>(false);

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  //pithy rendering example
  const refresh = () => setLastUpdate(new Date());
  const pithy = () => {
    try {
      fetch('/api/pithy')
        .then((res) => res.json())
        .then((res) => {
          setTimeout(() => pithy(), 100000);
        });
    } catch {
      console.log('failed to fetch pithy');
    }
  };

  function saveMetricsAndReload() {
    setEditMode(false);
    window.location.reload();
    return;
  }

  const metricIds = Object.keys(userData.metrics);

  return (
    <div>
      <AlertBar />
      <div className='dashboard-outer'>
        {id && (
          <>
            <h2 className='dashboard-title'>
              {userData.dashboards[id].dashboardName}
            </h2>
            <div className='dashboard-buttons'>
              <span>
                <button className='btn' onClick={refresh}>
                  Refresh
                </button>
              </span>
              <span>
                <button className='btn' onClick={pithy}>
                  Pithy Loop
                </button>
              </span>
              <span>
                <button className='btn' onClick={() => setAddMetricModal(true)}>
                  Add Metric
                </button>
              </span>
              {!editMode && (
                <span>
                  <button className='btn' onClick={() => setEditMode(true)}>
                    Edit Mode
                  </button>
                </span>
              )}
              {editMode && (
                <span>
                  <button className='btn' onClick={saveMetricsAndReload}>
                    Save Metrics
                  </button>
                </span>
              )}
            </div>
            <div className='dashboard-container'>
              {metricIds.map((metricId) => (
                <MetricDisplay
                  metricId={metricId}
                  key={metricId + lastUpdate}
                  editMode={editMode}
                />
              ))}
              <Outlet />
            </div>
            <div>
              <p>Last updated: {`${lastUpdate}`}</p>
            </div>
          </>
        )}
        <div className='modal'>
          <Modal open={addMetricModal} onClose={() => setAddMetricModal(false)}>
            <AddMetric
              dashboard={location}
              setAddMetricModal={setAddMetricModal}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
