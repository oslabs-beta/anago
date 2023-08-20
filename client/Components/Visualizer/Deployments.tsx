import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { cleanName } from '../../context/functions';

const Deployments = ({
  name,
  replicas,
  creationTimestamp,
  labels,
  namespace,
  id,
}) => {
  const [open, setOpen] = useState(false);

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);


  //create an array of 'labels' keys to be mapped over in the return statement
  const deploymentLabels = Object.keys(labels);

  return (
    <div className='deployment' id={id} key={id}>
      <div className='deployment-info'>
        <img
          className='k8logo'
          id='deployment-logo'
          src='client/assets/images/deployment.png'
          onClick={openModal}
        />
        <h5>{cleanName(name)}</h5>
      </div>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <div className='modal-content'>
            <h2>Deployment Information:</h2>
            <div className='info-item'>
              <h3>Deployment Name:</h3>
              <p>{name}</p>
            </div>
            <div className='info-item'>
              <h3>Creation Timestamp:</h3>
              <p>{creationTimestamp}</p>
            </div>
            <div className='info-item'>
              <h3>Replicas:</h3>
              <p>{replicas}</p>
            </div>
            <div className='info-item'>
              <h3>Namespace</h3>
              <p>{namespace}</p>
            </div>
            {deploymentLabels.map(label => {
              if (
                label === 'app' ||
                label === 'k8s-app' ||
                label === 'app.kubernetes.io/name'
              ) {
                return (
                  <div key={id} className='info-item'>
                    <h3>App:</h3>
                    <p>
                      {labels['app'] ||
                        labels['k8s-app'] ||
                        labels['app.kubernetes.io/name']}
                    </p>
                  </div>
                );
              }
            })}
            {deploymentLabels.map(label => {
              {
                if (label === 'app.kubernetes.io/managed-by') {
                  return (
                    <div key={creationTimestamp} className='info-item'>
                      <h3>Managed By:</h3>
                      <p>{labels['app.kubernetes.io/managed-by']}</p>
                    </div>
                  );
                }
              }
            })}
            {deploymentLabels.map(label => {
              if (label === 'chart' || label === 'helm.sh/chart') {
                return (
                  <div key={id + creationTimestamp} className='info-item'>
                    <h3>Chart:</h3>
                    <p>{labels.chart || labels['helm.sh/chart']}</p>
                  </div>
                );
              }
            })}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Deployments;
