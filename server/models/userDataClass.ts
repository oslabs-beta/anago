import { randomUUID } from 'crypto';

export class UserData {
  userId: string;
  clusters: Cluster[];
  dashboards: Dashboard[];
  metrics: any;
  addMetric(
    metricName: string,
    lookupType: LookupType,
    queryOptions?: any,
    dashboardNumber = 0,
  ): string {
    const newMetric = new Metric(metricName, lookupType, queryOptions);
    this.dashboards[dashboardNumber].metrics.push(newMetric.metricId);
    this.metrics[newMetric.metricId] = newMetric;
    return newMetric.metricId;
  }
  constructor() {
    this.userId = randomUUID();
    this.clusters = [];
    this.dashboards = [];
    this.metrics = {};
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
  graphType: GraphType;
  queryOptions: any;
  searchQuery: string;
  constructor(metricName: string, lookupType: LookupType, queryOptions?: any) {
    this.metricId = randomUUID();
    this.metricName = metricName;
    this.lookupType = lookupType; // LookupType.MemoryUsed
    this.graphType = graphForQuery(lookupType); // GraphyType.LineGraph
    this.queryOptions = queryOptions;
    this.searchQuery = queryBuilder(this.lookupType, this.queryOptions);
  }
}

enum GraphType {
  PrintValue, //0
  LineGraph, //1
  PieChart, //2
}

export enum LookupType {
  CPUIdleByCluster, //0
  MemoryIdleByCluster,
  MemoryUsed,
  CPUUsedByContainer,
  FreeDiskUsage,
  ReadyNodesByCluster, //5
  NodesReadinessFlapping,
}

function graphForQuery(lookupType: LookupType): GraphType {
  // Assigns a graph type to a query type
  switch (lookupType) {
    case LookupType.CPUIdleByCluster:
      return GraphType.LineGraph;
    case LookupType.MemoryIdleByCluster:
      return GraphType.LineGraph;
    case LookupType.MemoryUsed:
      return GraphType.LineGraph;
    case LookupType.CPUUsedByContainer:
      return GraphType.LineGraph;
    case LookupType.FreeDiskUsage:
      return GraphType.LineGraph;
    case LookupType.ReadyNodesByCluster:
      return GraphType.LineGraph;
    case LookupType.NodesReadinessFlapping:
      return GraphType.LineGraph;
    default:
      return GraphType.LineGraph;
  }
}

function queryBuilder(lookupType: LookupType, queryOptions: any): string {
  // Creates a promQL search string for a given LookupType and set of options
  console.log(lookupType, queryOptions);
  switch (lookupType) {
    case LookupType.CPUIdleByCluster: {
      return 'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)';
    }

    case LookupType.MemoryIdleByCluster: {
      return 'sum((container_memory_usage_bytes{container!="POD",container!=""} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)';
    }

    case LookupType.MemoryUsed: {
      return 'node_memory_Active_bytes/node_memory_MemTotal_bytes*100';
    }

    case LookupType.CPUUsedByContainer: {
      return 'container_cpu_usage_seconds_total';
    }

    case LookupType.FreeDiskUsage: {
      return 'node_filesystem_avail_bytes/node_filesystem_size_bytes*100';
    }

    case LookupType.ReadyNodesByCluster: {
      return 'sum(kube_node_status_condition{condition="Ready", status="true"}==1)';
    }

    case LookupType.NodesReadinessFlapping: {
      return 'sum(changes(kube_node_status_condition{status="true",condition="Ready"}[15m])) by (node) > 2';
    }

    default: {
      return 'node_memory_Active_bytes/node_memory_MemTotal_bytes*100';
    }
  }
}
