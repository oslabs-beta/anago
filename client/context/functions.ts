import { CleanAlert } from '../../types';

//clean times for improved readability
export function cleanTime(date: string) {
  const newDate = new Date(date);
  const dateStr = newDate.toDateString().split(' ').slice(1, 3).join(' ');
  const time = newDate.toLocaleTimeString();
  return dateStr + ' ' + time;
}

//clean component names for improved visuals and readability
export function cleanName(name: string) {
  let split = name.split('-');
  if (split.length > 3) {
    split = split.slice(2);
  }
  return split.join('-');
}

//handle alert data processing for FE
export function handleAlerts(statefulAlerts: []) {
  const current = [...statefulAlerts].map((alert) => {
    const obj = <CleanAlert>{};
    // obj['name'] = alert['name'];
    // obj['description'] = alert['description'];
    // obj['summary'] = alert['summary'];
    // obj['severity'] = alert['severity'];
    // if (alert['pod']) obj['affectedPod'] = alert['pod'];
    // if (alert['namespace']) obj['affectedNamespace'] = alert['namespace'];
    // obj['startTime'] = cleanTime(alert['startTime']);
    // obj['lastUpdated'] = cleanTime(alert['lastUpdated']);
    obj['name'] = alert['labels']['alertname'];
    obj['description'] = alert['annotations']['description'];
    obj['summary'] = alert['annotations']['summary'];
    obj['severity'] = alert['labels']['severity'];
    if (alert['labels']['pod']) obj['affectedPod'] = alert['labels']['pod'];
    if (alert['labels']['namespace'])
      obj['affectedNamespace'] = alert['labels']['namespace'];
    obj['startsAt'] = alert['startsAt'];
    obj['startTime'] = cleanTime(alert['startsAt']);
    obj['lastUpdated'] = cleanTime(alert['updatedAt']);
    return obj;
  });
  return current;
}
