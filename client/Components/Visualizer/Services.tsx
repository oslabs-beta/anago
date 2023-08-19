import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { cleanName } from '../../functions.ts';
import React from 'react';

const Services = ({
  name,
  loadBalancer,
  creationTimestamp,
  labels,
  namespace,
  ports,
  id,
}) => {
  const [open, setOpen]: any = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='service' id={id} key={id}>
      <img
        src='client/assets/images/service.png'
        className='k8logo'
        id='service-logo'
        onClick={openModal}
      />
      <h5>{cleanName(name)}</h5>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <h2>Service Information:</h2>
          <h3>Service Name:</h3>
          <p>{name}</p>
          <h3>Creation Timestamp:</h3>
          <p>{creationTimestamp}</p>
          <h3>Ports:</h3>
          <div>
            {ports.map(port => {
              return (
                <div key={port.name+id}>
                  <h4>Name: </h4>
                  <p>{port.name}</p>
                  <h4>Port: </h4>
                  <p>{port.port}</p>
                  <h4>Target Port: </h4>
                  <p>{port.targetPort}</p>
                  <h4>Protocol: </h4>
                  <p>{port.protocol}</p>
                </div>
              );
            })}
          </div>

          <h3>Namespace: </h3>
          <p>{namespace}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Services;
