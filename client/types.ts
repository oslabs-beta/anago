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
  name: string,
  namespace: string,
  
}

export interface Pod {
  name: string,
  namespace: string,
  nodeName: string,
  serviceAccount: any,
  containerStatuses: any,
  podIP: string,
}

export interface Namespace {
  name: string,
  id: string,
  creationTimeStamp: any
}

export interface Service {
  name: string,
  creationTimeStamp: any,
  namespace: string,
  ports: number,

}

export interface Deployment {
  name: string,
  creationTimeStamp: any,
  namespace: string,
  replicas: number,
  availableReplicas: any,
}

export interface ClusterInfo {
  nodes: Node[];
  pods: Pod[];
  namespaces: Namespace[];
  services: Service[];
  deployments: Deployment[];
  
}