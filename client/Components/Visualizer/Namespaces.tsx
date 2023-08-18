import Deployments from './Deployments';
import Pods from './Pods';
import Services from './Services';
import { useRouteLoaderData } from 'react-router-dom';
import { useState } from 'react';
import { cleanTime } from '../../functions';

import { Pod, Service, Deployment } from '../../types';

const Namespaces = ({ id, name, creationTimestamp, phase, nodeName }) => {
  const clusterData: any = useRouteLoaderData('cluster');
  const [open, setOpen]: any = useState(false);

  const pods: Pod[] = clusterData.pods;
  const services: Service[] = clusterData.services;
  const deployments: Deployment[] = clusterData.deployments;

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div id={id} className='namespace'>
      <div className='namespace-info'>
        <h3>{`${name[0].toUpperCase().concat(name.slice(1))}`} </h3>
        <h3>{`Status: ${phase} `}</h3>
        <h4>{cleanTime(creationTimestamp)}</h4>
      </div>
      <img
        className='k8logo'
        id='namespace-logo'
        src='client/assets/images/namespace.png'
      />

      <div className='namespace-contents'>
        <div className='namespace-deployments'>
          {clusterData &&
            deployments.map(deployment =>
              deployment.namespace === name ? (
                <Deployments
                  name={deployment.name}
                  replicas={deployment.replicas}
                  creationTimestamp={deployment.creationTimestamp}
                  labels={deployment.labels}
                  namespace={deployment.namespace}
                  id={deployment.uid}
                />
              ) : (
                <></>
              ),
            )}
        </div>
        <div className='namespace-pods'>
          {clusterData &&
            pods.map(pod =>
              (pod.namespace === name && pod.nodeName === nodeName)? (
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
                />
              ) : (
                <></>
              ),
            )}
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
                />
              ) : (
                <></>
              ),
            )}
        </div>
      </div>
    </div>
  );
};

export default Namespaces;
