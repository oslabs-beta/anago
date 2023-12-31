import { LookupType, ScopeType, GraphType } from '../../types.js';

// WELL-ORDERED QUERY BUILDING AND METRIC OBJ CREATION
// Requires 'metricName':string
// Requires LookupType enum
// Requires ScopeType enum
// Requires some queryOptions
// ... LookupType.CustomEntry (0) -> requires 'customQuery':string
// ... ScopeType.Range -> requires 'duration':number, 'stepSize':number
// ... ScopeType.Instant -> requires 'refresh':number
// ... *some* precons (1,2,3,5,6,9,10,11) must have 'context':string
// ... *some* precons (same) must have 'contextChoice':string
// ... *some* precons (1.6.11) must have 'target':string
// Metrics Generate .metricId on creation
// Metrics Generate .graphType by ScopeType (future: options?)
// Metrics Generate .searchQuery using queryOptions -> queryBuilder

export function optionsBuilder(obj: any): any {
  const options: any = {};
  if (obj.lookupType === LookupType.CustomEntry)
    options.customQuery = obj.customQuery;
  if (obj.scopeType === ScopeType.Range) {
    options.duration = obj.duration;
    options.stepSize = obj.stepSize;
  } else {
    options.refresh = obj.refresh;
  }
  if (obj.hasOwnProperty('context')) {
    options.context = obj.context.toLowerCase();
    options.contextChoice = obj.contextChoice;
  }
  if (obj.hasOwnProperty('target')) {
    switch (obj.target) {
      case 'Namespaces':
        options.target = 'namespace';
        break;
      case 'Nodes':
        options.target = 'node';
        break;
      // case 'Deployments':
      //   options.target = 'deployment';
      //   break;
      case 'Containers':
        options.target = 'container';
        break;
      default:
        break;
    }
  }
  return options;
}

