import { useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { LookupType, lookupName, UserData } from '../../types';
import MetricDisplay from './MetricDisplay';

const AddMetric = (props): any => {
  const userData = useRouteLoaderData('home') as UserData;
  const lookupOptions = [
    LookupType.CPUIdleByCluster,
    LookupType.MemoryIdleByCluster,
    LookupType.MemoryUsed,
    LookupType.CPUUsedByContainer,
    LookupType.FreeDiskUsage,
    LookupType.ReadyNodesByCluster,
    LookupType.PodCount,
  ];

  const [type, setType] = useState(LookupType.CustomEntry);
  const [fields, setFields] = useState({
    name: '',
    duration: '',
    step: '',
    customQuery: '',
    color: '',
  });
  const [messageText, setMessageText] = useState('');
  const [metricData, setMetricData]: any = useState({});

  const previewMetric = () => {};
  const saveMetric = () => {
    setMessageText('Saving New Metric...');
    const newMetric = {
      name: fields.name,
      type: type,
      customQuery: fields.customQuery,
      duration: timeConverter(fields.duration),
      stepSize: timeConverter(fields.step),
    };

    fetch('/api/user/add-metric', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMetric),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('Received reply', res);
        setMessageText('New Metric Saved!');
        setType(LookupType.CustomEntry);
        setFields({
          name: '',
          duration: '',
          step: '',
          customQuery: '',
          color: '',
        });
        setMetricData({});
        setTimeout(() => setMessageText(''), 2500);
      });
  };
  const typeChanged = (e) => {
    setType(e.target.value);
  };
  const textChanged = (e, field: string) => {
    const newFields = { ...fields };
    newFields[field] = e.target.value;
    setFields(newFields);
  };

  return (
    <div className="new-metric-modal">
      <h2>New Metric</h2>
      <div className="new-metric-container">
        <div className="new-metric-form">
          <h3>Select Metric Options</h3>
          <div>
            <label>Metric Name: </label>{' '}
            <input
              id="new-metric-name"
              value={fields.name}
              placeholder={lookupName(Number(type))}
              onChange={(e) => textChanged(e, 'name')}
            ></input>
          </div>
          <div>
            <label htmlFor="new-metric-type">Metric Type: </label>
            <select id="new-metric-type" onChange={typeChanged} value={type}>
              {lookupOptions.map((el) => {
                return (
                  <option value={el} key={'option' + el}>
                    {lookupName(el)}
                  </option>
                );
              })}
            </select>
          </div>
          {Number(type) > 0 && (
            <div>
              <label>Total Time: </label>{' '}
              <input
                id="new-metric-duration"
                value={fields.duration}
                placeholder="24 hours"
                onChange={(e) => textChanged(e, 'duration')}
              ></input>
            </div>
          )}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(Number(type)) && (
            <div>
              <label>Time Interval: </label>{' '}
              <input
                id="new-metric-step"
                value={fields.step}
                placeholder="20 mins"
                onChange={(e) => textChanged(e, 'step')}
              ></input>
            </div>
          )}
          {[2, 3, 4].includes(Number(type)) && (
            <div>
              <label>Pod Color: </label>{' '}
              <input
                id="new-metric-color"
                value={fields.color}
                placeholder="Blue"
                onChange={(e) => textChanged(e, 'color')}
              ></input>
            </div>
          )}
          {Number(type) == 0 && (
            <div className="metric-text-area">
              <label>Custom Query: </label>{' '}
              <textarea
                id="new-metric-custom-query"
                value={fields.customQuery}
                placeholder="Enter PromQL here..."
                onChange={(e) => textChanged(e, 'customQuery')}
              ></textarea>
            </div>
          )}
        </div>
        <div className="new-metric-preview">
          <div className="new-metric-status">
            <h4 className="new-metric-status-message">{messageText}</h4>
          </div>
          <div className="new-metric-preview-image">
            <h3>Preview Query</h3>
            {/* {metricData.hasOwnProperty('labels') && <Line data={metricData} />} */}
          </div>
        </div>
      </div>
      <div className="new-metric-buttons">
        <button className="btn" onClick={saveMetric}>
          Save
        </button>
        <button className="btn" onClick={previewMetric}>
          Preview
        </button>
        <button className="btn" onClick={() => props.setAddMetricModal(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMetric;

function timeConverter(input: string): number {
  let numPart = Number(input.split(' ')[0]);
  const stringPart = input.split(' ')[1];
  switch (stringPart) {
    case 's':
    case 'seconds':
    case 'second':
    case 'secs':
      return numPart;
    case 'min':
    case 'm':
    case 'minutes':
    case 'mins':
      return numPart * 60;
    case 'hr':
    case 'hrs':
    case 'hours':
    case 'hour':
    case 'h':
      return numPart * 60 * 60;
    case 'd':
    case 'days':
    case 'day':
      return numPart * 60 * 60 * 24;
    case 'w':
    case 'weeks':
    case 'week':
      return numPart * 60 * 60 * 24 * 7;
    case 'fortnight':
    case 'fortnights':
      return numPart * 60 * 60 * 24 * 14;
    case 'months':
    case 'month':
      return numPart * 60 * 60 * 24 * 30;
    case 'y':
    case 'year':
    case 'years':
      return numPart * 60 * 60 * 24 * 365;
    default:
      return numPart;
  }
}
