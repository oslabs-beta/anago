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
      <p>Deployment</p>
      <h3>{name}</h3>
      <p>{creationTimestamp}</p>
      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
        
        </Modal>
      </div>
    </div>
  );
};

export default Deployments;
