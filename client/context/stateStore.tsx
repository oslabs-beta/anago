import React, { useState } from 'react';

export const StoreContext = React.createContext({});

//creating the type for the children components passed into the state store function
export type Props = {
  children: React.ReactNode;
};

//declaring the parameter type Props to assign children to a ReactNode type
function StoreProvider({ children }: Props) {

  const [currentMetrics, setCurrentMetrics] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState<String[]>([]);
  const [hasFetchedUserData, setHasFetchedUserData] = useState(false);
  //manages selected items in the dropdown
  const [selectedStates, setSelectedStates] = useState({})
  //manages currently displayed alerts
  const [displayedAlerts, setDisplayedAlerts] = useState<Object>([]);
  

  const States = {
    currentDashboard: currentDashboard,
    setCurrentDashboard: setCurrentDashboard,
    hasFetchedUserData: hasFetchedUserData,
    setHasFetchedUserData: setHasFetchedUserData,
    currentMetrics: currentMetrics,
    setCurrentMetrics: setCurrentMetrics,
    selectedStates: selectedStates,
    setSelectedStates: setSelectedStates,
    displayedAlerts: displayedAlerts,
    setDisplayedAlerts: setDisplayedAlerts,
  };

  return (
    <StoreContext.Provider value={States}>{children}</StoreContext.Provider>
  );
};
export default StoreProvider;