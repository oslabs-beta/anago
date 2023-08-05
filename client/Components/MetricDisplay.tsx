import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../stateStore';

const MetricDisplay = () => {
  const { currentMetrics }: any = useContext(StoreContext);
  console.log(currentMetrics);

  return <div className="metric-display">Metric Display</div>;
};

export default MetricDisplay;
