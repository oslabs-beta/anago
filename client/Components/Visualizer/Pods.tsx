import { Modal } from 'react-responsive-modal';
import { useState } from 'react';
import { cleanName } from '../../functions';
import React from 'react';

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

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  console.log('container statuses', containerStatuses);

  return (
    <div className='pod' id={id} key={id}>
      <img
        src='client/assets/images/pod.png'
        className='k8logo'
        id='pod-logo'
        onClick={openModal}
      />
      <h5>{cleanName(name)}</h5>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          {}
          <h2>Pod Information:</h2>
          <div className='modal-content'>
            <div className='info-item'>
              <h3>Pod Name:</h3>
              <p>{name}</p>
            </div>
            <div className='info-item'>
              <h3>Pod Status:</h3>
              <p>{phase}</p>
            </div>
            <div className='info-item'>
              <h3>Running Application:</h3>
              <p>{labels.app}</p>
            </div>
            <div className='info-item'>
              <h3>Namespace:</h3>
              <p>{namespace}</p>
            </div>
            <div className='info-item'>
              <h3>Creation Timestamp:</h3>
              <p>{creationTimestamp}</p>
            </div>
            <div className='info-item'>
              <h3>Pod IP:</h3>
              <p>{podIP}</p>
            </div>
            <div className='info-item'>
              <h3>Service Account:</h3>
              <p>{serviceAccount}</p>
            </div>
            <div className='info-item'>
              <h3>Node:</h3>
              <p>{nodeName}</p>
            </div>
            <div className='info-item'>
              <table className='conditions'>
                <h3>Conditions: </h3>

                <tr className='column-names'>
                  {conditions.map(condition => {
                    return (
                      <th key={condition.type}>
                        {' '}
                        {`${condition.type} Status: ${condition.status}`}
                      </th>
                    );
                  })}
                </tr>
                <tr className='table-row'>
                  {conditions.map(condition => {
                    return (
                      <td key={condition.type + id}>
                        {'Last Transition Time: ' +
                          condition.lastTransitionTime}
                      </td>
                    );
                  })}
                </tr>
                <tr className='table-row'>
                  {conditions.map(condition => {
                    return (
                      <td key={condition.type + podIP}>
                        {'Last Probe Time: ' + condition.lastProbeTime}
                      </td>
                    );
                  })}
                </tr>
              </table>
            </div>
            <h2>Container Information: </h2>
            {containers.map(container => {
              return (
                <div key={container.name + id}>
                    <div className='info-item'>
                      <h3>Container Name:</h3>
                      <p>{container.name}</p>
                    </div>

                    {containerStatuses.map(status => {
                      if (status.name === container.name) {
                        return (
                          <div key={status.id}>
                            <div className='info-item'>
                              <h3>Image:</h3>
                              <p>{status.image}</p>
                            </div>
                            <div className='info-item'>
                              <h3>Status:</h3>
                              <p>{Object.keys(status.state)}</p>
                            </div>
                            <div className='info-item'>
                              <h3>Restart Count:</h3>
                              <p>{status.restartCount}</p>
                            </div>
                          </div>
                        );
                      }
                    })}

                  <div className='info-item'>
                    <table>
                      <h3>Ports:</h3>
                      <tr className='column-name'>
                        <th>Name:</th>
                        <th>Container Port:</th>
                        <th>Host Port:</th>
                        <th>Protocol:</th>
                      </tr>

                      {container.ports ? (
                        container.ports.map(port => {
                          return (
                            <tr className='table-row' key={port.name + id}>
                              <td>{port.name}</td>

                              <td>{port.containerPort}</td>

                              <td>{port.hostPort}</td>

                              <td>{port.protocol}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <td>{null}</td>
                      )}
                    </table>
                  </div>
                  <div className='info-item'>
                  <table>
                    <h3>Volume Mounts:</h3>
                    <tr className='column-name'>
                      <th>Name:</th>
                      <th>Path:</th>
                    </tr>
                    {container.volumeMounts.map(element => {
                      return (
                        <tr className='table-row' key={element.name + id}>
                          <td>{element.name}</td>
                          <td>{element.mountPath}</td>
                        </tr>
                      );
                    })}
                  </table>
                      </div>
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Pods;
