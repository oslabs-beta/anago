import React, { useState } from 'react';

export const StoreContext = React.createContext({});

//creating the type for the children components passed into the state store function
export type Props = {
  children: React.ReactNode;
};

//declaring the parameter type Props to assign children to a ReactNode type
export default ({ children }: Props) => {
  const [currentCluster, setCurrentCluster] = useState('');
  const [clusterCache, setClusterCache] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [currentDashboard, setCurrentDashboard] = useState<String[]>([]);
  const [hasFetchedUserData, setHasFetchedUserData] = useState(false);

  const States = {
    currentCluster: currentCluster,
    setCurrentCluster: setCurrentCluster,
    clusterCache: clusterCache,
    setClusterCache: setClusterCache,
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    currentDashboard: currentDashboard,
    setCurrentDashboard: setCurrentDashboard,
    hasFetchedUserData: hasFetchedUserData,
    setHasFetchedUserData: setHasFetchedUserData,
  };

  return (
    <StoreContext.Provider value={States}>{children}</StoreContext.Provider>
  );
};
