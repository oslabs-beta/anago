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
import userData from '../models/defaultUserData';
import { Metric } from '../models/userDataClass.js';
//  types
import type { Request, Response, NextFunction } from 'express';
// object containing graph label and y-axis values
type yAxis = {
  label: string;
  data: number[];
};
// object to send to front end to plot on a graph
type plotData = {
  xAxis: Date[];
  dataSets: yAxis[];
};

/* EXAMPLE plotData
{
  xAxis: [arrayOfXValues]
  dataSets: [
    {
     label: ‘pod 1’,
     data: [arrayOfYValues]
    },
    {
     label: pod 2’,
     data: [arrayOfYValues]
    }
  ]
}
*/

// prometheus http api url's to query
const promURL = 'http://localhost:9090/api/v1/';
const promURLInstant = promURL + 'query?query=';
const promURLRange = promURL + 'query_range?query=';
// TODO: update alerts url if needed
const promURLAlerts = promURL + 'alerts';

const promApiController: any = {
  // query prometheus for data over a specified range of time
  getRangeMetrics: async (req: Request, res: Response, next: NextFunction) => {
    // retrieve metricId from request query parameter
    const metricId = req.params.id;
    console.log('req.params.id: ', req.params.id);

    // prometheues query string components
    // TODO: use metric id to get the metric.searchQuery -> uncomment the line below and comment out the hard coded query
    // const query = userData.metrics[metricId][searchQuery];
    const query = 'sum by (namespace) (kube_pod_info)';
    const end = Math.floor(Date.now() / 1000); // current date and time
    const start = end - 86400; // 24 hours ago
    const endQuery = `&end=${end}`;
    const startQuery = `&start=${start}`;
    const stepQuery = `&step=1200s`; // data interval

    // initialize object to store scraped metrics
    const promMetrics: plotData = {
      xAxis: [],
      dataSets: [],
    };
    try {
      // query Prometheus
      const response = await fetch(
        promURLRange + query + startQuery + endQuery + stepQuery,
      );
      // TODO: should it have different helper functions that process the data depending on the "resultType"? will all range queries be of the type "matrix"?
      // parse response
      const data = await response.json();
      console.log(data);
      // if the prometheus query response indicates a failure, then send an error message
      if (data.status === 'failure') {
        return next({
          log: `Prometheus fetch for data returned a failure response of "errorType": ${data.errorType} and "error": ${data.error}`,
          status: 500,
          message: { err: 'Error retreiving metrics' },
        });
      } else {
        console.log(data.data);

        data.data.result.forEach(
          (obj: { metric: { namespace: string }; values: any[][] }) => {
            // initialize object to store in promMetrics dataSets
            const yAxis: yAxis = {
              label: '',
              data: [],
            };
            // populate the data for the promMeterics x-axis one time
            if (promMetrics.xAxis.length === 0) {
              obj.values.forEach((arr: any[]) => {
                const utcSeconds = arr[0];
                const d = new Date(0); //  0 sets the date to the epoch
                d.setUTCSeconds(utcSeconds);
                promMetrics.xAxis.push(d);
              });
            }
            // populate the y-axis object with the scraped metrics
            yAxis.label = obj.metric.namespace;
            obj.values.forEach((arr: any[]) => {
              yAxis.data.push(Number(arr[1]));
            });
            promMetrics.dataSets.push(yAxis);
          },
        );
        res.locals.promMetrics = promMetrics;
        return next();
      }
    } catch (err) {
      next({
        log: `error in promApiController.getRangeMetrics: ${err}`,
        status: 500,
        message: { err: 'Error retreiving metrics' },
      });
    }
  },
  // getSnapshotMetrics
};

// CURRENT METRIC QUERIES:
// 'sum by (namespace) (kube_pod_info)';
// 'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by(namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"}))-1 >0)';

export default promApiController;
