import { useRouteLoaderData, Outlet } from 'react-router-dom';

import { Node } from '../types';
import Nodes from '../Components/Visualizer/Nodes';
import ControlPlane from '../Components/Visualizer/ControlPlane';

const ClusterView = () => {
  const clusterData: any = useRouteLoaderData('cluster');
  console.log('retrieved clusterData', clusterData);
  const nodes: Node[] = clusterData.nodes;

  console.log('cluster services', clusterData.services);
  return (
    <div className='cluster-view'>
      <p>This is the ClusterView page</p>
      <ControlPlane/>
      {clusterData &&
        nodes.map(node => (
          <Nodes
            name={node.name}
            creationTimestamp={node.creationTimestamp}
            labels={node.labels}
            id={node.uid}
            providerID={node.providerID}
            status={node.status}
          />
        ))}
    </div>
  );
};

export default ClusterView;
