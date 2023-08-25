import { Modal } from 'react-responsive-modal';
import React, { useState, useContext, useEffect } from 'react';
import { cleanName, handleAlerts } from '../../context/functions';
import { StoreContext } from '../../context/stateStore';
import { CleanAlert } from '../../../types';
import AlertFlag from './AlertFlag';

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
  const { selectedStates, displayedAlerts }: any = useContext(StoreContext);
  const [podAlerts, setPodAlerts]: any = useState([]);

  //modal handler functions
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  //clean up alert data for relevant information and assign relevant alerts to pod state
  useEffect(() => {
    const alerts = displayedAlerts;
    alerts.forEach((alert: any) => {
      if (alert['affectedPod'] && !podAlerts[alert]) {
        setPodAlerts([alert, ...podAlerts]);
      }
    });
  }, []);

  return (
    <div className='pod' id={id} key={id}>
      {/* {podAlerts.length > 0 &&
        podAlerts.map(alert => {
          if (alert['affectedPod'] === name) {
            return <AlertFlag key={alert.startTime} />;
          }
        })} */}
      <img
        src='client/assets/images/pod.png'
        className='k8logo'
        id='pod-logo'
        onClick={openModal}
      />
      <h5>{cleanName(name)}</h5>

      <div className='modal'>
        <Modal open={open} onClose={closeModal}>
          <h2>Pod Information:</h2>
          <div className='modal-content'>
            {podAlerts.length > 0 &&
              podAlerts.map((alert) => {
                if (alert['affectedPod'].includes(name)) {
                  return (
                    <div
                      className='alert-info'
                      style={{ color: 'red' }}
                      key={'podalert' + name}
                    >
                      <h3>Alert Information:</h3>
                      <div className='info-item'>
                        <h3>Alert Name:</h3>
                        <p>{alert.name}</p>
                      </div>
                      <div className='info-item'>
                        <h3>Description:</h3>
                        <p>{alert.description}</p>
                      </div>
                      <div className='info-item'>
                        <h3>Summary:</h3>
                        <p>{alert.summary}</p>
                      </div>
                      <div className='info-item'>
                        <h3>Severity:</h3>
                        <p>{alert.severity}</p>
                      </div>
                      <div className='info-item'>
                        <h3>Start Time:</h3>
                        <p>{alert.startTime}</p>
                      </div>
                      <div className='info-item'>
                        <h3>Last Updated:</h3>
                        <p>{alert.lastUpdated}</p>
                      </div>
                    </div>
                  );
                }
              })}
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
                  {conditions.map((condition) => {
                    return (
                      <th key={condition.type}>
                        {`${condition.type} Status: ${condition.status}`}
                      </th>
                    );
                  })}
                </tr>
                <tr className='table-row'>
                  {conditions.map((condition) => {
                    return (
                      <td key={condition.type + id}>
                        {'Last Transition Time: ' +
                          condition.lastTransitionTime}
                      </td>
                    );
                  })}
                </tr>
                <tr className='table-row'>
                  {conditions.map((condition) => {
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
            {containers.map((container) => {
              return (
                <div key={container.name + id}>
                  <div className='info-item'>
                    <h3>Container Name:</h3>
                    <p>{container.name}</p>
                  </div>

                  {containerStatuses.map((status) => {
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
                        container.ports.map((port) => {
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
                      {container.volumeMounts.map((element) => {
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
