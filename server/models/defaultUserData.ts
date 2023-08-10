import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

userData.addMetric('CPU Idle By Cluster', LookupType.CPUIdleByCluster, {
  timeLength: 1440,
});
userData.addMetric('Memory Idle Per Cluster', LookupType.MemoryIdleByCluster);
userData.addMetric('Total Percentage of Memory Used', LookupType.MemoryUsed);
userData.addMetric('CPU Usage Per Container', LookupType.CPUUsedByContainer);
userData.addMetric('Free Disk Usage', LookupType.FreeDiskUsage);
userData.addMetric('Ready Nodes By Cluster', LookupType.ReadyNodesByCluster);
userData.addMetric(
  'Nodes Readiness Flapping',
  LookupType.NodesReadinessFlapping,
);

export default userData;
