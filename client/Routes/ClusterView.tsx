import { useRouteLoaderData } from 'react-router-dom';
import Clusters from '../Components/Visualizer/Cluster';

import { Node } from '../types';
import Nodes from '../Components/Visualizer/Nodes';

const ClusterView = () => {
  const clusterData: any = useRouteLoaderData('cluster');

  const nodes: Node[] = clusterData.nodes;

  console.log('cluster nodes', nodes);
  return (
    <div className='cluster-view'>
      <p>This is the ClusterView page</p>
      <Clusters></Clusters>
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
