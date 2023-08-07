import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

userData.addMetric('Current Pod Count', LookupType.PodCountNow);
userData.addMetric(
  'Pod Count Graph',
  LookupType.PodCount,
  {
    timeLength: 1440,
  },
  0
);

export default userData;