// Build PromQL queries with the appropriate syntax, account for queryOptions
export function queryBuilder(
  lookupType: LookupType,
  queryOptions: any,
): string | undefined {
  switch (lookupType) {
    case LookupType.CustomEntry: {
      if (queryOptions.hasOwnProperty('customQuery'))
        return queryOptions.customQuery;
      else {
        console.log(
          'Error in queryBuilder: Tried to create a custom query with no custom query string provided.',
        );
        return undefined;
      }
    }

    case LookupType.CPUUsage: {
      // Full Cluster default
      let str = 'rate (container_cpu_usage_seconds_total{mode!="idle"}[10m])';
      // Restricted Context
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      )
        str =
          'rate (container_cpu_usage_seconds_total{mode!="idle",' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"}[10m])';
      // Target
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        str = 'sum (' + str + ') by (' + queryOptions.target + ')';

      return str;
    }

    case LookupType.CPUIdle: {
      // Tracks difference between requested CPU resources and actual CPU usage
      let str =
        'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""';
      // Check for filtering by namespace
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      ) {
        str +=
          ', ' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)';
      } else {
        str +=
          '}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)';
      }
      return str;
    }

    case LookupType.MemoryUsed: {
      // Full Cluster default
      let str = 'container_memory_working_set_bytes';
      // Restricted Context
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      )
        str =
          str +
          '{' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"}';
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        str = 'sum (' + str + ') by (' + queryOptions.target + ')';
      // Convert to GB
      str += '/ (1024*1024*1024)';
      return str;
    }

    case LookupType.MemoryIdle: {
      // Tracks difference between requested ram resources and actual ram usage
      let str =
        'sum((container_memory_usage_bytes{container!="POD",container!=""';
      // Check for filtering by namespace
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      ) {
        str +=
          ', ' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)';
      } else {
        str +=
          '} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)';
      }
      return str;
    }

    case LookupType.DiskUsage: {
      console.log('Error in queryBuilder: Disk Usage query does not exist.');
      return undefined;
    }

    case LookupType.MemoryFreeInNode: {
      if (queryOptions.hasOwnProperty('contextChoice')) {
        return (
          "node_memory_MemAvailable_bytes{instance='" +
          queryOptions.contextChoice +
          ":9100'}/node_memory_MemTotal_bytes*100"
        );
      }
      return 'node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes*100';
    }

    case LookupType.FreeDiskinNode: {
      if (queryOptions.hasOwnProperty('contextChoice')) {
        return (
          "node_filesystem_avail_bytes/node_filesystem_size_bytes{fstype='xfs',instance='" +
          queryOptions.contextChoice +
          ":9100'}*100"
        );
      }
      return "node_filesystem_avail_bytes/node_filesystem_size_bytes{fstype='xfs'}*100";
    }

    case LookupType.ReadyNodesByCluster: {
      return 'sum(kube_node_status_condition{condition="Ready", status="true"}==1)';
    }

    case LookupType.NodesReadinessFlapping: {
      return 'sum(changes(kube_node_status_condition{status="true",condition="Ready"}[15m])) by (node)';
    }

    case LookupType.PodRestarts: {
      // Full Cluster default
      let str = 'sum(changes(kube_pod_status_ready{condition="true"';
      // Restricted Context
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      )
        str =
          str +
          ',' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"';
      str += '}[5m]))';
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        str += 'by (' + queryOptions.target + ')';
      return str;
    }

    case LookupType.PodCount: {
      // Full Cluster default
      let str = 'sum (kube_pod_info {container!="POD",node!=""';
      // Restricted Context
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      )
        str =
          str +
          ',' +
          queryOptions.context +
          '="' +
          queryOptions.contextChoice +
          '"';
      str += '})';
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        if (queryOptions.target == 'container') {
          str += 'by (created_by_name)';
        } else {
          str += 'by (' + queryOptions.target + ')';
        }
      return str;
    }

    case LookupType.HPAByDeployment: {
      return 'kube_horizontalpodautoscaler_metadata_generation';
    }

    case LookupType.HPATargetStatus: {
      return 'kube_horizontalpodautoscaler_status_target_metric{metric_target_type="utilization"}';
    }

    case LookupType.HPATargetSpec: {
      return 'kube_horizontalpodautoscaler_spec_target_metric';
    }

    case LookupType.HPAMinReplicas: {
      return 'kube_horizontalpodautoscaler_spec_min_replicas';
    }

    case LookupType.HPAMaxReplicas: {
      return 'kube_horizontalpodautoscaler_spec_max_replicas';
    }

    case LookupType.HPACurrentReplicas: {
      return 'kube_horizontalpodautoscaler_status_current_replicas';
    }

    case LookupType.HPADesiredReplicas: {
      return 'kube_horizontalpodautoscaler_status_desired_replicas';
    }

    case LookupType.HPAUtilization: {
      return '(kube_horizontalpodautoscaler_status_current_replicas/kube_horizontalpodautoscaler_spec_max_replicas) * 100 >= 80';
    }

    case LookupType.HTTPRequests: {
      // this promQL will only work if you have Ingress
      // it can be customized to work without ingress by injecting the desired deployment
      // Example: 'increase(prometheus_http_requests_total[1m])';
      let str = 'increase(http_requests_total[1m])';
      if (
        queryOptions.hasOwnProperty('hpa') &&
        queryOptions.hasOwnProperty('endpoint')
      ) {
        str =
          str.slice(0, 39) +
          `{service=~"` +
          queryOptions.hpa.slice(0, queryOptions.hpa.indexOf('-')) +
          `.+", endpoint="` +
          queryOptions.endpoint +
          `"}` +
          str.slice(39);
      }
      if (queryOptions.hasOwnProperty('hpa')) {
        str =
          str.slice(0, 39) +
          `{service=~"` +
          queryOptions.hpa.slice(0, queryOptions.hpa.indexOf('-')) +
          `.+"}` +
          str.slice(39);
      }
      if (queryOptions.hasOwnProperty('endpoint')) {
        str =
          str.slice(0, 39) +
          `{endpoint="` +
          queryOptions.endpoint +
          `"}` +
          str.slice(39);
      }
      return str;
    }

    case LookupType.PodCountByHPA: {
      let str = 'count by (created_by_name)(kube_pod_info)';
      if (queryOptions.hasOwnProperty('hpa')) {
        str =
          str.slice(0, str.length - 1) +
          `{created_by_name=~"` +
          queryOptions.hpa +
          `.+"})`;
      }
      return str;
    }

    default: {
      console.log('Error in queryBuilder: Invalid LookupType passed in.');
      return undefined;
    }
  }
}
