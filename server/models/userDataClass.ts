import { randomUUID } from 'crypto';

export class UserData {
  userId: string;
  clusters: Cluster[];
  constructor() {
    this.userId = randomUUID();
    this.clusters = [];
  }
}

export class Cluster {
  clusterId: string;
  clusterName: string;
  clusterUrl: string;
  metrics: Metric[];
  constructor(clusterName: string, clusterUrl: string) {
    this.clusterId = randomUUID();
    this.clusterName = clusterName;
    this.clusterUrl = clusterUrl;
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
    this.lookupType = lookupType;
    this.graphType = graphForQuery(lookupType);
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
  PodCount, //0
  PodCountNow,
  CPUIdle,
  MemoryIdle,
  MemoryUsed,
  DiskFree, //5
  PodActive,
  PodAge,
}

function graphForQuery(lookupType: LookupType): GraphType {
  // Assigns a graph type to a query type
  switch (lookupType) {
    case LookupType.PodCountNow:
      return GraphType.PrintValue;
    default:
      return GraphType.LineGraph;
  }
}

function queryBuilder(lookupType: LookupType, queryOptions: any): string {
  // Creates a promQL search string for a given LookupType and set of options
  console.log(lookupType, queryOptions);
  switch (lookupType) {
    case LookupType.PodCount: {
      return 'sum by (namespace) (kube_pod_info)';
    }

    case LookupType.PodCountNow: {
      return 'sum by (namespace) (kube_pod_info)';
    }

    case LookupType.CPUIdle: {
      return 'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by(namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"}))-1 >0)';
    }
    default: {
      return 'sum by (namespace) (kube_pod_info)';
    }
  }
}
