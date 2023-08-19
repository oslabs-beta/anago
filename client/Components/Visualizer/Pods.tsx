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
          <div className='modal-content'>
            <h2>Pod Information:</h2>
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
              <h3>Conditions: </h3>
              {conditions.map(condition => {
                return (
                  <div key={condition.type + id}>
                    <h4>{condition.type + ': ' + condition.status}</h4>
                    <p>
                      {'Last Transition Time: ' + condition.lastTransitionTime}
                    </p>
                    <p>{'Last Probe Time: ' + condition.lastProbeTime}</p>
                  </div>
                );
              })}
            </div>
            <div className='info-item'>
              <h2>Container Information: </h2>
              {containers.map(container => {
                return (
                  <div key={container.name + id}>
                    <h3>Container Name:</h3>
                    <p>{container.name}</p>
                    <h3>Image:</h3>
                    <p>{container.image}</p>
                    //!container statuses showing undefined
                    {/* <div>
                  {containerStatuses.forEach(status => {
                    if (status.name === container.name) {
                      return (
                        <div>
                          <h3>Restart Count:</h3>
                          <p>{containerStatuses.restartCount}</p>
                          </div>
                          );
                        }
                      })}
                    </div> */}
                    <div>
                      {container.ports
                        ? container.ports.map(port => {
                            return (
                              <div key={port.name + id}>
                                <h3>Ports:</h3>
                                <p>{'Name: ' + port.name}</p>
                                <p>{'Container Port: ' + port.containerPort}</p>
                                <p>{'Host Port: ' + port.hostPort}</p>
                                <p>{'Protocol: ' + port.protocol}</p>
                              </div>
                            );
                          })
                        : undefined}
                    </div>
                    <h3>Volume Mounts:</h3>
                    {container.volumeMounts.map(element => {
                      return (
                        <div key={element.name + id}>
                          <p>{'Name: ' + element.name}</p>
                          <p>{'Path: ' + element.mountPath}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Pods;
