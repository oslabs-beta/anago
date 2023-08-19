import Deployments from './Deployments';
import Pods from './Pods';
import Services from './Services';
import { useRouteLoaderData } from 'react-router-dom';
import { useState, useContext } from 'react';
import { cleanTime } from '../../functions';
import { StoreContext } from '../../stateStore';
import { Pod, Service, Deployment } from '../../../types';
import React from 'react';

const Namespaces = ({ id, name, creationTimestamp, phase, nodeName }) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const [open, setOpen]: any = useState(false);
  const { selectedStates }: any = useContext(StoreContext);
  const pods: Pod[] = clusterData.pods;
  const services: Service[] = clusterData.services;
  const deployments: Deployment[] = clusterData.deployments;

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const numNamespaces = Object.keys(selectedStates).filter(
    item => item.charAt(0) !== 'i' && selectedStates[item] === true,
  ).length;


  return (
    numNamespaces === 0 || selectedStates[name] ? 
     (
    <div id={id} className='namespace' key={id}>
      <img
        className='k8logo'
        id='namespace-logo'
        src='client/assets/images/namespace.png'
      />

      <div className='ns-inner-border'>
        <div className='namespace-info'>
          <h3>{`${name[0].toUpperCase().concat(name.slice(1))}`} </h3>
          <h3 style={phase === 'Active' ? {color: 'green'} : {color: 'red'}}>Status: {phase}</h3>
          <h4>{'Created: ' + cleanTime(creationTimestamp)}</h4>
        </div>

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
  ): null);
};

export default Namespaces;
