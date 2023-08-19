import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { cleanName } from '../../functions';
import React from 'react';

const Deployments = ({
  name,
  replicas,
  creationTimestamp,
  labels,
  namespace,
  id,
}) => {
  const [open, setOpen]: any = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='deployment' id={id} key={id}>
      <div>
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
            <div className='info-item'>
              //!working on labels
              {/* <div>
              {() => {
                for (let key in labels) {
                  return <>
                  <p>{key + ': ' + labels[key]}</p>
                  </>;
                }
              }}
            </div> */}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Deployments;
