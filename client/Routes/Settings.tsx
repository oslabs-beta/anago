import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../stateStore';

import HPADashboard from '../Components/HPADashboard';

const Settings = () => {
  return (
    <>
      <h3>This is the settings page</h3>
      {<HPADashboard />}
    </>
  );
};

export default Settings;
