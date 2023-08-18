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
          <div>
            <h2>Deployment Information:</h2>
            <h3>Deployment Name:</h3>
            <p>{name}</p>
            <h3>Creation Timestamp:</h3>
            <p>{creationTimestamp}</p>
            <h3>Replicas:</h3>
            <p>{replicas}</p>
            <h3>Namespace</h3>
            <p>{namespace}</p>
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
        </Modal>
      </div>
    </div>
  );
};

export default Deployments;
