import { useEffect, useState } from 'react';

const AlertBar = () => {
  //keep track of active alerts
  const [alerts, setAlerts]: any = useState([]);
  const [fetched, setFetched] = useState(false);
  const [noErrors, setNoErrors] = useState(false);
  //make sure this local host address gives the alert JSON object
  const alertsAPI = 'http://localhost:9093/api/v2/alerts';

  //fetching function
  const fetching = async () => {
    try {
      const response = await fetch(alertsAPI);
      const data = await response.json();
      // check to see if there are any alerts returned
      if (data.length > 0) {
        setAlerts(data);
        setFetched(true);
      } else {
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
    // clear interval so it only runs the setInterval when mounted
    return () => clearInterval(interval);
  }, []);
  console.log('alert data fetched: ', alerts);

  //sort the errors by severity (critical before warning)
  const sorted = alerts.sort(function (a, b) {
    let A = a.labels.severity.toUpperCase();
    let B = b.labels.severity.toUpperCase();
    return A < B ? -1 : 0;
  });
  return (
    <div className="status-bar">
      {/* if the data was fetched and there were errors: */}
      {fetched && !noErrors && (
        <>
          <div>
            <h3>ALERTS:</h3>
            {sorted.map((alertObj, index) => (
              <p className="individualAlert" key={index}>
                <strong>{alertObj.labels.severity.toUpperCase()}: </strong>{' '}
                {alertObj.annotations.description}
              </p>
            ))}
          </div>
        </>
      )}
      {/* if the data failed to be fetched and there were no errors: */}
      {noErrors && !fetched && <h3>Currently, you have no active alerts!</h3>}
    </div>
  );
};

export default AlertBar;
