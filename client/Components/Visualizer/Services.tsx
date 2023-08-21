import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { cleanName } from '../../context/functions.js';

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

  //modal handler functions
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
          <div className='modal-content'>
            <div className='info-item'>
              <h3>Service Name:</h3>
              <p>{name}</p>
            </div>
            <div className='info-item'>
              <h3>Creation Timestamp:</h3>
              <p>{creationTimestamp}</p>
            </div>
            <div className='info-item'>
              <table>
                <h3>Ports:</h3>
                <tr className='column-name'>
                  <th>Name:</th>
                  <th>Port:</th>
                  <th>Target Port:</th>
                  <th>Protocol:</th>
                </tr>

                {ports.map(port => {
                  return (
                    <tr className='table-row' key={port.name + id}>
                      <td>{port.name}</td>

                      <td>{port.port}</td>

                      <td>{port.targetPort}</td>

                      <td>{port.protocol}</td>
                    </tr>
                  );
                })}
              </table>
            </div>
            <div className='info-item'>
              <h3>Namespace: </h3>
              <p>{namespace}</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Services;
