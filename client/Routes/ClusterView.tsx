import { useRouteLoaderData, Outlet } from 'react-router-dom';
import Dropdown from '../Components/Visualizer/Dropdown';
import { Node } from '../../types';
import Nodes from '../Components/Visualizer/Nodes';
import ControlPlane from '../Components/Visualizer/ControlPlane';
import React from 'react';

const ClusterView = () => {
  const clusterData: any = useRouteLoaderData('cluster');
  console.log('retrieved clusterData', clusterData);
  const nodes: Node[] = clusterData.nodes;

  console.log(clusterData);
  

  return (
    <div className='cluster-view' key={'cluster-view'}>
      {clusterData && <Dropdown />}
      <ControlPlane />
      {clusterData &&
        nodes.map(node => (
          <Nodes
            name={node.name}
            creationTimestamp={node.creationTimestamp}
            labels={node.labels}
            id={node.uid}
            providerID={node.providerID}
            status={node.status}
            nodeName={undefined}
            key={node.uid}
          />
        ))}
    </div>
  );
};

export default ClusterView;
