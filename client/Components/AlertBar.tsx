import React, { useContext, useEffect, useState } from 'react';
import { UserData } from '../../types';
import { useRouteLoaderData } from 'react-router-dom';
import { StoreContext } from '../context/stateStore';
import { handleAlerts } from '../context/functions';
import Modal from 'react-responsive-modal';

//TODO: add displayed to the state store

const AlertBar = () => {
  const [showAlertBar, setShowAlertBar] = useState<Boolean>(true);
  //keep track of displayed alerts
  const { displayedAlerts, setDisplayedAlerts }: any = useContext(StoreContext);
  // keep track of all alerts
  const [alerts, setAlerts] = useState<any[]>([]);
  const [fetched, setFetched] = useState<Boolean>(false);
  const [noErrors, setNoErrors] = useState<Boolean>(false);
  const [clicked, setClicked] = useState<Boolean>(false);
  const [open, setOpen]: any = useState(false);
  const [modalAlert, setModalAlert] = useState<any>({});
  //save this hidden with userData
  const [hidden, setHidden] = useState<string[]>([]);
  // total counts for alert preview
  const [criticalCount, setCriticalCount] = useState<number>();
  const [warningCount, setWarningCount] = useState<number>();
  const userData = useRouteLoaderData('home') as UserData;
  //make sure this local host address gives the alert JSON object
  const alertsAPI = 'http://localhost:9093/api/v2/alerts';

  //fetching function to API
  const fetching = async () => {
    console.log('fetching...');
    try {
      const alertResponse = await fetch(alertsAPI);
      const alertData = await alertResponse.json();
      const filtered = handleAlerts(alertData);
      console.log('filteredAlerts: ', filtered);
      // check to see if there are any alerts returned
      if (filtered.length > 0) {
        setAlerts(filtered);
        setFetched(true);
      } else {
        setFetched(true);
        setNoErrors(true);
      }
      setHidden(userData.hiddenAlerts);
    } catch (err) {
      console.log(err);
    }
  };

  //filter out any alerts that are supposed to be hidden and also any repeats
  function calculateDisplayed() {
    const displayed = sorted
      .filter((alert) => !hidden.includes(alert.description))
      .reduce((unique, alert) => {
        // filtering out repeats based on a property on the object in the array
        if (
          !unique.find(
            (uniqueAlert) => uniqueAlert.description === alert.description
          ) &&
          alert.severity !== 'none'
        ) {
          unique.push(alert);
        }
        return unique;
      }, []);
    // update displayed state
    setDisplayedAlerts(displayed);
    // make a call to calculate alert counts
    calculateAlertCounts(displayed);
    return displayed;
  }

  // calculate the alert counts for the alert preview
  function calculateAlertCounts(displayed) {
    // find the total number of critical and warning alerts to display when alerts bar is not expanded
    let criticalCount: number = 0;
    let warningCount: number = 0;
    for (let i = 0; i < displayed.length; i++) {
      if (displayed[i].severity === 'critical') {
        criticalCount += 1;
      }
      if (displayed[i].severity === 'warning') {
        warningCount += 1;
      }
    }
    // update state for each count
    setCriticalCount(criticalCount);
    setWarningCount(warningCount);
  }

  useEffect(() => {
    // initial fetch on load
    fetching();
    // fetch errors every 5 minutes (common alert interval)
    const interval: NodeJS.Timer = setInterval(fetching, 5 * 60 * 1000);

    // clear interval so it only runs the setInterval when component is mounted
    return () => clearInterval(interval);
  }, []);

  //sort the errors by severity (critical before warning)
  const sorted = [...alerts].sort(function (a, b) {
    let A = a.severity.toUpperCase();
    let B = b.severity.toUpperCase();
    return A < B ? -1 : 0;
  });

  //make sure the displayedAlerts state updates whenever displayed changes
  useEffect(() => {
    // if there are no alerts, update the status-bar
    const noAlertTitleElement = document.getElementById('noAlertTitle');
    if (noAlertTitleElement) {
      noAlertTitleElement.addEventListener('mouseover', () => {
        const statusBar = noAlertTitleElement.parentNode as HTMLElement;
        if (statusBar) {
          statusBar.style.height = '3.5rem';
          statusBar.style.overflowY = 'hidden';
          statusBar.style.cursor = 'auto';
          statusBar.style.backgroundColor = '#3a98f650';
        }
      });
    }
    const displayedAlerts = calculateDisplayed();
    // call to calculate the alert counts
    calculateAlertCounts(displayedAlerts);
  }, [hidden]);

  // onclick to hide alerts
  async function handleHide(description: string) {
    setHidden((prev) => [...prev, description]);
    try {
      // send request to backend
      const response = await fetch(`/api/user/hiddenAlert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hidden: description }),
      });

      if (!response.ok) {
        throw new Error('failed to add new hidden alert');
      }
    } catch (err) {
      console.log(err);
    }
  }

  //onclick to restore alerts
  async function handleRestore(description: string) {
    //remove the id from the hidden array to update state
    setHidden((prev) => prev.filter((alertDesc) => alertDesc !== description));
    // request to the backend
    try {
      const response = await fetch(`/api/user/hiddenAlert`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hidden: description }),
      });
      if (!response.ok) {
        throw new Error('failed to remove hidden alert');
      }
    } catch (err) {
      console.log(err);
    }
  }

  //onclick to show more details
  async function handleDetails(description: string) {
    const selectedAlert = displayedAlerts.find(
      (alert) => alert.description === description
    );
    if (selectedAlert) {
      setModalAlert(selectedAlert);
      setOpen(true);
    }
  }

  return (
    <>
      {showAlertBar && (
        <>
          <div className="modal">
            <Modal
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            >
              <p>
                <strong>Name:</strong> {modalAlert.name}{' '}
              </p>
              <p>
                <strong>Description:</strong> {modalAlert.description}{' '}
              </p>
              <p>
                <strong>Summary:</strong> {modalAlert.summary}{' '}
              </p>
              <p>
                <strong>Severity:</strong> {modalAlert.severity}{' '}
              </p>
              <p>
                <strong>Started at:</strong> {modalAlert.startTime}{' '}
              </p>
              <p>
                <strong>Last Updated at:</strong> {modalAlert.lastUpdated}{' '}
              </p>
            </Modal>
          </div>
          <div
            className="status-bar"
            onClick={(e) => {
              const buttons = document.getElementsByClassName('btn-small');
              let buttonClicked = false;
              // Iterate to see if the click was in a button
              Array.prototype.forEach.call(buttons, (element) => {
                if (element.contains(e.target)) {
                  buttonClicked = true;
                }
              });
              // If not, toggle alert view
              if (!buttonClicked) {
                if (!clicked) setClicked(true);
                else setClicked(false);
              }
            }}
          >
            {/* if data was fetched and there are errors and mouse is over*/}
            {fetched && !noErrors && clicked && (
              <div>
                <h3 id="alertTitle" onClick={() => setClicked(false)}>
                  <strong>ALERTS:</strong>
                </h3>
                {['critical', 'warning'].map((severity) => (
                  <div id={severity} key={severity}>
                    {[...displayedAlerts].map(
                      (alertObj) =>
                        alertObj.severity === severity &&
                        !hidden.includes(alertObj.description) && (
                          <p
                            className={alertObj.severity}
                            key={alertObj.description}
                            id={alertObj.description}
                          >
                            <strong className="message">
                              {severity.toUpperCase()}:
                            </strong>{' '}
                            {alertObj.description}
                            <br></br>
                            <button
                              onClick={() => handleHide(alertObj.description)}
                              className="btn-small"
                            >
                              Hide
                            </button>
                            <button
                              onClick={() =>
                                handleDetails(alertObj.description)
                              }
                              className="btn-small"
                            >
                              Details
                            </button>
                          </p>
                        )
                    )}
                  </div>
                ))}
                {hidden.length > 0 && (
                  <div>
                    {['critical', 'warning'].map((severity) => (
                      <div id="hidden" key={`${severity}+H`}>
                        {[...hidden].map((hiddenId) => {
                          const alertObj = alerts.find(
                            (alertObj) =>
                              alertObj.description === hiddenId &&
                              alertObj.severity === severity
                          );
                          return (
                            alertObj && (
                              <p key={hiddenId} id={hiddenId}>
                                <em>
                                  {severity.toUpperCase()}:{' '}
                                  {alertObj.description}{' '}
                                </em>
                                <br></br>
                                <button
                                  className="btn-small"
                                  onClick={() =>
                                    handleRestore(alertObj.description)
                                  }
                                >
                                  Restore
                                </button>
                              </p>
                            )
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* if there are errors, the data is fetched, but the mouse is not over */}
            {!noErrors && fetched && !clicked && (
              <h3 id="mouseNotOver" onClick={() => setClicked(true)}>
                <strong>
                  ALERTS PREVIEW: {criticalCount} Critical, {warningCount}{' '}
                  Warning
                </strong>
              </h3>
            )}
            {/* if data was fetched AND there are no errors */}
            {noErrors && fetched && (
              <h3 id="noAlertTitle">Currently, you have no active alerts!</h3>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AlertBar;
