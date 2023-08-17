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
  // HPA Monitoring pre-built Dashboard
  userData.addMetric('HPA by Deployment', LookupType.HPAByDeployment);
  // name/deployment: horizontalpodautoscaler="pithy-deployment",
  // query by deployment: kube_horizontalpodautoscaler_metadata_generation{horizontalpodautoscaler="pithy-deployment"}
  userData.addMetric('HPA Target Status', LookupType.HPATargetStatus);
  // kube_horizontalpodautoscaler_status_target_metric{metric_target_type="utilization"}
  userData.addMetric('HPA Target', LookupType.HPATargetSpec);
  // kube_horizontalpodautoscaler_spec_target_metric;
  userData.addMetric('HPA Minimum Replicas', LookupType.HPAMinReplicas);
  // kube_horizontalpodautoscaler_spec_min_replicas
  userData.addMetric('HPA Maximum Replicas', LookupType.HPAMaxReplicas);
  // kube_horizontalpodautoscaler_spec_max_replicas
  userData.addMetric('HPA Current Replicas', LookupType.HPACurrentReplicas);
  // kube_horizontalpodautoscaler_status_current_replicas
  userData.addMetric('HPA Desired Replicas', LookupTypeHPADesiredReplicas);
  // kube_horizontalpodautoscaler_status_desired_replicas
  // ! Utilization will be a calc of = current replicas/maxreplicas*100 (over time) OR retrive log of anytime this percentage reached 80+
  // userData.addMetric('HPA Utilization', LookupType.HPAUtilization);
  userData.addMetric('Total HTTP Requests', LookupType.HTTPRequests);
  // can filter results for endpoints and method types
  // increase(http_requests_total[24h])
  // increase(http_requests_total{endpoint="https-metrics", method="GET"}[24h])
  userData.addMetric('');
  // kube_horizontalpodautoscaler_spec_target_metric
  //
  //  addMetric(
  // metricName: string,
  // lookupType: LookupType,
  // queryOptions?: any,
  // dashboardNumber = 0
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
