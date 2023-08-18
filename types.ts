export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export type MetricProps = {
  graphType: number;
  lookupType: number;
  metricId: string;
  metricName: string;
  searchQuery: string;
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
  CPUIdleByCluster, //1
  MemoryIdleByCluster,
  MemoryUsed,
  CPUUsedByContainer,
  FreeDiskUsage,
  ReadyNodesByCluster,
  NodesReadinessFlapping,
  PodCount,
  HPAByDeployment, //9
  HPATargetStatus, //10
  HPATargetSpec, //11
  HPAMinReplicas, //12
  HPAMaxReplicas, //13
  HPACurrentReplicas, //14
  HPADesiredReplicas, //15
  HPAUtilization, //16
  HTTPRequests, //17
  PodCountByHPA, //18
}

export const lookupName = (type: LookupType): string => {
  switch (type) {
    case LookupType.CustomEntry:
      return 'Custom PromQL Entry';
    case LookupType.CPUIdleByCluster:
      return 'CPU Idle by Cluster';
    case LookupType.MemoryIdleByCluster:
      return 'Memory Idle by Cluster';
    case LookupType.MemoryUsed:
      return '% Memory Used by Node';
    case LookupType.CPUUsedByContainer:
      return 'CPU Usage by Container';
    case LookupType.FreeDiskUsage:
      return 'Disk Space by Container';
    case LookupType.ReadyNodesByCluster:
      return 'Ready Nodes by Cluster';
    case LookupType.NodesReadinessFlapping:
      return 'Node Readiness Flapping';
    case LookupType.PodCount:
      return 'Pod Count by Namespace';
    default:
      return 'Lookup Type Not Found';
  }
};

//  types:
// object containing graph label and y-axis values
export type yAxis = {
  label: string;
  data: number[];
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
