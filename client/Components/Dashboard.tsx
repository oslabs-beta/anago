import React, { useContext, useEffect, useState } from 'react';
import { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../stateStore';
import MetricDisplay from './MetricDisplay';

const Dashboard = () => {
  const { currentMetrics }: any = useContext(StoreContext);
  const [displayMetrics, setDisplayMetrics] = useState<JSX.Element[]>([]);

  function printMetricDisplay() {
    console.log(displayMetrics);
    setTimeout(() => printMetricDisplay(), 5000);
  }
  setTimeout(() => printMetricDisplay(), 5000);

  useEffect(() => {
    const newDisplayMetrics = currentMetrics.map((el) => {
      console.log('adding a metric display');
      return <MetricDisplay metricId={el} />;
    });
    console.log('settingDisplayMetrics', newDisplayMetrics);
    setDisplayMetrics(newDisplayMetrics);
  }, [currentMetrics]);

  return <div className="gallery-container">{displayMetrics}</div>;
};

export default Dashboard;
