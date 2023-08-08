import React, { useContext, useEffect, useState } from 'react';
import { Props, StoreContext } from '../stateStore';
import { MetricProps } from '../types';

const MetricDisplay = () => {
  const { currentMetrics }: any = useContext(StoreContext);
  //console.log(currentMetrics);

  return <div className="metric-display">Metric Display</div>;
};

export default MetricDisplay;
