import { Namespace } from '../../types';
import Namespaces from './Namespaces';
import { useRouteLoaderData } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useState } from 'react';

const Nodes = ({ name, creationTimestamp, labels, id, providerID, status }) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const namespaces: any = clusterData.namespaces;
  const [open, setOpen]: any = useState(false);

  console.log('in nodes', namespaces);



  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='node'>
      <h2>{name}</h2>
      <div className='namespace-container'>
        <p>this is within the namespace container</p>
        {clusterData &&
          namespaces.map(namespace => (
            <Namespaces
              id={namespace.uid}
              name={namespace.name}
              creationTimestamp={namespace.creationTimestamp}
              phase={namespace.phase}
            />
          ))}
          
      </div>
    </div>
  );
};

export default Nodes;
