import React, { useState } from 'react';

export const StoreContext = React.createContext({});

//creating the type for the children components passed into the state store function
type Props = {
  children: React.ReactNode;
};

//declaring the parameter type Props to assign children to a ReactNode type
export default ({ children }: Props) => {
  const [currentMetrics, setCurrentMetrics] = useState<String[]>([]);
  const [currentCluster, setCurrentCluster] = useState('');
  const [clusterCache, setClusterCache] = useState({});

  const States = {
    currentMetrics: currentMetrics,
    setCurrentMetrics: setCurrentMetrics,
    currentCluster: currentCluster,
    setCurrentCluster: setCurrentCluster,
    clusterCache: clusterCache,
    setClusterCache: setClusterCache,
  };

  return (
    <StoreContext.Provider value={States}>{children}</StoreContext.Provider>
  );
};
