import { Metric } from '../models/userDataClass.js';
import {
  yAxis,
  plotData,
  promResponse,
  promResResultElements,
} from '../../types.js';
import {
  placeholderData,
  cleanTime,
  namePlot,
  readUserData,
} from './helperFuncs.js';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';
import type { Request, Response, NextFunction } from 'express';

// prometheus http api url's to query
const promURL = DEPLOYMENT_URL + 'api/v1/';
const promURLInstant = promURL + 'query?query=';
const promURLRange = promURL + 'query_range?query=';
// TODO: update alerts url if need
const promURLAlerts = promURL + 'alerts';

const promApiController: any = {
  // build the query to send to the prometheus http api
  queryBuilder: (req: Request, res: Response, next: NextFunction) => {
    // TODO: REQS SHOULD BE COMING IN ON BODY NOW
    console.log('entered queryBuilder');

    // Fetch userData
    const userData = readUserData();
    if (!userData) {
      next({
        log: `Reading User Data failed in promApiController.getRangeMetrics.`,
        status: 500,
        message: { err: 'Error retreiving user data.' },
      });
    }

    // retrieve metricId from request query parameter
    const metricId = req.params.id;
    console.log('id', metricId);

    // prometheus http api url's to query
    const promURL = 'http://localhost:9090/api/v1/';
    const promURLInstant = promURL + 'query?query=';
    const promURLRange = promURL + 'query_range?query=';
    // TODO: update alerts url if needed
    const promURLAlerts = promURL + 'alerts';

    // prometheues query string components
    // TODO: IS QUERY PRECONFIGURED OR CUSTOM:
    const query = userData.metrics[metricId].searchQuery;
    const options = userData.metrics[metricId].queryOptions;

    // TODO: IF INSTANT QUERY:
    // let metricDuration = '';
    if (req.body) {
      const metricDuration = req.body.duration;
      // console.log('metricDuration:', metricDuration);
      if (metricDuration === 'instant') {
        console.log('instant query');
        res.locals.promQuery = promURLInstant + query;
        return next();
      }
    }

    // TODO: IF RANGE QUERY:
    const end = Math.floor(Date.now() / 1000); // current date and time
    const endQuery = `&end=${end}`;
    const duration = options.hasOwnProperty('duration')
      ? options.duration
      : 24 * 60 * 60; // default 24h
    const start = end - duration;
    const startQuery = `&start=${start}`;
    const stepSize = options.hasOwnProperty('stepSize')
      ? options.stepSize
      : 20 * 60; // default 20 min
    const stepQuery = `&step=${stepSize}s`; // data interval

    res.locals.userData = userData;
    res.locals.queryOptions = options;
    res.locals.promQuery =
      promURLRange + query + startQuery + endQuery + stepQuery;

    return next();
    // TODO: add error handler
  },

  // get request querying prometheus http api that exists as an instance in kubernetes
  getMetrics: async (req: Request, res: Response, next: NextFunction) => {
    // retrieve metricId from request query parameter
    const metricId = req.params.id;
    // Read placeholder data instead of fetching- if the cluster is not currently running on AWS
    // Placeholder Data for Offline Development
    if (!ACTIVE_DEPLOYMENT) {
      console.log('Supplying Placeholder data for metricId ', metricId);
      const placeholderFetch = placeholderData(
        metricId,
        res.locals.userData,
        res.locals.queryOptions,
      );
      // console.log('Local data for metric ', metricId, ':\n', placeholderFetch);
      res.locals.promMetrics = placeholderFetch;
      return next();
    }
    // initialize object to store scraped metrics. This object shape is required by ChartJS to graph
    const promMetrics: plotData = {
      labels: [],
      datasets: [],
    };
    try {
      // query Prometheus
      const response = await fetch(res.locals.promQuery);
      const data = await response.json();
      // if the prometheus query response indicates a failure, then send an error message
      if (data.status === 'error') {
        return next({
          log: `Prometheus fetch for data returned a failure response of "errorType": ${data.errorType} and "error": ${data.error}`,
          status: 500,
          message: { err: 'Error retreiving metrics' },
        });
      }
      // if no metrics meet the query requirements, then no metrics data will be returned from prometheus
      else if (data.data.result.length === 0) {
        res.locals.promMetrics = 'No metrics meet the scope of the query';
        return next();
      }
      // if instant query type
      else if (req.body) {
        if (req.body.duration === 'instant') {
          console.log('instant promql response', data.data.result);
          res.locals.promMetrics = data.data.result;
          return next();
        }
      }
      // if prometheus query response contains metric data, then filter data into an object of plotData type
      else {
        // TEMP: record data for testing later
        /*        const currentData = fs.readFile(
          path.resolve(__dirname, '../models/demoData.json'),
          'utf-8',
          (err, readData) => {
            const parsedData = JSON.parse(readData);
            parsedData[metricId] = data.data.result;
            console.log(parsedData);
            const writeData = JSON.stringify(parsedData);
            fs.writeFile(
              path.resolve(__dirname, '../models/demoData.json'),
              writeData,
              () => console.log('write complete')
            );
          }
        );
        */

        data.data.result.forEach((obj: promResResultElements) => {
          // initialize object to store in promMetrics datasets
          const yAxis: yAxis = {
            label: '',
            data: [],
          };
          // populate the data for the promMeterics x-axis one time
          if (promMetrics.labels.length === 0) {
            obj.values.forEach((arr: any[]) => {
              const utcSeconds = arr[0];
              const d = new Date(0); //  0 sets the date to the epoch
              d.setUTCSeconds(utcSeconds);
              const cleanedTime = cleanTime(d, res.locals.queryOptions);
              promMetrics.labels.push(cleanedTime);
            });
          }
          // populate the y-axis object with the scraped metrics
          // yAxis.label = obj.metric.toString();
          yAxis.label = namePlot(
            obj,
            res.locals.userData.metrics[metricId].lookupType,
          );
          obj.values.forEach((arr: any[]) => {
            yAxis.data.push(Number(arr[1]));
          });
          promMetrics.datasets.push(yAxis);
        });

        res.locals.promMetrics = promMetrics;
        return next();
      }
    } catch (err) {
      next({
        log: `error in promApiController.getMetrics: ${err}`,
        status: 500,
        message: { err: 'Error retreiving metrics' },
      });
    }
  },
};

