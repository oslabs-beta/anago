import React, { useState } from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import { useRouteLoaderData } from 'react-router-dom';

const Dropdown = () => {
  const clusterData: any = useRouteLoaderData('cluster');

  const [data, setData] = useState([]);

  const prepareData = data => {
    data.splice(0, 0, {
      label: 'Select All',
      value: 'selectAll',
      className: 'select-all',
    });
    setData(data);
  };

  prepareData(clusterData);
  console.log('prepared data', data);

  const toggleAll = checked => {
    const dataArr:any = [...data]
    for (let i = 1; i < dataArr.length; i++) {
      dataArr[i].checked = checked;
    }
    setData(dataArr)
  };

  const handleChange:any = ({ value, checked }) => {
    if (value === 'selectAll') toggleAll(checked);
  };

  return (
    <div>
      <DropdownTreeSelect data={data} onChange={handleChange} />
    </div>
  );
};


export default Dropdown;