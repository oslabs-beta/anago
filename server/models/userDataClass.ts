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
    dashboardNumber = 0
  ): string {
    const newMetric = new Metric(metricName, lookupType, scopeType, queryOptions);
    this.dashboards[dashboardNumber].metrics.push(newMetric.metricId);
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
    queryOptions: any = {}
  ) {
    this.metricId = randomUUID();
    this.metricName = metricName;
    this.lookupType = lookupType; // LookupType.MemoryUsed
    this.scopeType = scopeType;
    this.queryOptions = queryOptions;
    this.graphType = graphForQuery(
      this.lookupType,
      this.scopeType,
      this.queryOptions
    ); // GraphyType.LineGraph
    this.searchQuery = queryBuilder(this.lookupType, this.queryOptions);
  }
}



function graphForQuery(
  lookupType: LookupType,
  scopeType: ScopeType,
  options: any
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

//     default: {
//       return 'node_memory_Active_bytes/node_memory_MemTotal_bytes*100';
//     }
//   }
// }
