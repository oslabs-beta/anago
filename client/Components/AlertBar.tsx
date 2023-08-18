import React, { useEffect, useState } from 'react';
import { UserData } from '../../types';
import { useRouteLoaderData } from 'react-router-dom';

const AlertBar = () => {
  //keep track of active alerts
  const [alerts, setAlerts]: any = useState([]);
  const [fetched, setFetched] = useState(false);
  const [noErrors, setNoErrors] = useState(false);
  //save this hidden with userData
  const [hidden, setHidden] = useState<string[]>([]);
  const [restored, setRestored] = useState<any[]>([]);
  //make sure this local host address gives the alert JSON object
  const alertsAPI = 'http://localhost:9093/api/v2/alerts';

  //fetching function
  const fetching = async () => {
    //import data from loader
    // const userData = useRouteLoaderData('home') as UserData;
    // setHidden(userData.hiddenAlerts);
    console.log('fetching...');
    try {
      const response = await fetch(alertsAPI);
      const data = await response.json();
      // check to see if there are any alerts returned
      if (data.length > 0) {
        setAlerts(data);
        setFetched(true);
      } else {
        setFetched(true);
        setNoErrors(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  // onclick to hide alert
  async function handleHide(id: string) {
    setHidden((prev) => [...prev, id]);
    // save it to user data
    // const response = await fetch(`/api/user/hiddenAlert`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: JSON.stringify(id),
    // });
    // return response.json();
  }

  //onclick to restore alert
  async function handleRestore(id: string) {
    //remove the id from the hidden array
    setHidden((prev) => prev.filter((alertId) => alertId !== id));

    // remove it from the restored array
    setRestored((prev) => prev.filter((alert) => alert.startsAt !== id));
    // remove it from user data
    // save it to user data
    // const response = await fetch(`/api/user/hiddenAlert`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(id),
    // });
    // return response.json();
  }

  return (
    <div className="status-bar">
      {/* if data was fetched and there are errors */}
      {fetched && !noErrors && (
        <div>
          <h3>
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
                <div className="hidden">
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
      {noErrors && fetched && <h3>Currently, you have no active alerts!</h3>}
    </div>
  );
};

export default AlertBar;
