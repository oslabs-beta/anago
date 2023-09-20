import { useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../context/stateStore';
import { useRouteLoaderData } from 'react-router-dom';
import { LookupType, ScopeType, lookupName, UserData } from '../../../types';
import MetricDisplayPreview from './MetricDisplayPreview';

const AddMetric = (props): any => {
  const userData = useRouteLoaderData('home') as UserData;
  const { clusterData, setClusterData }: any = useContext(StoreContext);

  // The preconfiged queries to show in the selector
  const lookupOptions = [
    LookupType.CPUUsage,
    LookupType.CPUIdle,
    LookupType.MemoryUsed,
    LookupType.MemoryFreeInNode,
    LookupType.MemoryIdle,
    LookupType.FreeDiskinNode,
    LookupType.ReadyNodesByCluster,
    LookupType.NodesReadinessFlapping,
    LookupType.PodRestarts,
    LookupType.PodCount,
  ];

  // Radio / selector fields
  const [types, setTypes] = useState([
    ScopeType.Range, // Default Ranged Values
    'entry-precon', // Default preconstructed queries
    LookupType.CPUUsage, // Default to CPU Usage lookup
  ]);

  // User entry fields
  const [fields, setFields] = useState({
    name: '',
    duration: '',
    step: '',
    customQuery: '',
    refresh: '',
  });

  // User configurable options that vary by lookup preconfigs
  const [domains, setDomains] = useState([
    ['Cluster', 'Namespace', 'Node'],
    [''],
    ['View All', 'Namespaces', 'Nodes', 'Containers'],
  ]);
  // Currently selected choices for the above domains
  const [chosenDomains, setChosenDomains] = useState([
    'Cluster',
    '',
    'View All',
  ]);

  // Output status data
  const [messageText, setMessageText] = useState('');
  // Metric data to show in a preview graph
  const [metricData, setMetricData]: any = useState({});
  // Query Summary Text
  const [querySummary, setQuerySummary] = useState('');
  const [queryPromQL, setQueryPromQL] = useState('');
  const [intervalNote, setIntervalNote] = useState('');

  // Query type options have changed: update displayed form fields
  const typeChanged = (e) => {
    // Check Scope Radio
    const scope =
      document.querySelector('input[name="scope"]:checked')?.id ===
      'scope-range'
        ? ScopeType.Range
        : ScopeType.Instant;
    // Check Entry Type Radio
    const entryType =
      document.querySelector('input[name="entryType"]:checked')?.id ||
      'entry-precon';
    // If Search Type was Updated, Update it
    const searchType =
      e.target.id === 'new-metric-type' ? Number(e.target.value) : types[2];

    // If chosenDomains were updated, update them
    const newChosenDomains = [...chosenDomains];
    if (e.target.id == 'new-metric-context')
      newChosenDomains[0] = e.target.value;
    if (e.target.id == 'new-metric-context-picker')
      newChosenDomains[1] = e.target.value;
    if (e.target.id == 'new-metric-target')
      newChosenDomains[2] = e.target.value;

    // Filter Targets based on current Context
    let filteredTargets = [...targetMatrix[searchType]];
    if (filteredTargets.length) {
      if (newChosenDomains[0] == 'Node') filteredTargets.splice(1, 1);
      // Can't query Namespaces in Node
      else if (newChosenDomains[0] == 'Deployment') {
        filteredTargets.splice(1, 2); //Can't q NS/Node in Depl
      }
    }

    // If Context selection involves Cluster data, populate it
    let contextChoices = [''];
    if (
      newChosenDomains[0] !== 'Cluster' &&
      clusterData.hasOwnProperty('namespaces')
    ) {
      switch (newChosenDomains[0]) {
        case 'Namespace':
          contextChoices = clusterData.namespaces.map((el) => el.name);
          break;
        case 'Node':
          contextChoices = clusterData.nodes.map((el) => el.name);
          break;
        default:
          break;
      }
    }

    // Update state values
    setTypes([scope, entryType, searchType]);
    setDomains([contextMatrix[searchType], contextChoices, filteredTargets]);
    setChosenDomains(newChosenDomains);
  };

  // Form text has changed and should be updated in state
  const textChanged = (e, field: string) => {
    const newFields = { ...fields };
    newFields[field] = e.target.value;
    setFields(newFields);
  };

  // Generate summary text to show:
  useEffect(() => {
    let str = 'Query Summary: A ';

    if (types[1] == 'entry-precon') str += 'preconfigured, ';
    else str += 'custom, ';

    if (types[0] == ScopeType.Range) str += 'time-range query ';
    else str += 'instant query ';

    // Branch over precon vs. custom
    if (types[1] == 'entry-precon') {
      str += `for ${lookupName(Number(types[2]))}`;
      if (targetMatrix[types[2]].length) {
        // there is a target + context
        if (chosenDomains[2] == 'View All') {
          str += `, showing everything in the ${chosenDomains[1]} ${chosenDomains[0]}`;
        } else {
          str += `, grouping together all ${chosenDomains[2]} in the ${chosenDomains[1]} ${chosenDomains[0]}`;
        }
      } else if (contextMatrix[types[2]].length) {
        // there is context/no-target
        str += `, throughout the ${chosenDomains[1]} ${chosenDomains[0]},`;
      } // else -> no context/target, continue on
    } else {
      const customQuery = fields.customQuery
        ? '"' + fields.customQuery + '"'
        : '<your query>';
      str += 'for ' + customQuery;
    }

    // Branch over time-range
    if (types[0] == ScopeType.Range) {
      str += ' over the last ';
      // Parse the entered time string
      const timeSec = fields.duration
        ? timeConverter(fields.duration)
        : 24 * 60 * 60;
      if (timeSec) {
        str += timeToString(timeSec);
      } else {
        // Couldn't convert time, so use default
        str += "24 hours (couldn't understand time).";
      }
    } else {
      str += '.';
    }

    setQuerySummary(str);
  }, [types, fields, chosenDomains]);

  // Generate data object for previewing or saving query
  function formData(adjustableStep: boolean): any {
    // Standard Metrics
    const newMetric: any = {
      name: fields.name,
      lookupType: types[2],
      scopeType: types[0],
    };

    if (types[1] == 'entry-precon') {
      // Preconfigured Query - get target/context, if applicable
      // Context: If there is a context, save it
      if (contextMatrix[types[2]].length) {
        // If contextChoice is blank, stick with cluster
        if (chosenDomains[1].length > 0) {
          newMetric.context = chosenDomains[0];
          newMetric.contextChoice = chosenDomains[1];
        } else newMetric.context = 'cluster';
      }
      // Target: If there is a target, save it
      if (targetMatrix[types[2]].length) newMetric.target = chosenDomains[2];
    } else {
      // Custom entry: set LookupType to .CustomEntry and save the query
      newMetric.lookupType = LookupType.CustomEntry;
      newMetric.customQuery = fields.customQuery;
    }

    // Timing: For Range / Instant scope, save entered (or def) vals
    if (newMetric.scopeType === ScopeType.Range) {
      // Range Query - get values or use defaults
      newMetric.duration = fields.duration.length
        ? timeConverter(fields.duration)
        : 24 * 60 * 60;
      newMetric.stepSize = fields.step ? timeConverter(fields.step) : 60 * 20;

      // Check for proportionately small step sizes (they slow stateful field performance)
      if (adjustableStep && newMetric.duration / newMetric.stepSize > 400) {
        // Step size will hinder page
        newMetric.stepSize = newMetric.duration / 400;
        setIntervalNote(
          'Note: Current time ratio may slow performance. Precision adjusted for preview.'
        );
      }
    } else {
      // Instant Query - get refresh rate or supply default
      newMetric.refresh = fields.refresh ? timeConverter(fields.refresh) : 60;
    }

    // Add default name if unfilled values
    if (newMetric.name.length === 0)
      newMetric.name = lookupName(newMetric.lookupType);

    return newMetric;
  }

  // Preview the user's current query, if possible
  const previewMetric = () => {
    // Mostly same as Save Metric, but different route, get back data + promQL

    setMessageText('Querying Preview Metric...');
    setIntervalNote('');
    const newMetric = formData(true);
    try {
      fetch('/api/data/metric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMetric),
      })
        .then((res) => res.json())
        .then((res) => {
          // Should verify query validity as part of this process
          setMessageText('Metric Preview Successful');

          setMetricData(res.metricData);
          setQueryPromQL('PromQL Lookup: "' + res.searchQuery + '"');

          // Dismiss message
          setTimeout(() => setMessageText(''), 2500);
        });
    } catch (err) {
      console.log('Error receiving metric preview: ', err);
    }
  };

  // Save the user's current query, if valid
  const saveMetric = () => {
    setMessageText('Saving New Metric...');
    const newMetric = formData(false);
    try {
      fetch('/api/user/add-metric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMetric),
      })
        .then((res) => res.json())
        .then((res) => {
          // Should verify query validity as part of this process
          setMessageText('New Metric Saved!');
          // Dismiss message
          setTimeout(() => setMessageText(''), 2500);
        });
    } catch (err) {
      console.log(`failed to save new metric! Error: ${err}`);
    }
  };

  return (
    <div className='new-metric-modal'>
      <h2>New Metric</h2>

      {/* METRIC NAME */}
      <div className='new-metric-container'>
        <div className='new-metric-form'>
          <h3>Select Metric Options</h3>
          <div>
            <label>Metric Name: </label>{' '}
            <input
              id='new-metric-name'
              value={fields.name}
              placeholder={
                types[1] == 'entry-precon'
                  ? lookupName(Number(types[2]))
                  : 'Custom Query Name'
              }
              onChange={(e) => textChanged(e, 'name')}
            ></input>
          </div>

          {/* PRECON / CUSTOM RADIO BUTTON */}
          <div className='radio-container'>
            <label htmlFor='new-metric-scope'>Query:</label>
            <label className='radio-button-container'>
              Preconfigured
              <input
                type='radio'
                id='entry-precon'
                defaultChecked
                onChange={typeChanged}
                name='entryType'
              ></input>
              <span className='checkmark'></span>
            </label>
            <label className='radio-button-container'>
              Custom
              <input
                type='radio'
                id='entry-custom'
                onChange={typeChanged}
                name='entryType'
              ></input>
              <span className='checkmark'></span>
            </label>
          </div>

          {/* SCOPE RADIO BUTTON */}
          <div className='radio-container'>
            <label htmlFor='new-metric-scope'>Scope:</label>
            <label className='radio-button-container'>
              Time-Range Query
              <input
                type='radio'
                id='scope-range'
                defaultChecked
                onChange={typeChanged}
                name='scope'
              ></input>
              <span className='checkmark'></span>
            </label>
            <label className='radio-button-container'>
              Instant Query
              <input
                type='radio'
                id='scope-instant'
                onChange={typeChanged}
                name='scope'
              ></input>
              <span className='checkmark'></span>
            </label>
          </div>

          {/* PRECON METRIC TYPE */}
          {types[1] == 'entry-precon' && (
            <div>
              <label htmlFor='new-metric-type'>Metric Type: </label>
              <select
                id='new-metric-type'
                onChange={typeChanged}
                value={types[2]}
              >
                {lookupOptions.map((el) => {
                  return (
                    <option value={el} key={'option' + el}>
                      {lookupName(el)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* METRIC CONTEXT */}
          {types[1] == 'entry-precon' && domains[0].length > 0 && (
            <div>
              <label htmlFor='new-metric-context'>Context: </label>
              <select
                id='new-metric-context'
                onChange={typeChanged}
                value={chosenDomains[0]}
              >
                {domains[0].map((el, index) => {
                  return (
                    <option value={el} key={'metric' + el}>
                      {domains[0][index]}
                    </option>
                  );
                })}
              </select>{' '}
              {chosenDomains[0] !== 'Cluster' && (
                <select
                  id='new-metric-context-picker'
                  onChange={typeChanged}
                  value={chosenDomains[1]}
                >
                  {domains[1].map((el, index) => {
                    return (
                      <option value={el} key={'metric-pick' + el}>
                        {domains[1][index]}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          )}

          {/* METRIC TARGET */}
          {types[1] == 'entry-precon' && domains[2].length > 0 && (
            <div>
              <label htmlFor='new-metric-target'>Group by: </label>
              <select
                id='new-metric-target'
                onChange={typeChanged}
                value={chosenDomains[2]}
              >
                {domains[2].map((el, index) => {
                  return (
                    <option value={el} key={'target' + el}>
                      {domains[2][index]}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* RANGE METRIC DURATION */}
          {types[0] == ScopeType.Range && (
            <div>
              <label>Total Time: </label>{' '}
              <input
                id='new-metric-duration'
                value={fields.duration}
                placeholder='24 hours'
                onChange={(e) => textChanged(e, 'duration')}
              ></input>
            </div>
          )}

          {/* RANGE METRIC STEPSIZE */}
          {types[0] == ScopeType.Range && (
            <div>
              <div>
                <label>Time Interval: </label>{' '}
                <input
                  id='new-metric-step'
                  value={fields.step}
                  placeholder='20 mins'
                  onChange={(e) => textChanged(e, 'step')}
                ></input>
              </div>
              <div className='interval-note'>{intervalNote}</div>
            </div>
          )}

          {/* INSTANT METRIC REFRESH */}
          {types[0] == ScopeType.Instant && (
            <div>
              <label>Refresh Interval: </label>{' '}
              <input
                id='new-metric-refresh'
                value={fields.refresh}
                placeholder='60 secs'
                onChange={(e) => textChanged(e, 'refresh')}
              ></input>
            </div>
          )}

          {/* CUSTOM QUERY STRING */}
          {types[1] == 'entry-custom' && (
            <div className='metric-text-area'>
              <label>Custom Query: </label>{' '}
              <textarea
                id='new-metric-custom-query'
                value={fields.customQuery}
                placeholder='Enter PromQL here...'
                onChange={(e) => textChanged(e, 'customQuery')}
              ></textarea>
            </div>
          )}
        </div>

        {/* SHOW METRIC PREVIEW GRAPH */}
        <div className='new-metric-preview'>
          <div className='new-metric-preview-image'>
            <h3>Query Preview</h3>
            {metricData.hasOwnProperty('labels') && (
              <MetricDisplayPreview
                metricData={metricData}
                lookupType={types[2]}
              />
            )}
          </div>

          {/* MESSAGE ABOUT PREVIEW/SAVE CLICK */}
          <div className='new-metric-status'>
            <h4 className='new-metric-status-message'>{messageText}</h4>
          </div>
        </div>
      </div>

      {/* QUERY SEMANTIC+PROMQL SUMMARY */}
      <div className='summary-container'>
        <p>{querySummary}</p>
        <p className='summary-query'>{queryPromQL}</p>
      </div>

      {/* BUTTONS */}
      <div className='new-metric-buttons'>
        <button className='btn' onClick={saveMetric}>
          Save
        </button>
        <button className='btn' onClick={previewMetric}>
          Preview
        </button>
        <button className='btn' onClick={() => props.saveAndReload()}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddMetric;

// Parse the entered time
export function timeConverter(input: string): number | undefined {
  // Split number and units
  let numPart, stringPart;
  // ...using a space
  if (input.includes(' ')) {
    numPart = Number(input.split(' ')[0]);
    stringPart = input.split(' ')[1];
  } else {
    // ... or with no space
    let firstLetter = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i].toLowerCase() !== input[i].toUpperCase()) {
        firstLetter = i;
        break;
      }
    }
    // Make sure it's NumLetters format
    let cleanBreak = true;
    for (let i = 0; i < firstLetter; i++) {
      if (input[i].toLowerCase() !== input[i].toUpperCase()) cleanBreak = false;
    }
    for (let i = firstLetter; i < input.length; i++) {
      if (input[i].toLowerCase() === input[i].toUpperCase()) cleanBreak = false;
    }
    if (cleanBreak) {
      numPart = input.slice(0, firstLetter);
      stringPart = input.slice(firstLetter);
    } else {
      // ... or if it doesn't fit, use undefined -> defaults
      return undefined;
    }
  }
  // Parse the units
  switch (stringPart) {
    case 's':
    case 'seconds':
    case 'second':
    case 'secs':
      return numPart * 1;
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
      return undefined;
  }
}

// Only some LookupTypes should allow for refining contexts or grouping metrics
// This pair of matrices is keyed to those values for generating pulldown menus
const contextMatrix = [
  [],
  ['Cluster', 'Namespace', 'Node'],
  ['Cluster', 'Namespace'],
  ['Cluster', 'Namespace', 'Node'],
  [],
  ['Cluster', 'Namespace'],
  ['Cluster', 'Namespace', 'Node'],
  [],
  [],
  [],
  ['Cluster', 'Namespace', 'Node'],
  ['Cluster', 'Namespace', 'Node'],
];

const targetMatrix = [
  [],
  ['View All', 'Namespaces', 'Nodes', 'Containers'],
  [],
  ['View All', 'Namespaces', 'Nodes', 'Containers'],
  [],
  [],
  ['View All', 'Namespaces', 'Nodes', 'Containers'],
  [],
  [],
  [],
  ['View All', 'Namespaces', 'Nodes', 'Containers'],
  ['View All', 'Namespaces', 'Nodes', 'Containers'],
];

export function timeToString(timeSec: number): string {
  if (timeSec > 1 * 60 * 60 * 24 * 365) {
    return `${Math.round((timeSec / 60 / 60 / 24 / 365) * 10) / 10} years.`;
  } else if (timeSec > 60 * 60 * 24 * 90) {
    return `${Math.round((timeSec / 60 / 60 / 24 / 30) * 10) / 10} months.`;
  } else if (timeSec > 60 * 60 * 24 * 20) {
    return `${Math.round((timeSec / 60 / 60 / 24 / 7) * 10) / 10} weeks.`;
  } else if (timeSec > 60 * 60 * 24 * 3.5) {
    return `${Math.round((timeSec / 60 / 60 / 24) * 10) / 10} days.`;
  } else if (timeSec > 60 * 60 * 3.5) {
    return `${Math.round((timeSec / 60 / 60) * 10) / 10} hours.`;
  } else if (timeSec > 60 * 3.5) {
    return `${Math.round((timeSec / 60) * 10) / 10} minutes.`;
  } else {
    return `${timeSec} seconds.`;
  }
}
