import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

userData.addMetric('CPU Idle By Cluster', LookupType.CPUIdleByCluster);
userData.addMetric('Memory Idle Per Cluster', LookupType.MemoryIdleByCluster);
userData.addMetric('Pod Count', LookupType.PodCount, {
  duration: 2 * 60 * 60,
  stepSize: 5 * 60,
});
userData.addMetric('Total Percentage of Memory Used', LookupType.MemoryUsed);
userData.addMetric('CPU Usage Per Container', LookupType.CPUUsedByContainer);
userData.addMetric('Free Disk Usage', LookupType.FreeDiskUsage);
userData.addMetric('Ready Nodes By Cluster', LookupType.ReadyNodesByCluster);
// userData.addMetric(
//   'Nodes Readiness Flapping',
//   LookupType.NodesReadinessFlapping,
// );

export default userData;

// <<<<<<< HEAD
// userData.addMetric('Memory Idle', LookupType.MemoryIdle);
// userData.addMetric('CPU Idle', LookupType.CPUIdle);
// userData.addMetric('Pod Count Graph', LookupType.PodCount);
// userData.addMetric('CPU Usage', LookupType.CPUUsage);
// userData.addMetric('Memory Used %', LookupType.MemoryUsed);
// userData.addMetric('Disk Free', LookupType.DiskFree);
// // userData.addMetric('Pod Active', LookupType.PodActive);
// // userData.addMetric('Pod Age', LookupType.PodAge);
// userData.addMetric('Ready Nodes', LookupType.ReadyNodes);
// // userData.addMetric('Node Flapping', LookupType.NodeReadinessFlapping);
// =======
