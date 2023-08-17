import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { Rnd } from 'react-rnd';

const ControlPlane = () => {
  const [open, setOpen]: any = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <div className='control-plane'>
      <div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            width: 500,
            height: 190,
          }}
          minWidth={500}
          minHeight={190}
          bounds='window'>
          <img
            className='k8logo'
            id='control-plane-logo'
            src='client/assets/images/control-plane.png'
            
          />
          <button onClick={openModal}></button>
        </Rnd>
        <p>Cluster Name</p>
        
      </div>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <div>
            <p>information about your AWS host?</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ControlPlane;
