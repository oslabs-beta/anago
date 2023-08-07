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
import type { Request, Response, NextFunction } from 'express';

const promURL = 'http://localhost:9090/api/v1/';
const promURLInstant = promURL + 'query?query=';
const promURLRange = promURL + 'query_range?query=';
// TODO: update alerts url if needed
const promURLAlerts = promURL + 'alerts';

const promApiController: object = {
  getRangeMetrics: async (req: Request, res: Response, next: NextFunction) => {
    // destructure queries from request body
    // TODO: what format will these be in? array or object. I think it should be an array of objects that has the query string, start and end times (and step duration?)
    const { queries } = req.body;

    // initialize array to store scraped metrics
    // metrics will be received in an object format
    // TODO: make a type for the response metrics once you know exactly what properties they contain
    const promMetrics: object[] = [];
    try {
      // TODO: made a foreach loop assuming queries will be an array for now. May need to update id expecting an object
      queries.forEach((query: string) => {
        // query Prometheus
        const response = await fetch(promURLRange + query);
        // parse response
        const data = await response.json();
        console.log(data);
        // TODO: make new object with specific metric response and push into promMetrics array
      });
      res.locals.promMeterics = promMetrics;
      return next();
    } catch (err) {
      // TODO:
      next({
        log: `error in promApiController.getRangeMetrics: ${err}`,
        status: 500,
        message: { err: 'Error retreiving metrics' },
      });
    }
  },
  // getSnapshotMetrics
};

export default promApiController;
