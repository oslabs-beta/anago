import { randomUUID } from 'crypto';
import { LookupType, ScopeType, GraphType } from '../../types.js';
import { queryBuilder } from './queryBuilder.js';

export class UserData {
  userId: string;
  clusters: Cluster[];
  dashboards: Dashboard[];
  hiddenAlerts?: string[];
  metrics: any;
  addMetric(
    metricName: string,
    lookupType: LookupType,
    scopeType = ScopeType.Range,
    queryOptions?: any,
    dashboardNumber = 0,
  ): string {
    const newMetric = new Metric(
      metricName,
      lookupType,
      scopeType,
      queryOptions,
    );
    this.dashboards[dashboardNumber].metrics.push(newMetric.metricId);
    this.metrics[newMetric.metricId] = newMetric;
    return newMetric.metricId;
  }
  addPlaceholderMetric(
    metricName: string,
    lookupType: LookupType,
    placeholderId: string,
    queryOptions?: any,
  ): string {
    const newMetric = new Metric(metricName, lookupType, queryOptions);
    newMetric.metricId = placeholderId;
    this.dashboards[0].metrics.push(newMetric.metricId);
    this.metrics[newMetric.metricId] = newMetric;
    return newMetric.metricId;
  }
  constructor() {
    this.userId = randomUUID();
    this.clusters = [];
    this.dashboards = [];
    this.metrics = {};
    this.hiddenAlerts = [];
    const firstDash = new Dashboard('Kubernetes Dashboard');
    this.dashboards.push(firstDash);
  }
}

// fetch('/api/data/6') --> backend should return a data object that the frontend can print into a Line graph component exactly as is

// userData.cluster.metrics[6] -> request

export class Cluster {
  clusterId: string;
  clusterName: string;
  clusterUrl: string;
  constructor(clusterName: string, clusterUrl: string) {
    this.clusterId = randomUUID();
    this.clusterName = clusterName;
    this.clusterUrl = clusterUrl;
  }
}

export class Dashboard {
  dashboardId: string;
  dashboardName: string;
  metrics: string[];
  constructor(dashboardName: string) {
    this.dashboardId = randomUUID();
    this.dashboardName = dashboardName;
    this.metrics = [];
  }
}

export class Metric {
  metricId: string;
  metricName: string;
  lookupType: LookupType;
  scopeType: ScopeType;
  graphType: GraphType;
  queryOptions: any;
  searchQuery: string | undefined;
  constructor(
    metricName: string,
    lookupType: LookupType,
    scopeType = ScopeType.Range,
    queryOptions: any = {},
  ) {
    this.metricId = randomUUID();
    this.metricName = metricName;
    this.lookupType = lookupType;
    this.scopeType = scopeType;
    this.queryOptions = queryOptions;
    this.graphType = graphForQuery(
      this.lookupType,
      this.scopeType,
      this.queryOptions,
    );
    this.searchQuery = queryBuilder(this.lookupType, this.queryOptions);
  }
}

function graphForQuery(
  lookupType: LookupType,
  scopeType: ScopeType,
  options: any,
): GraphType {
  // Assigns a graph type to a query type
  // Ranged lookups yield line graphs
  if (scopeType == ScopeType.Range) return GraphType.LineGraph;
  //
  switch (lookupType) {
    case LookupType.CPUIdle:
      return GraphType.LineGraph;
    case LookupType.MemoryIdle:
      return GraphType.LineGraph;
    case LookupType.MemoryUsed:
      return GraphType.LineGraph;
    case LookupType.CPUUsage:
      return GraphType.LineGraph;
    case LookupType.FreeDiskinNode:
      return GraphType.LineGraph;
    case LookupType.ReadyNodesByCluster:
      return GraphType.LineGraph;
    case LookupType.NodesReadinessFlapping:
      return GraphType.LineGraph;
    case LookupType.HPAByDeployment:
      return GraphType.PrintValue;
    case LookupType.HPATargetStatus:
      return GraphType.PrintValue;
    case LookupType.HPATargetSpec:
      return GraphType.PrintValue;
    case LookupType.HPAMinReplicas:
      return GraphType.PrintValue;
    case LookupType.HPAMaxReplicas:
      return GraphType.PrintValue;
    case LookupType.HPACurrentReplicas:
      return GraphType.PrintValue;
    case LookupType.HPADesiredReplicas:
      return GraphType.PrintValue;
    case LookupType.HPAUtilization:
      return GraphType.PrintValue;
    case LookupType.HTTPRequests:
      return GraphType.LineGraph;
    case LookupType.PodCountByHPA:
      return GraphType.LineGraph;
    default:
      return GraphType.LineGraph;
  }
}

