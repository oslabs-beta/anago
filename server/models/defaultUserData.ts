import { UserData, Cluster, Metric, Dashboard } from './userDataClass.js';
import { LookupType, ScopeType } from '../../types.js';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';

const newUserData = new UserData();
newUserData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));
const hpaDash = new Dashboard('HPA Monitoring');
newUserData.dashboards.push(hpaDash);

if (ACTIVE_DEPLOYMENT) {
  // Build live demo clusters
  newUserData.addMetric(
    'CPU Usage by Namespace',
    LookupType.CPUUsage,
    ScopeType.Range,
    {
      duration: 2 * 60 * 60,
      stepSize: 5 * 60,
      target: 'namespace',
    },
  );
  newUserData.addMetric(
    'Memory Usage by Container',
    LookupType.MemoryUsed,
    ScopeType.Range,
    {
      duration: 2 * 60 * 60,
      stepSize: 5 * 60,
      target: 'container',
    },
  );
  newUserData.addMetric(
    '% Memory Available by Node',
    LookupType.MemoryFreeInNode,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addMetric(
    '% Disk Space Available by Node',
    LookupType.FreeDiskinNode,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addMetric(
    'CPU Underutilization',
    LookupType.CPUIdle,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addMetric(
    'Memory Underutilization',
    LookupType.MemoryIdle,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    },
  );
  newUserData.addMetric(
    'Pod Count by Namespace',
    LookupType.PodCount,
    ScopeType.Range,
    {
      duration: 2 * 24 * 60 * 60,
      stepSize: 60 * 60,
    },
  );
  newUserData.addMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    ScopeType.Range,
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 4 * 60 * 60,
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
    'HPA Utilization >= 90%',
    LookupType.HPAUtilization,
    {
      // duration: 24 * 60 * 60, // 1 day
      duration: 60 * 60,
      stepSize: 60, // 1 min
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

  const placeHolderMetrics: any = [];
  placeHolderMetrics.push(
    new Metric('CPU Idle by Cluster', LookupType.CPUIdle, ScopeType.Range, {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }),
  );
  placeHolderMetrics.push(
    new Metric(
      'Memory Idle by Cluster',
      LookupType.MemoryIdle,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      },
    ),
  );
  placeHolderMetrics.push(
    new Metric('Pod Count by Namespace', LookupType.PodCount, ScopeType.Range, {
      duration: 3 * 60 * 60,
      stepSize: 5 * 60,
    }),
  );
  placeHolderMetrics.push(
    new Metric(
      '% Memory Used by Node',
      LookupType.MemoryUsed,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      },
    ),
  );
  placeHolderMetrics.push(
    new Metric('CPU Usage by Container', LookupType.CPUUsage, ScopeType.Range, {
      duration: 24 * 60 * 60,
      stepSize: 20 * 60,
    }),
  );
  placeHolderMetrics.push(
    new Metric(
      'Disk Space by Container',
      LookupType.FreeDiskinNode,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      },
    ),
  );
  placeHolderMetrics.push(
    new Metric(
      'Ready Nodes by Cluster',
      LookupType.ReadyNodesByCluster,
      ScopeType.Range,
      {
        duration: 21 * 24 * 60 * 60,
        stepSize: 8 * 60 * 60,
      },
    ),
  );

  placeHolderMetrics.forEach((el, index) => {
    el.metricId = index;
    newUserData.dashboards[0].metrics.push(el.metricId);
    newUserData.metrics[el.metricId] = el;
  });
}

export default newUserData;
