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