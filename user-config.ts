// Prometheus Query port
export const DEPLOYMENT_URL = 'http://localhost:9090/';
// Prometheus Alertmanager port
export const ALERT_URL = 'http://localhost:9093/';

// HPA Testing App Location
export const PITHY_URL =
  'http://a02d62995141f4ecb856d5dd4467ca42-607603214.us-east-2.elb.amazonaws.com/slow';

export const ACTIVE_DEPLOYMENT = true; // T: Cluster is live. F: Cached queries
export const NEW_USER = false; // T: Use default Metrics. F: Load saved user
