import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';
const ACTIVE_DEPLOYMENT = false;

const userData = new UserData();
userData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

if (ACTIVE_DEPLOYMENT) {
  // Build live demo clusters
  userData.addMetric('CPU Idle by Cluster', LookupType.CPUIdleByCluster, {
    duration: 5 * 60 * 60,
    stepSize: 5 * 60,
  });
  userData.addMetric('Memory Idle by Cluster', LookupType.MemoryIdleByCluster);
  userData.addMetric('Pod Count by Node', LookupType.PodCount, {
    duration: 3 * 60 * 60,
    stepSize: 5 * 60,
  });
  userData.addMetric('% Memory Used by Node', LookupType.MemoryUsed);
  userData.addMetric('CPU Usage by Container', LookupType.CPUUsedByContainer);
  userData.addMetric('Disk Space by Container', LookupType.FreeDiskUsage);
  userData.addMetric('Ready Nodes by Cluster', LookupType.ReadyNodesByCluster, {
    duration: 21 * 24 * 60 * 60,
    stepSize: 8 * 60 * 60,
  });
  // Verify before using Flapping Metric
  // userData.addMetric(
  //   'Nodes Readiness Flapping',
  //   LookupType.NodesReadinessFlapping,
  // );
} else {
  // Use placeholder data instead

  userData.addPlaceholderMetric(
    'CPU Idle by Cluster',
    LookupType.CPUIdleByCluster,
    '0',
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  userData.addPlaceholderMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster,
    '1'
  );
  userData.addPlaceholderMetric('Pod Count by Node', LookupType.PodCount, '2', {
    duration: 3 * 60 * 60,
    stepSize: 5 * 60,
  });
  userData.addPlaceholderMetric(
    '% Memory Used by Node',
    LookupType.MemoryUsed,
    '3'
  );
  userData.addPlaceholderMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer,
    '4'
  );
  userData.addPlaceholderMetric(
    'Disk Space by Container',
    LookupType.FreeDiskUsage,
    '5'
  );
  userData.addPlaceholderMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    '6',
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    }
  );
}

export default userData;

// // Old Steve Adds - Delete someday
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
