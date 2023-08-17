import { useRouteLoaderData, Outlet } from 'react-router-dom';

import { Node } from '../types';
import Nodes from '../Components/Visualizer/Nodes';
import ControlPlane from '../Components/Visualizer/ControlPlane';

export function cleanTime(date: string) {
  const newDate = new Date(date);
  const dateStr = newDate.toDateString().split(' ').slice(1, 3).join(' ')
  const time = newDate.toLocaleTimeString()
  return dateStr + ' ' + time;
}

const ClusterView = () => {
  const clusterData: any = useRouteLoaderData('cluster');
  console.log('retrieved clusterData', clusterData);
  const nodes: Node[] = clusterData.nodes;


  
  return (
    <div className='cluster-view'>
      {/* <ControlPlane/> */}
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
