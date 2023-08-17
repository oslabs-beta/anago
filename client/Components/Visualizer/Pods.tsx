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

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <div className='pod' id={id}>
      <div>
        <img
          src='client/assets/images/pod.png'
          className='k8logo'
          id='pod-logo'
          onClick={openModal}
        />
        <h5>{podIP}</h5>
      </div>
      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <h2>Pod Information:</h2>
          <h3>Pod Name:</h3>
          <p>{name}</p>
          <h3>Pod Status:</h3>
          <p>{phase}</p>
          <h3>Running Application:</h3>
          <p>{labels.app}</p>

          <h3>Namespace:</h3>
          <p>{namespace}</p>
          <h3>Creation Timestamp:</h3>
          <p>{creationTimestamp}</p>
          <h3>Pod IP:</h3>
          <p>{podIP}</p>
          <h3>Service Account:</h3>
          <p>{serviceAccount}</p>

          <h3>Node:</h3>
          <p>{nodeName}</p>

          <h3>Conditions: </h3>
          {conditions.map(condition => {
            return (
              <div>
                <h4>{condition.type + ': ' + condition.status}</h4>
                <p>{'Last Transition Time: ' + condition.lastTransitionTime}</p>
                <p>{'Last Probe Time: ' + condition.lastProbeTime}</p>
              </div>
            );
          })}

          <h2>Container Information: </h2>
          {containers.map(container => {
            return (
              <div>
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
                  {container.ports ? (
                    container.ports.map(port => {
                      return (
                        <>
                          <h3>Ports:</h3>
                          <p>{'Name: ' + port.name}</p>
                          <p>{'Container Port: ' + port.containerPort}</p>
                          <p>{'Host Port: ' + port.hostPort}</p>
                          <p>{'Protocol: ' + port.protocol}</p>
                        </>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>

                <h3>Volume Mounts:</h3>
                {container.volumeMounts.map(element => {
                  return (
                    <>
                      <p>{'Name: ' + element.name}</p>
                      <p>{'Path: ' + element.mountPath}</p>
                    </>
                  );
                })}
              </div>
            );
          })}
        </Modal>
      </div>
    </div>
  );
};

export default Pods;
