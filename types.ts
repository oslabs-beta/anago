export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export type MetricProps = {
  graphType: GraphType;
  lookupType: LookupType;
  scopeType: ScopeType;
  metricId?: string;
  metricName?: string;
  searchQuery?: string;
  queryOptions?: any;
};

export interface UserData {
  userId: string;
  clusters: {}[];
  clusterName: string;
  dashboards: {}[];
  metrics: {};
}

export interface Node {
  name: string;
  namespace: any;
  creationTimestamp: number | string;
  labels: {}[];
  uid: string;
  providerID: string;
  status: {};
}

export interface Pod {
  name: string;
  namespace: string;
  nodeName: string;
  creationTimestamp: string;
  labels: [];
  containers: [];
  conditions: [];
  serviceAccount: string;
  containerStatuses: any;
  podIP: string;
  phase: string;
  uid: string;
}

export interface Namespace {
  name: string;
  creationTimestamp: string;
  labels: [];
  uid: string;
  phase: string;
}

export interface Service {
  name: string;
  namespace: string;
  creationTimestamp: string;
  labels: [];
  uid: string;
  ports: [];
  loadBalancer: [];
}

export interface Deployment {
  name: string;
  creationTimestamp: string;
  labels: [];
  namespace: string;
  replicas: any;
  uid: string;
  status: {};
}

export interface Cluster {
  nodes: Node[];
  pods: Pod[];
  namespaces: Namespace[];
  services: Service[];
  deployments: Deployment[];
}

export enum LookupType {
  CustomEntry, //0
  CPUUsage, // 1 - Current CPU Usage
  CPUIdle, // 2 - Rylie help fill this out
  MemoryUsed, // 3
  MemoryFreeInNode, // 4 - Needs work
  MemoryIdle, // 5 - Rylie help!
  DiskUsage, // 6
  FreeDiskinNode, // 7
  ReadyNodesByCluster, // 8
  NodesReadinessFlapping, // 9
  PodRestarts, //10
  PodCount, // 111
}

export enum ScopeType {
  Range,
  Instant,
}

export enum GraphType {
  PrintValue, //0 Print Value or Bar Chart
  LineGraph, //1
  PieChart, //2
}

export const lookupName = (type: LookupType): string => {
  switch (type) {
    case LookupType.CustomEntry:
      return 'Custom PromQL Entry';
    case LookupType.CPUUsage:
      return 'CPU Usage';
    case LookupType.CPUIdle:
      return 'CPU Idle Tracking';
    case LookupType.MemoryUsed:
      return 'Memory Usage by Container';
    case LookupType.MemoryFreeInNode:
      return 'Memory Available in Nodes (%)';
    case LookupType.MemoryIdle:
      return 'Memory Idle Tracking';
    case LookupType.DiskUsage:
      return 'Disk Usage';
    case LookupType.FreeDiskinNode:
      return 'Disk Space Available on Nodes (%)';
    case LookupType.ReadyNodesByCluster:
      return 'Ready Nodes by Cluster';
    case LookupType.NodesReadinessFlapping:
      return 'Node Readiness Flapping';
    case LookupType.PodRestarts:
      return 'Pod Restart Rates';
    case LookupType.PodCount:
      return 'Pod Counts';
    default:
      return 'Lookup Type Not Found';
  }
};

//  types:
// object containing graph label and y-axis values
export type yAxis = {
  label: string;
  data: number[];
  pointStyle?: boolean;
};
// object to send to front end to plot on a graph
export type plotData = {
  labels: string[];
  datasets: yAxis[];
  options?: any;
};

// represents the objects stored in the Prometheus query response results array
export type promResResultElements = {
  metric: {
    __name__?: string;
    container?: string;
    cpu?: string;
    device?: string;
    endpoint?: string;
    fstype?: string;
    id?: string;
    image?: string;
    instance?: string;
    job?: string;
    metrics_path?: string;
    mountpoint?: string;
    name?: string;
    namespace?: string;
    node?: string;
    pod?: string;
    service?: string;
  };
  values: any[][];
};
// object representing the Prometheus query response object
export type promResponse = {
  status: 'success' | 'error';
  // only returned if status is "error"
  errorType?: string;
  error?: string;
  // may or may not be included if the status is an error
  data?: {
    resultType: string;
    result: promResResultElements[];
  };
};
