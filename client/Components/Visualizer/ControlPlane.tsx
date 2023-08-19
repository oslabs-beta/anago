import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import React from 'react';

const ControlPlane = () => {
  const [open, setOpen]: any = useState(false);
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
          <div>
            <p>information about your AWS Cluster/Host</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ControlPlane;