export default promApiController;

// ! PromQL HTTP API
/* 
Instant queries: 
  (evaluates an instant query at a single point in time)
  GET /api/v1/query
  POST /api/v1/query

  URL query parameters:
    query=<string>: Prometheus expression query string.
    time=<rfc3339 | unix_timestamp>: Evaluation timestamp. Optional
    timeout=<duration>: Evaluation timeout. Optional. Defaults to and is capped by the value of the -query.timeout flag.
*/
/*
Range queries:
    (evaluates an expression query over a range of time)
  GET /api/v1/query_range
  POST /api/v1/query_range

  URL query parameters:
    query=<string>: Prometheus expression query string.
    start=<rfc3339 | unix_timestamp>: Start timestamp, inclusive.
    end=<rfc3339 | unix_timestamp>: End timestamp, inclusive.
    step=<duration | float>: Query resolution step width in duration format or float number of seconds.
    timeout=<duration>: Evaluation timeout. Optional. Defaults to and is capped by the value of the -query.timeout flag.
*/
/*
Alerts queries:
    (returns a list of all active alerts)
  GET /api/v1/alerts
*/
/*
 You can URL-encode additional parameters directly in the request body by using the POST method and Content-Type: application/x-www-form-urlencoded header. This is useful when specifying a large query that may breach server-side URL character limits 
 */
