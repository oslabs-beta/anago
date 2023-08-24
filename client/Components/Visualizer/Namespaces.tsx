import Deployments from './Deployments';
import Pods from './Pods';
import Services from './Services';
import Modal from 'react-responsive-modal';
import { useRouteLoaderData } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/stateStore';
import { cleanTime, handleAlerts } from '../../context/functions';
import { Pod, Service, Deployment, CleanAlert } from '../../../types';
import AlertFlag from './AlertFlag';

const Namespaces = ({ id, name, creationTimestamp, phase, nodeName }) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const { selectedStates, displayedAlerts }: any = useContext(StoreContext);
  const [namespaceAlerts, setNamespaceAlerts]: any = useState([]);
  const pods: Pod[] = clusterData.pods;
  const services: Service[] = clusterData.services;
  const deployments: Deployment[] = clusterData.deployments;
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  //clean up alert data for relevant information and assign relevant alerts to namespace state
  useEffect(() => {
    const alerts: any = displayedAlerts;
    alerts.forEach((alert: any) => {
      if (alert['affectedNamespace'] && !namespaceAlerts[alert]) {
        setNamespaceAlerts([alert, ...namespaceAlerts]);
      }
    });
  }, []);

  //determine the number of namespaces selected in the dropdown menu by filtering the selectedStates stateful array
  const numNamespaces = Object.keys(selectedStates).filter(
    item => item.charAt(0) !== 'i' && selectedStates[item] === true,
  ).length;

  //if the number of namespaces selected is zero (default, every namespace is displayed, or if the current namespace name is selected, render the namespace and its child components, or else render null)
  return numNamespaces === 0 || selectedStates[name] ? (
    <div id={id} className='namespace' key={id}>
    <div id={id} className='namespace' key={id}>
      {namespaceAlerts.length > 0 &&
        namespaceAlerts.map(alert => {
          if (alert['affectedNamespace'] === name) {
            return <AlertFlag key={alert.startTime}  />;
          }
        })}
      <img
        className='k8logo'
        id='namespace-logo'
        src='client/assets/images/namespace.png'
        className='k8logo'
        id='namespace-logo'
        src='client/assets/images/namespace.png'
        onClick={openModal}
      />
      <div className='ns-inner-border'>
        <div className='namespace-info'>
      <div className='ns-inner-border'>
        <div className='namespace-info'>
          <h3>{`${name[0].toUpperCase().concat(name.slice(1))}`} </h3>
          <h3
            style={phase === 'Active' ? { color: 'green' } : { color: 'red' }}>
            Status: {phase}
          </h3>
          <h4>{'Created: ' + cleanTime(creationTimestamp)}</h4>
        </div>
        <div className='modal'>
          <Modal open={open} onClose={closeModal}>
            <h2>Namespace Information:</h2>
            <div className='modal-content'>
            <div className='modal-content'>
              {namespaceAlerts.length > 0 &&
                namespaceAlerts.map(alert => {
                  if (alert['affectedNamespace'] === name) {
                    return (
                      <div
                        className='alert-info'
                        style={{ color: 'red' }}
                        key={name + 'alert'}>
                        <h3>Alert Information:</h3>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Alert Name:</h3>
                          <p>{alert.name}</p>
                        </div>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Description:</h3>
                          <p>{alert.description}</p>
                        </div>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Summary:</h3>
                          <p>{alert.summary}</p>
                        </div>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Severity:</h3>
                          <p>{alert.severity}</p>
                        </div>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Start Time:</h3>
                          <p>{alert.startTime}</p>
                        </div>
                        <div className='info-item'>
                        <div className='info-item'>
                          <h3>Last Updated:</h3>
                          <p>{alert.lastUpdated}</p>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </Modal>
        </div>
        <div className='namespace-contents'>
          <div className='namespace-deployments'>
        <div className='namespace-contents'>
          <div className='namespace-deployments'>
            {clusterData &&
              deployments.map(deployment =>
                deployment.namespace === name ? (
                  <Deployments
                    key={deployment.uid}
                    name={deployment.name}
                    replicas={deployment.replicas}
                    creationTimestamp={deployment.creationTimestamp}
                    labels={deployment.labels}
                    namespace={deployment.namespace}
                    id={deployment.uid}
                  />
                ) : null,
              )}
          </div>
          <div className='namespace-pods'>
            {pods.map(pod => {
              if (pod.namespace === name && pod.nodeName === nodeName)
                return (
                  <Pods
                    name={pod.name}
                    conditions={pod.conditions}
                    containerStatuses={pod.containerStatuses}
                    containers={pod.containers}
                    creationTimestamp={pod.creationTimestamp}
                    labels={pod.labels}
                    namespace={pod.namespace}
                    nodeName={pod.nodeName}
                    phase={pod.phase}
                    podIP={pod.podIP}
                    serviceAccount={pod.serviceAccount}
                    id={pod.uid}
                    key={pod.uid}
                  />
                );
            })}
          </div>
          <div className='namespace-services'>
          <div className='namespace-services'>
            {clusterData &&
              services.map(service =>
                service.namespace === name ? (
                  <Services
                    name={service.name}
                    loadBalancer={service.loadBalancer}
                    creationTimestamp={service.creationTimestamp}
                    labels={service.labels}
                    namespace={service.namespace}
                    ports={service.ports}
                    id={service.uid}
                    key={service.uid}
                  />
                ) : null,
              )}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Namespaces;
