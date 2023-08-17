import { Modal } from 'react-responsive-modal';
import { useState } from 'react';

const Pods = ({
  conditions,
  containerStatuses,
  containers,
  creationTimestamp,
  labels,
  name,
  namespace,
  nodeName,
  phase,
  podIP,
  serviceAccount,
  id,
}) => {
  const [open, setOpen]: any = useState(false);
  console.log(serviceAccount);


  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='pod' id={id}>
      <p>Pod</p>
      <h3>{name}</h3>
      <p>{phase}</p>
      <div className='modal'>
        <button onClick={openModal}>See more</button>
        <Modal open={open} onClose={closeModal}>
  
        </Modal>
      </div>
    </div>
  );
};

export default Pods;
