import { UserData, Cluster, LookupType } from './userDataClass.js';
const DEPLOYMENT_URL = 'http://localhost.com/9090';
const ACTIVE_DEPLOYMENT = true;

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
  //
  // ! HPA Monitoring pre-built Dashboard
  userData.addMetric('HPA by Deployment', LookupType.HPAByDeployment, null, 1);
  // TODO: filter by deployment: kube_horizontalpodautoscaler_metadata_generation{horizontalpodautoscaler="pithy-deployment"}
  userData.addMetric('HPA Target Status', LookupType.HPATargetStatus, null, 1);
  userData.addMetric('HPA Target', LookupType.HPATargetSpec, null, 1);
  userData.addMetric(
    'HPA Minimum Replicas',
    LookupType.HPAMinReplicas,
    null,
    1,
  );
  userData.addMetric(
    'HPA Maximum Replicas',
    LookupType.HPAMaxReplicas,
    null,
    1,
  );
  userData.addMetric(
    'HPA Current Replicas',
    LookupType.HPACurrentReplicas,
    null,
    1,
  );
  userData.addMetric(
    'HPA Desired Replicas',
    LookupType.HPADesiredReplicas,
    null,
    1,
  );
  userData.addMetric(
    'HPA Utilization <= 90%',
    LookupType.HPAUtilization,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
    1,
  );
  userData.addMetric(
    'Total HTTP Requests',
    LookupType.HTTPRequests,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
    1,
  );
  // TODO filter by endpt, method type, job, app, namespace
  /*
  userData.addMetric(
    'HTTP Requests by Endpoint',
    LookupType.HTTPRequestsEndpoints,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
    1,
  );
  can filter results for endpoints and method types
  increase(http_requests_total{endpoint="https-metrics", method="GET"}[24h])
  */
  userData.addMetric(
    'Pod Count by HPA Deployment',
    LookupType.PodCountByHPA,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
    1,
  );
  // TODO -will give: {created_by_name="pithy-deployment-f77bd655c"} SO NEED TO GET HPA FROM HPA METADATA TO FILTER FIRST PART OF CREATED_BY STRING
} else {
  // Use placeholder data instead
  userData.addPlaceholderMetric(
    'CPU Idle by Cluster',
    LookupType.CPUIdleByCluster,
    '0',
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  userData.addPlaceholderMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster,
    '1',
  );
  userData.addPlaceholderMetric('Pod Count by Node', LookupType.PodCount, '2', {
    duration: 3 * 60 * 60,
    stepSize: 5 * 60,
  });
  userData.addPlaceholderMetric(
    '% Memory Used by Node',
    LookupType.MemoryUsed,
    '3',
  );
  userData.addPlaceholderMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer,
    '4',
  );
  userData.addPlaceholderMetric(
    'Disk Space by Container',
    LookupType.FreeDiskUsage,
    '5',
  );
  userData.addPlaceholderMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    '6',
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    },
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
