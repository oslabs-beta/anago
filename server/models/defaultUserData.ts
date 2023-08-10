import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

userData.addMetric('Pod Count Graph', LookupType.PodCount);
userData.addMetric('CPU Idle', LookupType.CPUIdle);
userData.addMetric('CPU Usage', LookupType.CPUUsage);
userData.addMetric('Memory Idle', LookupType.MemoryIdle);
userData.addMetric('Memory Used %', LookupType.MemoryUsed);
userData.addMetric('Disk Free', LookupType.DiskFree);
// userData.addMetric('Pod Active', LookupType.PodActive);
// userData.addMetric('Pod Age', LookupType.PodAge);
userData.addMetric('Ready Nodes', LookupType.ReadyNodes);
// userData.addMetric('Node Flapping', LookupType.NodeReadinessFlapping);

export default userData;
