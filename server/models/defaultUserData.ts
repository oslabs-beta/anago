import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

const myCluster = new Cluster('Testing Cluster', 'amazon.com');

const metric1 = new Metric('Pod Count Graph', LookupType.PodCount, {
  timeLength: 1440,
});
const metric2 = new Metric('Current Pod Count', LookupType.PodCountNow);
const metric3 = new Metric('CPU Idle', LookupType.CPUIdle);
const metric4 = new Metric('Memory Idle', LookupType.MemoryIdle);
const metric5 = new Metric('Memory Used', LookupType.MemoryUsed);
const metric6 = new Metric('Disk Free', LookupType.DiskFree);
const metric7 = new Metric('Pod Active', LookupType.PodActive);
const metric8 = new Metric('Pod Age', LookupType.PodAge);

// add the metrics to the myCluster.metrics array
myCluster.metrics.push(metric1, metric2);
userData.clusters.push(myCluster);

export default userData;
