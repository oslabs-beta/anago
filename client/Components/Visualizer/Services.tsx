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
      <img
        src='client/assets/images/service.png'
        className='k8logo'
        id='service-logo'
        onClick={openModal}
      />
      <h5>{name}</h5>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <div>
            <h6>{name}</h6>
            <p>{creationTimestamp}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Services;