// OLD queryBuilder -- replaced by queryBuilder.ts
// function queryBuilder(lookupType: LookupType, queryOptions: any): string {
//   // Creates a promQL search string for a given LookupType and set of options
//   console.log(lookupType, queryOptions);
//   switch (lookupType) {
//     case LookupType.CustomEntry: {
//       return queryOptions.customQuery;
//     }

//     case LookupType.CPUIdle: {
//       return 'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)';
//     }

//     case LookupType.MemoryIdle: {
//       return 'sum((container_memory_usage_bytes{container!="POD",container!=""} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)';
//     }

//     case LookupType.MemoryUsed: {
//       return 'node_memory_Active_bytes/node_memory_MemTotal_bytes*100';
//     }

//     case LookupType.CPUUsage: {
//       return 'container_cpu_usage_seconds_total';
//     }

//     case LookupType.FreeDiskinNode: {
//       return 'node_filesystem_avail_bytes/node_filesystem_size_bytes*100';
//     }

//     case LookupType.ReadyNodesByCluster: {
//       return 'sum(kube_node_status_condition{condition="Ready", status="true"}==1)';
//     }

//     case LookupType.NodesReadinessFlapping: {
//       return 'sum(changes(kube_node_status_condition{status="true",condition="Ready"}[15m])) by (node) > 2';
//     }

//     case LookupType.PodCount: {
//       return 'sum by (namespace) (kube_pod_info)';
//     }

//     case LookupType.HPAByDeployment: {
//       return 'kube_horizontalpodautoscaler_metadata_generation';
//     }

//     case LookupType.HPATargetStatus: {
//       return 'kube_horizontalpodautoscaler_status_target_metric{metric_target_type="utilization"}';
//     }

//     case LookupType.HPATargetSpec: {
//       return 'kube_horizontalpodautoscaler_spec_target_metric';
//     }

//     case LookupType.HPAMinReplicas: {
//       return 'kube_horizontalpodautoscaler_spec_min_replicas';
//     }

//     case LookupType.HPAMaxReplicas: {
//       return 'kube_horizontalpodautoscaler_spec_max_replicas';
//     }

//     case LookupType.HPACurrentReplicas: {
//       return 'kube_horizontalpodautoscaler_status_current_replicas';
//     }

//     case LookupType.HPADesiredReplicas: {
//       return 'kube_horizontalpodautoscaler_status_desired_replicas';
//     }

//     case LookupType.HPAUtilization: {
//       // TODO: return metric back to 90%
//       // return '(kube_horizontalpodautoscaler_status_current_replicas/kube_horizontalpodautoscaler_spec_max_replicas) * 100 >= 90';
//       return '(kube_horizontalpodautoscaler_status_current_replicas/kube_horizontalpodautoscaler_spec_max_replicas) * 100 <= 30';
//     }

//     case LookupType.HTTPRequests: {
//       // TODO: return metric back to deployment http requests (would need to set up ingress to access it on pithy)
//       // return 'increase(http_requests_total[1m])';
//       // return 'increase(prometheus_http_requests_total[1m])';
//       return 'increase(prometheus_http_requests_total[1m])';
//     }

//     case LookupType.PodCountByHPA: {
//       // TODO: make it not just for pithy
//       // return 'sum by (created_by_name) (kube_pod_info)';
//       // return 'sum by (created_by_name) (kube_pod_info{created_by_name=~"pithy-deployment.+"})';
//       // return 'count(kube_pod_info{created_by_name=~"pithy-deployment.+"})';
//       return 'sum by (created_by_name) (kube_pod_info{created_by_name="prometheus-prometheus-node-exporter"})';
//     }

//     default: {
//       return 'node_memory_Active_bytes/node_memory_MemTotal_bytes*100';
//     }
//   }
// }
