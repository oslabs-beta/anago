import {
  LookupType,
  yAxis,
  plotData,
  promResResultElements,
} from '../../types.ts';
import newUserData from '../models/defaultUserData.ts';
import { NEW_USER, ACTIVE_DEPLOYMENT } from '../../user-config.ts';
// File Read/Write
import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { fileURLToPath } from 'url';

export function readUserData(): any {
  if (NEW_USER) {
    // Create a new user from default data (for now?)
    return newUserData;
  }
  try {
    const readData = fs.readFileSync(
      path.resolve(__dirname, '../models/userData.json'),
      'utf-8'
    );
    const userData = JSON.parse(readData);
    if (
      !userData.hasOwnProperty('userId') ||
      !userData.hasOwnProperty('metrics')
    ) {
      console.log(
        'Read UserData is missing metrics. Using and saving default data.'
      );
      fs.writeFileSync(
        path.resolve(__dirname, '../models/userData.json'),
        JSON.stringify(newUserData)
      );
      return newUserData;
    }
    return userData;
  } catch (err) {
    console.log(
      'Error reading User Data from disk in helper function readUserData.'
    );
    return;
  }
}

// Convert time windows to be more readable, based on the range
export function cleanTime(date: Date, options: any) {
  const metricDuration = options.hasOwnProperty('duration')
    ? options.duration
    : 24 * 60 * 60;

  if (metricDuration >= 2 * 7 * 24 * 60 * 60) {
    // >= 2 week
    return date.toLocaleDateString(); //date only
  } else if (metricDuration <= 12 * 60 * 60) {
    // < 12 h
    const dateArr = date.toLocaleTimeString().split(':');
    const pref = dateArr.slice(0, 2).join(':');
    const suff = dateArr[2].split(' ')[1];
    return pref + ' ' + suff; // time + AM/PM
  } else {
    // 12-2w
    const arr = date.toLocaleString().split(',');
    const dateStr = arr[0].split('/').slice(0, 2).join('/');
    const timeArr = arr[1].split(':');
    const pref = timeArr.slice(0, 2).join(':');
    const suff = timeArr[2].split(' ')[1];
    const timeStr = pref + ' ' + suff;
    return dateStr + ': ' + timeStr; // MM/DD, TOD
  }
}

// Select the appropriate data for graph labels
// Note: could use work on hard-coded data points, as some are context-unaware and may misrepresent data or lose data on some data points
// Ideally, all promql info would be preserved in graphs
export function namePlot(obj: any, type: LookupType, queryOptions: any) {
  //console.log('INSIDE NAMING: ', obj.metric, type, queryOptions);

  switch (type) {
    case LookupType.CustomEntry: {
      // iterate over obj.metric and filter out matching values, return first non-matching
      return 'obj.metric.id';
    }

    case LookupType.CPUUsage:
    case LookupType.MemoryUsed:
    case LookupType.PodRestarts: {
      if (!queryOptions.hasOwnProperty('target')) {
        if (obj.metric.hasOwnProperty('name')) return obj.metric.name;
        else return 'data';
      }
      if (queryOptions.target === 'container') {
        if (obj.metric.hasOwnProperty('container')) return obj.metric.container;
        return 'Sum of all Containers';
      }
      if (queryOptions.target === 'node') return obj.metric.node;
      if (queryOptions.target === 'namespace') return obj.metric.namespace;
      return obj.metric.id;
    }
    case LookupType.PodCount: {
      if (!queryOptions.hasOwnProperty('target')) {
        if (obj.metric.hasOwnProperty('id')) return obj.metric.id;
        else return 'Pods in Cluster';
      }
      if (queryOptions.target === 'container')
        return obj.metric.created_by_name;
      if (queryOptions.target === 'node') return obj.metric.node;
      if (queryOptions.target === 'namespace') return obj.metric.namespace;
      return obj.metric.id;
    }

    case LookupType.FreeDiskinNode:
    case LookupType.MemoryFreeInNode: {
      if (!obj.metric.hasOwnProperty('instance')) return 'data';
      return obj.metric.instance;
    }
    case LookupType.NodesReadinessFlapping: {
      if (!obj.metric.hasOwnProperty('node')) return 'data';
      return obj.metric.node;
    }

    case LookupType.CPUIdle: {
      return 'Requested vCPUs Unused';
    }
    case LookupType.MemoryIdle: {
      return 'Requested GiB RAM Unused';
    }

    case LookupType.ReadyNodesByCluster: {
      return 'Nodes Ready for Pods';
    }

    case LookupType.HTTPRequests:
      if (
        !obj.metric.hasOwnProperty('endpoint') ||
        !obj.metric.hasOwnProperty('service')
      ) {
        return 'http request';
      }
      return `service="${obj.metric.service}" endpoint="${obj.metric.endpoint}"`;

    case LookupType.PodCountByHPA:
      if (!obj.metric.hasOwnProperty('created_by_name')) return 'pod count';
      return `created_by_name="${obj.metric.created_by_name}"`;

    case LookupType.DiskUsage:
    default: {
      return 'data';
    }
  }
}

// Use demo data for offline development
export function placeholderData(
  metricId: string,
  userData: any,
  options: any
): any {
  const promMetrics: plotData = {
    labels: [],
    datasets: [],
  };

  const readData = fs.readFileSync(
    path.resolve(__dirname, '../models/demoData.json'),
    'utf-8'
  );
  const parsedData = JSON.parse(readData);
  const myMetrics = parsedData[metricId];

  // Code is copied from above for consistency
  // Note that changes to metrics will not affect results
  myMetrics.forEach((obj: promResResultElements) => {
    const yAxis: yAxis = {
      label: '',
      data: [],
    };
    // populate the data for the promMeterics x-axis one time
    if (promMetrics.labels.length === 0) {
      obj.values.forEach((arr: any[]) => {
        const utcSeconds = arr[0];
        const d = new Date(0); //  0 sets the date to the epoch
        d.setUTCSeconds(utcSeconds);
        const cleanedTime = cleanTime(d, options);
        promMetrics.labels.push(cleanedTime);
      });
    }
    // populate the y-axis object with the scraped metrics
    // yAxis.label = obj.metric.toString();
    yAxis.label = namePlot(obj, userData.metrics[metricId].lookupType, {});
    obj.values.forEach((arr: any[]) => {
      yAxis.data.push(Number(arr[1]));
    });
    promMetrics.datasets.push(yAxis);
  });
  return promMetrics;
}
