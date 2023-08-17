import { Modal } from 'react-responsive-modal';
import { useState } from 'react';

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
    <div className='service'>
      <p>Service</p>
      <h4>{name}</h4>
      <p>{creationTimestamp}</p>
      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
    
        </Modal>
      </div>
    </div>
  );
};

export default Services;
