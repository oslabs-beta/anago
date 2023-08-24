import { Metric } from '../models/userDataClass.ts';
import {
  yAxis,
  plotData,
  promResponse,
  promResResultElements,
} from '../../types';
import {
  placeholderData,
  cleanTime,
  namePlot,
  readUserData,
} from './helperFuncs.ts';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';
import type { Request, Response, NextFunction } from 'express';
import { optionsBuilder, queryBuilder } from '../models/queryBuilder.js';

// prometheus http api url's to query
const promURL = DEPLOYMENT_URL + 'api/v1/';
const promURLInstant = promURL + 'query?query=';
const promURLRange = promURL + 'query_range?query=';
const promURLAlerts = promURL + 'alerts';

const promApiController: any = {
  metricQueryLookup: (req: Request, res: Response, next: NextFunction) => {
    // When FE fetches a particular metricId, this middleware adds the metric basics (lookupType, searchQuery, queryOptions) onto res.locals for access in other middleware.

    // Fetch userData
    const userData = readUserData();
    if (!userData) {
      next({
        log: `Reading User Data failed in promApiController.getRangeMetrics.`,
        status: 500,
        message: { err: 'Error retreiving user data.' },
      });
    }
    res.locals.userData = userData;

    const metricId = req.params.id;
    if (
      userData.metrics === undefined ||
      userData.metrics[metricId] === undefined ||
      !userData.metrics[metricId].hasOwnProperty('lookupType')
    ) {
      next({
        log: `Invalid metricId lookup in promApiController.getRangeMetrics.`,
        status: 400,
        message: { err: 'Bad lookup request.' },
      });
    }
    res.locals.lookupType = userData.metrics[metricId].lookupType;
    res.locals.scopeType = userData.metrics[metricId].scopeType;
    res.locals.searchQuery = userData.metrics[metricId].searchQuery;
    res.locals.queryOptions = userData.metrics[metricId].queryOptions;
    next();
  },

  queryBaseBuilder: (req: Request, res: Response, next: NextFunction) => {
    // When a New Metric is being previewed or added, this middleware builds out new queryOptions and searchQuery objects and adds them to res.locals.

    // Fetch userData
    const userData = readUserData();
    if (!userData) {
      next({
        log: `Reading User Data failed in promApiController.getRangeMetrics.`,
        status: 500,
        message: { err: 'Error retreiving user data.' },
      });
    }
    res.locals.userData = userData;

    res.locals.lookupType = req.body.lookupType;
    res.locals.scopeType = req.body.scopeType;
    res.locals.queryOptions = optionsBuilder(req.body);
    res.locals.searchQuery = queryBuilder(
      req.body.lookupType,
      res.locals.queryOptions
    );
    next();
  },

  // build the query to send to the prometheus http api
  queryBuilder: (req: Request, res: Response, next: NextFunction) => {
    // prometheus http api url's to query
    const promURL = DEPLOYMENT_URL + 'api/v1/';
    const promURLInstant = promURL + 'query?query=';
    const promURLRange = promURL + 'query_range?query=';
    const promURLAlerts = promURL + 'alerts';
    // build a range promql
    if (res.locals.scopeType === 0) {
      const end = Math.floor(Date.now() / 1000); // current date and time
      const endQuery = `&end=${end}`;
      const duration = res.locals.queryOptions.duration;
      const start = end - duration;
      const startQuery = `&start=${start}`;
      const stepSize = res.locals.queryOptions.stepSize;
      const stepQuery = `&step=${stepSize}s`; // data interval

      res.locals.promQuery =
        promURLRange +
        res.locals.searchQuery +
        startQuery +
        endQuery +
        stepQuery;
    }
    // build an instant promql
    if (res.locals.scopeType === 1) {
      res.locals.promQuery = promURLInstant + res.locals.searchQuery;
    }

    return next();
  },

  // get request querying prometheus http api that exists as an instance in kubernetes
  getMetrics: async (req: Request, res: Response, next: NextFunction) => {
    // Placeholder Data for Offline Development
    // Read placeholder data instead of fetching- if the cluster is not currently running on AWS
    if (!ACTIVE_DEPLOYMENT) {
      // retrieve metricId from request query parameter
      const metricId = req.params.id;
      const placeholderFetch = placeholderData(
        metricId,
        res.locals.userData,
        res.locals.queryOptions
      );
      res.locals.promMetrics = placeholderFetch;
      return next();
    }

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
        res.locals.promMetrics = ['No metrics meet the scope of the query'];
        return next();
      }
      // if instant query type
      else if (res.locals.scopeType === 1 || req.body.displayType === 'log') {
        res.locals.promMetrics = data.data.result;
        return next();
      }
      // if prometheus query response contains metric data, then filter data into an object of plotData type
      else {
        // initialize object to store scraped metrics. This object shape is required by ChartJS to graph
        const promMetrics: plotData = {
          labels: [],
          datasets: [],
        };

        data.data.result.forEach((obj: promResResultElements) => {
          // initialize object to store in promMetrics datasets
          const yAxis: yAxis = {
            label: '',
            data: [],
            pointStyle: false,
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
          yAxis.label = namePlot(
            obj,
            res.locals.lookupType,
            res.locals.queryOptions
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
