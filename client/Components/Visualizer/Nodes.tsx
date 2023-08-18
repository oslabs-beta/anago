import Namespaces from './Namespaces';
import { useRouteLoaderData } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import React from 'react';

const Nodes = ({
  name,
  creationTimestamp,
  labels,
  id,
  providerID,
  status,
  nodeName,
}) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const namespaces: any = clusterData.namespaces;
  const [open, setOpen]: any = useState(false);

  console.log('data', clusterData);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='node' id={id} key={id}>
      <div className='node-info'>
          <img
            className='k8logo'
            id='node-logo'
            src='client/assets/images/node.png'
            onClick={openModal}
          />
        </div>
      <div className='node-inner-border'>
        <div className='modal'>
          <Modal open={open} onClose={closeModal}>
            <div>
              <h2>Node Information:</h2>
              <h3>Node Name:</h3>
              <p>{name}</p>
              <h3>Creation Timestamp:</h3>
              <p>{creationTimestamp}</p>
              <h3>Provider & Region:</h3>
              <p>{providerID}</p>
              <p>{labels['topology.kubernetes.io/zone']}</p>
              <h3>Instance Type:</h3>
              <p>{labels['node.kubernetes.io/instance-type']}</p>
              <h3>Node Group:</h3>
              <p>{labels['alpha.eksctl.io/nodegroup-name']}</p>
              <h3>Architecture:</h3>
              <p>{labels['kubernetes.io/arch']}</p>
              <h3>Addresses: </h3>
              {clusterData &&
                status.addresses.map(address => {
                  return (
                    <p key={address.type}>
                      {address.type + ' Address: ' + address.address}{' '}
                    </p>
                  );
                })}
              <h3>Capacity: </h3>
              <p>{'Number of Pods: ' + status.capacity.pods}</p>

              <p>{'Total Memory Capacity: ' + status.capacity.memory}</p>
              <p>{'Available Memory: ' + status.allocatable.memory}</p>
              <p>{'Total CPU Capacity: ' + status.capacity.cpu}</p>
              <p>{'Available CPU: ' + status.allocatable.cpu}</p>

              <p>
                {'Attachable Volumes: ' +
                  status.capacity['attachable-volumes-aws-ebs']}
              </p>
              <h3>Conditions: </h3>
              {clusterData &&
                status.conditions.map(condition => {
                  return (
                    <div key={condition.type}>
                      <h4>{condition.type}</h4>
                      <p>{condition.message}</p>
                      <p>
                        {'Last Heartbeat Time: ' + condition.lastHeartbeatTime}
                      </p>
                      <p>
                        {'Last Transition Time: ' +
                          condition.lastTransitionTime}
                      </p>
                    </div>
                  );
                })}
              <p></p>
            </div>
          </Modal>
        </div>
        <div className='namespace-container'>
          {clusterData &&
            namespaces.map(namespace => (
              <Namespaces
                key={namespace.uid}
                id={namespace.uid}
                name={namespace.name}
                creationTimestamp={namespace.creationTimestamp}
                phase={namespace.phase}
                nodeName={name}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Nodes;
