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
