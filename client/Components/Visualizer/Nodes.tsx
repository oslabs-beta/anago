import Namespaces from './Namespaces';
import { useRouteLoaderData } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import { useContext, useState } from 'react';
import React from 'react';
import { StoreContext } from '../../stateStore';

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
  const { selectedStates, displayedAlerts }: any = useContext(StoreContext);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  console.log('in node', displayedAlerts);

  const numNodes = Object.keys(selectedStates).filter(
    item => item.charAt(0) === 'i' && selectedStates[item] === true,
  ).length;

  return numNodes === 0 || selectedStates[name] ? (
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
            <div className='modal-content'>
              <h2>Node Information:</h2>
              <div className='info-item'>
                <h3>Node Name:</h3>
                <p>{name}</p>
              </div>
              <div className='info-item'>
                <h3>Creation Timestamp:</h3>
                <p>{creationTimestamp}</p>
              </div>
              <div className='info-item'>
                <h3>Provider & Region:</h3>
                <p>{providerID}</p>
                <p>{labels['topology.kubernetes.io/zone']}</p>
              </div>
              <div className='info-item'>
                <h3>Instance Type:</h3>
                <p>{labels['node.kubernetes.io/instance-type']}</p>
              </div>
              <div className='info-item'>
                <h3>Node Group:</h3>
                <p>{labels['alpha.eksctl.io/nodegroup-name']}</p>
              </div>
              <div className='info-item'>
                <h3>Architecture:</h3>
                <p>{labels['kubernetes.io/arch']}</p>
              </div>
              <div className='info-item'>
                <h3>Addresses: </h3>
                <table>
                  <tr className='column-names'>
                    {clusterData &&
                      status.addresses.map(address => {
                        return (
                          <th key={address.type + address.id}>
                            {address.type}
                          </th>
                        );
                      })}
                  </tr>
                  <tr className='table-row'>
                    {clusterData &&
                      status.addresses.map(address => {
                        return (
                          <td key={address.address + address.id}>
                            {address.address}
                          </td>
                        );
                      })}
                  </tr>
                </table>
              </div>
              <div className='info-item'>
                <h3>Capacity: </h3>
                <table>
                  <tr className='column-names'>
                      <th>Number of Pods:</th>
                      <th>Total Memory Capacity:</th>
                      <th>Available Memory:</th>
                      <th>Total CPU Capacity:</th>
                      <th>Available CPU:</th>
                      <th>Attachable Volumes:</th>
                  </tr>
                  <tr className='table-row'>
                      <td>{status.capacity.pods}</td>
                      <td>{status.capacity.memory}</td>
                      <td>{status.allocatable.memory}</td>
                      <td>{status.capacity.cpu}</td>
                      <td>{status.allocatable.cpu}</td>
                      <td>{status.capacity['attachable-volumes-aws-ebs']}</td>
                  </tr>
                </table>
              </div>
              <div className='info-item'>
                <h3>Conditions: </h3>
                
                <table>
                  <tr className="column-names">
                    {clusterData && status.conditions.map(condition => {
                      console.log(condition)
                      return (
                        <th key={condition.id}>{condition.type}</th>
                      )
                    })}
                  </tr>
                  <tr className='table-row'>

                {clusterData &&
                  status.conditions.map(condition => {
                    return (
                      <div key={condition.type+condition.id}>
                        <td>{condition.message}</td>
                        <td>{'Last Heartbeat Time: ' +
                            condition.lastHeartbeatTime}</td>
                        <td>{'Last Transition Time: ' +
                            condition.lastTransitionTime}</td>
                      </div>
                    );
                  })}
                  </tr>

                </table>
              </div>
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
  ) : null;
};

export default Nodes;
