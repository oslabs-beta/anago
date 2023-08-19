import { useContext, useEffect, useState } from 'react';
import { UserData } from '../types';
import { useRouteLoaderData } from 'react-router-dom';
import { StoreContext } from '../stateStore';

//TODO: add displayed to the state store

const AlertBar = () => {
  //keep track of active alerts
  const { displayedAlerts, setDisplayedAlerts }: any = useContext(StoreContext);
  const [alerts, setAlerts]: any = useState([]);
  const [fetched, setFetched] = useState(false);
  const [noErrors, setNoErrors] = useState(false);
  //save this hidden with userData
  const [hidden, setHidden] = useState<string[]>([]);
  const [restored, setRestored] = useState<any[]>([]);
  const userData = useRouteLoaderData('home') as UserData;
  //make sure this local host address gives the alert JSON object
  const alertsAPI = 'http://localhost:9093/api/v2/alerts';

  //fetching function
  const fetching = async () => {
    console.log('fetching...');
    try {
      const alertResponse = await fetch(alertsAPI);
      const alertData = await alertResponse.json();
      // check to see if there are any alerts returned
      if (alertData.length > 0) {
        setAlerts(alertData);
        setFetched(true);
      } else {
        setFetched(true);
        setNoErrors(true);
      }
      setHidden(userData.hiddenAlerts);
      console.log('hidden alerts: ', userData.hiddenAlerts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // initial fetch on load
    fetching();
    // fetch errors every 5 minutes (common alert interval)
    const interval: NodeJS.Timer = setInterval(fetching, 5 * 60 * 1000);

    // if there are no alerts, I dont want the "current, you have no alerts" box to still have a drop down or change colors
    const noAlertTitleElement = document.getElementById('noAlertTitle');
    if (noAlertTitleElement) {
      noAlertTitleElement.addEventListener('mouseover', () => {
        const statusBar = noAlertTitleElement.parentNode as HTMLElement;
        if (statusBar) {
          statusBar.style.height = '3.5rem';
          statusBar.style.overflowY = 'hidden';
          statusBar.style.cursor = 'auto';
          statusBar.style.backgroundColor = '#008a8a33';
        }
      });
    }
    // clear interval so it only runs the setInterval when component is mounted
    return () => clearInterval(interval);
  }, []);

  //sort the errors by severity (critical before warning)
  const sorted = [...alerts].sort(function (a, b) {
    let A = a.labels.severity.toUpperCase();
    let B = b.labels.severity.toUpperCase();
    return A < B ? -1 : 0;
  });

  //filter out any alerts that are supposed to be hidden and also any repeats!
  const displayed = sorted
    .filter((alert) => !hidden.includes(alert.startsAt))
    .reduce((unique, alert) => {
      // filtering out repeats based on a property on the object in the array
      if (
        !unique.find((uniqueAlert) => uniqueAlert.startsAt === alert.startsAt)
      ) {
        unique.push(alert);
      }
      return unique;
    }, []);

  //make sure the displayedAlerts state updates whenever displayed changes
  useEffect(() => {
    setDisplayedAlerts(displayed);
  }, [displayed]);
  // onclick to hide alert
  async function handleHide(id: string) {
    setHidden((prev) => [...prev, id]);
    try {
      const response = await fetch(`/api/user/hiddenAlert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hidden: id }),
      });

      if (!response.ok) {
        throw new Error('failed to add new hidden alert');
      }
    } catch (err) {
      console.log(err);
    }
  }

  //onclick to restore alert
  async function handleRestore(id: string) {
    //remove the id from the hidden array
    setHidden((prev) => prev.filter((alertId) => alertId !== id));

    // remove it from the restored array
    setRestored((prev) => prev.filter((alert) => alert.startsAt !== id));
    // remove it from user data
    // save it to user data
    try {
      const response = await fetch(`/api/user/hiddenAlert`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hidden: id }),
      });
      if (!response.ok) {
        throw new Error('failed to remove hidden alert');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="status-bar">
      {/* if data was fetched and there are errors */}
      {fetched && !noErrors && (
        <div>
          <h3 id="alertTitle">
            <strong>ALERTS:</strong>
          </h3>
          {['critical', 'warning'].map((severity) => (
            <div id={severity} key={severity}>
              {[...displayed].map(
                (alertObj) =>
                  alertObj.labels.severity === severity &&
                  !hidden.includes(alertObj.startsAt) && (
                    <p
                      className={alertObj.labels.severity}
                      key={alertObj.startsAt}
                      id={alertObj.startsAt}
                    >
                      <strong>{severity.toUpperCase()}:</strong>{' '}
                      {alertObj.annotations.description}
                      <br />
                      <button onClick={() => handleHide(alertObj.startsAt)}>
                        hide
                      </button>
                    </p>
                  )
              )}
              {[...restored].map(
                (alertObj) =>
                  alertObj.labels.severity === severity &&
                  !hidden.includes(alertObj.startsAt) && (
                    <p
                      className={alertObj.labels.severity}
                      key={alertObj.startsAt}
                      id={alertObj.startsAt}
                    >
                      {alertObj.annotations.description}
                      <br />
                      <button onClick={() => handleHide(alertObj.startsAt)}>
                        hide
                      </button>
                    </p>
                  )
              )}
            </div>
          ))}
          {hidden.length > 0 && (
            <div>
              {['critical', 'warning'].map((severity) => (
                <div className="hidden" key={`${severity}+H`}>
                  {[...hidden].map((hiddenId) => {
                    const alertObj = alerts.find(
                      (alertObj) =>
                        alertObj.startsAt === hiddenId &&
                        alertObj.labels.severity === severity
                    );
                    return (
                      alertObj && (
                        <p key={hiddenId} id={hiddenId}>
                          <em>
                            {severity.toUpperCase()}:{' '}
                            {alertObj.annotations.description}{' '}
                          </em>
                          <button
                            onClick={() => handleRestore(alertObj.startsAt)}
                          >
                            restore
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
      {/* if data was fetched and there are no errors */}
      {noErrors && fetched && (
        <h3 id="noAlertTitle">Currently, you have no active alerts!</h3>
      )}
    </div>
  );
};

export default AlertBar;
