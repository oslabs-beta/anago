import { Modal } from 'react-responsive-modal';
import React, { useState } from 'react';

const ControlPlane = () => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <div className='control-plane'>
      <img
        className='k8logo'
        id='control-plane-logo'
        src='client/assets/images/control-plane.png'
        onClick={openModal}
      />

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <div className='modal-content'>
            <p>
              Your Current Cluster is hosted on Amazon Web Services' Elastic
              Kubernetes Service (EKS)
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ControlPlane;
