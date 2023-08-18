import { UserData, Cluster, Dashboard } from './userDataClass.js';
import { LookupType } from '../../types.js';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';

const newUserData = new UserData();
newUserData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));
const hpaDash = new Dashboard('HPA Monitoring');
newUserData.dashboards.push(hpaDash);

if (ACTIVE_DEPLOYMENT) {
  // Build live demo clusters
  newUserData.addMetric('CPU Idle by Cluster', LookupType.CPUIdleByCluster, {
    duration: 5 * 60 * 60,
    stepSize: 5 * 60,
  });
  newUserData.addMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster,
  );
  newUserData.addMetric('Pod Count by Namespace', LookupType.PodCount, {
    duration: 3 * 60 * 60,
    stepSize: 5 * 60,
  });
  newUserData.addMetric('% Memory Used by Node', LookupType.MemoryUsed);
  newUserData.addMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer,
  );
  newUserData.addMetric('Disk Space by Container', LookupType.FreeDiskUsage);
  newUserData.addMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    },
  );
  // Verify before using Flapping Metric
  // userData.addMetric(
  //   'Nodes Readiness Flapping',
  //   LookupType.NodesReadinessFlapping,
  // );
  //
  // ! HPA Monitoring pre-built Dashboard
  newUserData.addMetric(
    'HPA by Deployment',
    LookupType.HPAByDeployment,
    null,
    1,
  );
  // TODO: filter by deployment: kube_horizontalpodautoscaler_metadata_generation{horizontalpodautoscaler="pithy-deployment"}
  newUserData.addMetric(
    'HPA Target Status',
    LookupType.HPATargetStatus,
    null,
    1,
  );
  newUserData.addMetric('HPA Target', LookupType.HPATargetSpec, null, 1);
  newUserData.addMetric(
    'HPA Minimum Replicas',
    LookupType.HPAMinReplicas,
    null,
    1,
  );
  newUserData.addMetric(
    'HPA Maximum Replicas',
    LookupType.HPAMaxReplicas,
    null,
    1,
  );
  newUserData.addMetric(
    'HPA Current Replicas',
    LookupType.HPACurrentReplicas,
    null,
    1,
  );
  newUserData.addMetric(
    'HPA Desired Replicas',
    LookupType.HPADesiredReplicas,
    null,
    1,
  );
  newUserData.addMetric(
    'HPA Utilization <= 20% or >= 80%',
    LookupType.HPAUtilization,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
    1,
  );
  newUserData.addMetric(
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
  newUserData.addMetric(
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

  newUserData.addPlaceholderMetric(
    'CPU Idle by Cluster',
    LookupType.CPUIdleByCluster,
    '0',
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addPlaceholderMetric(
    'Memory Idle by Cluster',
    LookupType.MemoryIdleByCluster,
    '1',
  );
  newUserData.addPlaceholderMetric(
    'Pod Count by Namespace',
    LookupType.PodCount,
    '2',
    {
      duration: 3 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addPlaceholderMetric(
    '% Memory Used by Node',
    LookupType.MemoryUsed,
    '3',
  );
  newUserData.addPlaceholderMetric(
    'CPU Usage by Container',
    LookupType.CPUUsedByContainer,
    '4',
  );
  newUserData.addPlaceholderMetric(
    'Disk Space by Container',
    LookupType.FreeDiskUsage,
    '5',
  );
  newUserData.addPlaceholderMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    '6',
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 8 * 60 * 60,
    },
  );
}

export default newUserData;
