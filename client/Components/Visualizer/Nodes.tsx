import Namespaces from './Namespaces';
import { useRouteLoaderData } from 'react-router-dom';

const Nodes = ({ name, creationTimestamp, labels, id, providerID, status }) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const namespaces = clusterData.namespaces;

  console.log('in nodes', namespaces);

  return (
    <div className='node'>
      <h2>{name}</h2>
      <div className='namespace-container'>
        <p>this is within the namespace container</p>
        {namespaces.map(namespace => {
          <Namespaces
            id={namespace.uid}
            name={namespace.name}
            creationTimestamp={namespace.creationTimestamp}
            phase={namespace.phase}
          />;
        })}
      </div>
    </div>
  );
};

export default Nodes;
