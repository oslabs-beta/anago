import React, { useState } from 'react';

export const StoreContext = React.createContext({});

//creating the type for the children components passed into the state store function
export type Props = {
  children: React.ReactNode;
};

//declaring the parameter type Props to assign children to a ReactNode type
export default ({ children }: Props) => {
  const [currentMetrics, setCurrentMetrics] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState<String[]>([]);
  const [hasFetchedUserData, setHasFetchedUserData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Number>();

  const States = {
    currentDashboard: currentDashboard,
    setCurrentDashboard: setCurrentDashboard,
    hasFetchedUserData: hasFetchedUserData,
    setHasFetchedUserData: setHasFetchedUserData,
    currentMetrics: currentMetrics,
    setCurrentMetrics: setCurrentMetrics,
    lastUpdate: lastUpdate,
    setLastUpdate: setLastUpdate,
  };

  return (
    <StoreContext.Provider value={States}>{children}</StoreContext.Provider>
  );
};