//  ! Default Queries
/*
CPU idle by cluster.
sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)

"status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {},
                "values": [
                    [
                        1691441311,
                        "0.938050565804171"
                    ],

Memory idle by cluster. 
sum((container_memory_usage_bytes{container!="POD",container!=""} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)

    "status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {},
                "values": [
                    [
                        1691441311,
                        "0.5337486267089844"
                    ],

total percentage of used memory- ONLY SHOWS NODES WITH SET MEMORY LIMIT
node_memory_Active_bytes/node_memory_MemTotal_bytes*100


"status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {
                    "container": "node-exporter",
                    "endpoint": "http-metrics",
                    "instance": "192.168.29.101:9100",
                    "job": "node-exporter",
                    "namespace": "monitoring",
                    "pod": "prometheus-prometheus-node-exporter-jtl5g",
                    "service": "prometheus-prometheus-node-exporter"
                },
                "values": [
                    [
                        1691441311,
                        "8.306136341145741"
                    ],
            ...
            {
                "metric": {
                    "container": "node-exporter",
                    "endpoint": "http-metrics",
                    "instance": "192.168.57.47:9100",
                    "job": "node-exporter",
                    "namespace": "monitoring",
                    "pod": "prometheus-prometheus-node-exporter-mfphb",
                    "service": "prometheus-prometheus-node-exporter"
                },
                "values": [
                    [        

CPU usage per container LOOK FOR TOTAL
container_cpu_usage_seconds_total

"status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {
                    "__name__": "container_cpu_usage_seconds_total",
                    "container": "alertmanager",
                    "cpu": "total",
                    "endpoint": "https-metrics",
                    "id": "/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod765efbff_6dc5_4564_a538_818f6843fffc.slice/cri-containerd-89be286a3872a39b097bf9d8beb759341201e91d67a73ed442daa82c303fac35.scope",
                    "image": "quay.io/prometheus/alertmanager:v0.25.0",
                    "instance": "192.168.57.47:10250",
                    "job": "kubelet",
                    "metrics_path": "/metrics/cadvisor",
                    "name": "89be286a3872a39b097bf9d8beb759341201e91d67a73ed442daa82c303fac35",
                    "namespace": "monitoring",
                    "node": "ip-192-168-57-47.us-east-2.compute.internal",
                    "pod": "alertmanager-prometheus-kube-prometheus-alertmanager-0",
                    "service": "prometheus-kube-prometheus-kubelet"
                },
                "values": [
                    [
                        1691441311,
                        "6.382165545"
                    ],
                ...
                {
                "metric": {
                    "__name__": "container_cpu_usage_seconds_total",
                    "container": "aws-node",
                    "cpu": "total",
                    "endpoint": "https-metrics",
                    "id": "/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod9caf85c2_3cf7_4953_926f_ed0062c5ddd4.slice/cri-containerd-b2b5bd4a8287141af09ff83a2bfafb480b8e1656e4f3393de85802dffe6b99f0.scope",
                    "image": "602401143452.dkr.ecr-fips.us-east-1.amazonaws.com/amazon-k8s-cni:v1.12.2",
                    "instance": "192.168.57.47:10250",
                    "job": "kubelet",
                    "metrics_path": "/metrics/cadvisor",
                    "name": "b2b5bd4a8287141af09ff83a2bfafb480b8e1656e4f3393de85802dffe6b99f0",
                    "namespace": "kube-system",
                    "node": "ip-192-168-57-47.us-east-2.compute.internal",
                    "pod": "aws-node-b2bt2",
                    "service": "prometheus-kube-prometheus-kubelet"

total free disk usage
node_filesystem_avail_bytes/node_filesystem_size_bytes*100

"status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {
                    "container": "node-exporter",
                    "device": "/dev/xvda1",
                    "endpoint": "http-metrics",
                    "fstype": "xfs",
                    "instance": "192.168.29.101:9100",
                    "job": "node-exporter",
                    "mountpoint": "/",
                    "namespace": "monitoring",
                    "pod": "prometheus-prometheus-node-exporter-jtl5g",
                    "service": "prometheus-prometheus-node-exporter"
                },
                "values": [
                    [
                        1691441311,
                        "95.58196094960412"
                    ],
            ...
            {
                "metric": {
                    "container": "node-exporter",
                    "device": "/dev/xvda1",
                    "endpoint": "http-metrics",
                    "fstype": "xfs",
                    "instance": "192.168.57.47:9100",
                    "job": "node-exporter",
                    "mountpoint": "/",
                    "namespace": "monitoring",
                    "pod": "prometheus-prometheus-node-exporter-mfphb",
                    "service": "prometheus-prometheus-node-exporter"
                },
             diff prom node exporter pods with diff mountpoints
            27048 LINES OF DATA RETURNED

Number of ready nodes per cluster
sum(kube_node_status_condition{condition="Ready", status="true"}==1)

{
    "status": "success",
    "data": {
        "resultType": "matrix",
        "result": [
            {
                "metric": {},
                "values": [
                    [
                        1691441311,
                        "2"
                    ],

Nodes readiness flapping
sum(changes(kube_node_status_condition{status="true",condition="Ready"}[15m])) by (node) > 2

{
    "status": "success",
    "data": {
        "resultType": "matrix",
        "result": []
    }
}

*/
