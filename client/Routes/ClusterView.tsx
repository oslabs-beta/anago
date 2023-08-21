import { useRouteLoaderData, Outlet } from 'react-router-dom';
import { Dropdown } from '../Components/Visualizer/Dropdown.tsx';
import { Node } from '../../types.ts';
import Nodes from '../Components/Visualizer/Nodes.tsx';
import ControlPlane from '../Components/Visualizer/ControlPlane.tsx';
import React from 'react';
import AlertBar from '../Components/AlertBar.tsx';

const ClusterView = () => {
  const clusterData: any = useRouteLoaderData('cluster');
  const nodes: Node[] = clusterData.nodes;

  return (
    <div>
      <AlertBar />
      <div className='cluster-view' key={'cluster-view'}>
        {clusterData && <Dropdown />}
        <ControlPlane />
        {clusterData &&
          nodes.map((node) => (
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
    </div>
  );
};

export default ClusterView;
