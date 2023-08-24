import { RequestHandler } from 'express';
//global error handler type
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
  dashboards: any;
  metrics: {};
  hiddenAlerts: [];
}

//represents properties on Node object passed from API request in K8s API controller to components on FE
export interface Node {
  name: string;
  namespace: any;
  creationTimestamp: number | string;
  labels: {}[];
  uid: string;
  providerID: string;
  status: {};
}

//represents properties on Pod object passed from API request in K8s API controller to components on FE
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

//represents properties on Namespace object passed from API request in K8s API controller to components on FE
export interface Namespace {
  name: string;
  creationTimestamp: string;
  labels: [];
  uid: string;
  phase: string;
  nodeName: string;
}

//represents properties on Service object passed from API request in K8s API controller to components on FE
export interface Service {
  name: string;
  namespace: string;
  creationTimestamp: string;
  labels: [];
  uid: string;
  ports: [];
  loadBalancer: [];
  clusterIP;
}

//represents properties on Deployment object passed from API request in K8s API controller to components on FE
export interface Deployment {
  name: string;
  creationTimestamp: string;
  labels?: [];
  namespace: string;
  replicas: any;
  uid: string;
  status: {};
}

//represents properties on Cluster object passed from API request in K8s API controller to components on FE
export interface Cluster {
  nodes: Node[];
  pods: Pod[];
  namespaces: Namespace[];
  services: Service[];
  deployments: Deployment[];
}

//filtering through alert data and cleaning it up for improved iteration
export interface CleanAlert {
  name: string;
  description: string;
  summary: string;
  severity: string;
  affectedPod?: string | undefined;
  affectedNamespace?: string | undefined;
  startTime: string;
  lastUpdated: string;
}

export enum LookupType {
  // Default Dashboard
  CustomEntry, //0
  CPUUsage, // 1
  CPUIdle, // 2
  MemoryUsed, // 3
  MemoryFreeInNode, // 4
  MemoryIdle, // 5
  DiskUsage, // 6
  FreeDiskinNode, // 7
  ReadyNodesByCluster, // 8
  NodesReadinessFlapping, // 9
  PodRestarts, //10
  PodCount, // 11
  // HPA Dashboard
  HPAByDeployment, //12
  HPATargetStatus, //13
  HPATargetSpec, //14
  HPAMinReplicas, //15
  HPAMaxReplicas, //16
  HPACurrentReplicas, //17
  HPADesiredReplicas, //18
  HPAUtilization, //19
  HTTPRequests, //20
  PodCountByHPA, //21
}

export enum ScopeType {
  Range, //0
  Instant, //1
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
      return 'CPU Underutilization';
    case LookupType.MemoryUsed:
      return 'Memory Usage by Container';
    case LookupType.MemoryFreeInNode:
      return 'Memory Available in Nodes (%)';
    case LookupType.MemoryIdle:
      return 'Memory Underutilization';
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
    case LookupType.HPAByDeployment:
      return 'HPA by Deployment';
    case LookupType.HPATargetStatus:
      return 'HPATargetStatus';
    case LookupType.HPATargetSpec:
      return 'HPA Target Spec';
    case LookupType.HPAMinReplicas:
      return 'HPA Min Replicas';
    case LookupType.HPAMaxReplicas:
      return 'HPA Max Replicas';
    case LookupType.HPACurrentReplicas:
      return 'HPA Current Replicas';
    case LookupType.HPADesiredReplicas:
      return 'HPA Desired Replicas';
    case LookupType.HPAUtilization:
      return 'HPA Utilization';
    case LookupType.HTTPRequests:
      return 'HTTP Requests';
    case LookupType.PodCountByHPA:
      return 'Pod Count by HPA';
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
