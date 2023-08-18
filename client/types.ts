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
  hiddenAlerts: [];
}

// export interface V1Node {
//   metadata:  {
//     creationTimestamp: any;
//   labels: {}[];
//   name: string;
//   namespace: any;
//   uid: string;
//   };
//   spec: {
//     providerID: string;
//   };
//   status: {};
// }

// export interface k8sData {
//   response: {};
//   body: {
//     items: V1Node[];
//   };
// }

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
  nodeName: string;
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
