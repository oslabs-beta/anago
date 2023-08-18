import { UserData, Cluster } from './userDataClass.js';
import { LookupType } from '../../types.js';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';

const newUserData = new UserData();
newUserData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

if (ACTIVE_DEPLOYMENT) {
  // Build live demo clusters
  newUserData.addMetric('CPU Idle by Cluster', LookupType.CPUIdleByCluster, {
    duration: 5 * 60 * 60,
    stepSize: 5 * 60,
  });
  newUserData.addMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster
  );
  newUserData.addMetric('Pod Count by Namespace', LookupType.PodCount, {
    duration: 3 * 60 * 60,
    stepSize: 5 * 60,
  });
  newUserData.addMetric('% Memory Used by Node', LookupType.MemoryUsed);
  newUserData.addMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer
  );
  newUserData.addMetric('Disk Space by Container', LookupType.FreeDiskUsage);
  newUserData.addMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    }
  );
  // Verify before using Flapping Metric
  // userData.addMetric(
  //   'Nodes Readiness Flapping',
  //   LookupType.NodesReadinessFlapping,
  // );
} else {
  // Use placeholder data instead

  newUserData.addPlaceholderMetric(
    'CPU Idle by Cluster',
    LookupType.CPUIdleByCluster,
    '0',
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addPlaceholderMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster,
    '1'
  );
  newUserData.addPlaceholderMetric(
    'Pod Count by Namespace',
    LookupType.PodCount,
    '2',
    {
      duration: 3 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addPlaceholderMetric(
    '% Memory Used by Node',
    LookupType.MemoryUsed,
    '3'
  );
  newUserData.addPlaceholderMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer,
    '4'
  );
  newUserData.addPlaceholderMetric(
    'Disk Space by Container',
    LookupType.FreeDiskUsage,
    '5'
  );
  newUserData.addPlaceholderMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    '6',
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    }
  );
}

export default newUserData;
