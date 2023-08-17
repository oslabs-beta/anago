import { Modal } from 'react-responsive-modal';
import { useState } from 'react';

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
    <div className='deployment'>
      <div>
        <p>{name}</p>
        <img className='k8logo' id='deployment-logo' src='client/assets/images/deployment.png' />
      </div>
      

      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
              <p>{creationTimestamp}</p>
        </Modal>
      </div>
    </div>
  );
};

export default Deployments;
