import Namespaces from './Namespaces';
import { useRouteLoaderData } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/stateStore';
import MetricDisplayPreview from '../Dashboard/MetricDisplayPreview';
import { LookupType } from '../../../types';

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
  const [metricData1, setMetricData1]: any = useState({});
  const [metricData2, setMetricData2]: any = useState({});
  const { selectedStates, displayedAlerts }: any = useContext(StoreContext);

  //modal handler functions
  const openModal = () => {
    const nodeIp: string = name.slice(3).split('.')[0].replaceAll('-', '.');
    const nodeMetric1 = {
      name: '',
      lookupType: 4,
      duration: 259200,
      stepSize: 3600,
      scopeType: 0,
      context: 'Node',
      contextChoice: nodeIp,
    };
    const nodeMetric2 = {
      name: '',
      lookupType: 7,
      duration: 259200,
      stepSize: 3600,
      scopeType: 0,
      context: 'Node',
      contextChoice: nodeIp,
    };
    try {
      fetch('/api/data/metric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeMetric1),
      })
        .then((res) => res.json())
        .then((res) => {
          // Should verify query validity as part of this process
          setMetricData1(res.metricData);
        });
    } catch (err) {
      console.log('Error receiving metric preview: ', err);
    }
    try {
      fetch('/api/data/metric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeMetric2),
      })
        .then((res) => res.json())
        .then((res) => {
          // Should verify query validity as part of this process
          setMetricData2(res.metricData);
        });
    } catch (err) {
      console.log('Error receiving metric preview: ', err);
    }

    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  //determines how many nodes have been selected in dropdown by mapping over selected states stateful array
  const numNodes = Object.keys(selectedStates).filter(
    (item) => item.charAt(0) === 'i' && selectedStates[item] === true
  ).length;

  //if no nodes are selected (default, all nodes will display) or the node's name is selected, display the node and its child components. else, display null.
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
            <h2>Node Information:</h2>
            <div className='modal-content'>
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
                <table className='addresses'>
                  <h3>Addresses: </h3>
                  <tr className='column-names'>
                    {clusterData &&
                      status.addresses.map((address) => {
                        return (
                          <th key={address.type + address.id}>
                            {address.type}
                          </th>
                        );
                      })}
                  </tr>
                  <tr className='table-row'>
                    {clusterData &&
                      status.addresses.map((address) => {
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
                <table className='capacity'>
                  <h3>Capacity: </h3>
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
                <table className='conditions'>
                  <h3>Conditions: </h3>
                  <tr className='column-names'>
                    {clusterData &&
                      status.conditions.map((condition) => {
                        return <th key={condition.type}>{condition.type}</th>;
                      })}
                  </tr>

                  <tr className='table-row'>
                    {clusterData &&
                      status.conditions.map((condition) => {
                        return (
                          <td key={condition.message}>{condition.message}</td>
                        );
                      })}
                  </tr>
                  <tr className='table-row'>
                    {clusterData &&
                      status.conditions.map((condition) => {
                        return (
                          <td
                            key={condition.type + condition.lastHeartbeatTime}
                          >
                            {'Last Heartbeat Time: ' +
                              condition.lastHeartbeatTime}
                          </td>
                        );
                      })}
                  </tr>
                  <tr className='table-row'>
                    {clusterData &&
                      status.conditions.map((condition) => {
                        return (
                          <td
                            key={condition.type + condition.lastTransitionTime}
                          >
                            {'Last Transition Time: ' +
                              condition.lastTransitionTime}
                          </td>
                        );
                      })}
                  </tr>
                </table>
              </div>
              <div className='cluster-graphs'>
                <div className='new-metric-preview-image'>
                  {metricData1.hasOwnProperty('labels') && (
                    <div>
                      <h3>Available Memory in Node</h3>
                      <MetricDisplayPreview
                        metricData={metricData1}
                        lookupType={LookupType.MemoryFreeInNode}
                      />
                    </div>
                  )}
                </div>
                <div className='new-metric-preview-image'>
                  {metricData2.hasOwnProperty('labels') && (
                    <div>
                      <h3>Available Disk in Node</h3>
                      <MetricDisplayPreview
                        metricData={metricData2}
                        lookupType={LookupType.FreeDiskinNode}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <div className='namespace-container'>
          {clusterData &&
            namespaces.map((namespace) => (
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
