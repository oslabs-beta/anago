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

interface dashboard {
  dashboardId: string;
  dashboardName: string;
  metrics: string[];
}

export interface UserData {
  userId: string;
  clusters: {}[];
  clusterName: string;
  dashboards: {}[
    // {
    //   dashboardId: string;
    //   dashboardName: string;
    //   metrics: string[];
    // },
  ];
  metrics: {};
}
