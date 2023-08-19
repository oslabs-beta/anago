import {
  LookupType,
  yAxis,
  plotData,
  promResResultElements,
} from '../../types.js';
import newUserData from '../models/defaultUserData.js';
import { NEW_USER, ACTIVE_DEPLOYMENT } from '../../user-config.js';
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
    console.log('Successfully read user data, returning now.');
    return userData;
  } catch (err) {
    console.log(
      'Error reading User Data from disk in helper function readUserData.'
    );
    return;
  }
}

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

export function namePlot(obj: any, type: LookupType) {
  switch (type) {
    case LookupType.CPUIdle: {
      return 'MVP-Cluster';
    }
    case LookupType.MemoryIdle: {
      return 'MVP-Cluster';
    }
    case LookupType.MemoryUsed: {
      return obj.metric.pod;
    }
    case LookupType.CPUUsage: {
      return obj.metric.node;
    }
    case LookupType.DiskUsage: {
      return obj.metric.pod; 
    }
    case LookupType.ReadyNodesByCluster: {
      return 'MVP-Cluster';
    }
    case LookupType.NodesReadinessFlapping: {
      console.log('NAMING', type);
      console.log(obj.metric);
      return 'data';
    }
    case LookupType.PodCount: {
      return obj.metric.namespace;
    }
    default:
      return 'data';
  }
}

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
    yAxis.label = namePlot(obj, userData.metrics[metricId].lookupType);
    obj.values.forEach((arr: any[]) => {
      yAxis.data.push(Number(arr[1]));
    });
    promMetrics.datasets.push(yAxis);
  });
  // console.log(promMetrics);
  return promMetrics;
}
