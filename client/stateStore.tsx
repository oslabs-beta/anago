import React, { useState } from 'react';

export const StoreContext = React.createContext('null');

//creating the type for the children components passed into the state store function
type Props = {
  children: React.ReactNode;
};

//setting the type of the children components as the type declared above
export default ({ children }: Props) => {
  const [testState, setTestState] = useState([]);

  interface States {
    testState: testState;
    setTestState: setTestState;
  }

  return (
    <StoreContext.Provider value={States}>{children}</StoreContext.Provider>
  );
};
