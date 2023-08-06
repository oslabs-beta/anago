import { UserData, Cluster, Metric, LookupType } from './userDataClass.js';

const userData = new UserData();

const myCluster = new Cluster('Testing Cluster', 'amazon.com');

const metric1 = new Metric('Current Pod Count', LookupType.PodCountNow);
const metric2 = new Metric('Pod Count Graph', LookupType.PodCount, {
  timeLength: 1440,
});

myCluster.metrics.push(metric1, metric2);
userData.clusters.push(myCluster);

export default userData;
