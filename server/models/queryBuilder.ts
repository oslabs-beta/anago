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

// Front-End Object Properties:
// Always
// ... name:string
// ... lookupType:enum
// ... scopeType: enum
// Depends
// ... .lookupType = LookupType.CustomEntry: customQuery:string
// ... .scopeType = ScopeType.Range: duration:number
// ... .scopeType = ScopeType.Range: stepSize:number
// ... .scopeType = ScopeType.Instant: refresh:number
// ... some .lookupType: context:string (1,2,3,5,6,9,10,11)
// ... some precons: chosenContext:string (same)
// ... some precons: target:string (1,6,11)

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
      case 'Deployments':
        options.target = 'deployment';
        break;
      case 'Containers':
        options.target = 'container';
        break;
      default:
        break;
    }
  }

  return options;
}

export function queryBuilder(
  lookupType: LookupType,
  queryOptions: any
): string | undefined {
  console.log(lookupType, queryOptions);

  switch (lookupType) {
    case LookupType.CustomEntry: {
      if (queryOptions.hasOwnProperty('customQuery'))
        return queryOptions.customQuery;
      else {
        console.log(
          'Error in queryBuilder: Tried to create a custom query with no custom query string provided.'
        );
        return undefined;
      }
    }

    case LookupType.CPUUsage: {
      // Full Cluster default
      let str = 'rate (container_cpu_usage_seconds_total[10m])';
      // Restricted Context
      if (
        queryOptions.hasOwnProperty('context') &&
        queryOptions.context !== 'cluster'
      )
        str =
          'rate (container_cpu_usage_seconds_total{' +
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
      return 'sum((rate(container_cpu_usage_seconds_total{container!="POD",container!=""}[30m]) - on (namespace,pod,container) group_left avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="cpu"})) * -1 >0)';
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
          '=' +
          queryOptions.contextChoice +
          '}';
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        str = 'sum (' + str + ') by (' + queryOptions.target + ')';
      return str;
    }

    case LookupType.MemoryFreeInNode: {
      return 'node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes*100';
    }

    case LookupType.MemoryIdle: {
      return 'sum((container_memory_usage_bytes{container!="POD",container!=""} - on (namespace,pod,container) avg by (namespace,pod,container)(kube_pod_container_resource_requests{resource="memory"})) * -1 >0 ) / (1024*1024*1024)';
    }

    case LookupType.DiskUsage: {
      console.log('Error in queryBuilder: Disk Usage query does not exist.');
      return undefined;
    }

    case LookupType.FreeDiskinNode: {
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
          str + ',' + queryOptions.context + '=' + queryOptions.contextChoice;
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
          str + ',' + queryOptions.context + '=' + queryOptions.contextChoice;
      str += '})';
      if (
        queryOptions.hasOwnProperty('target') &&
        queryOptions.target !== 'all'
      )
        str += 'by (' + queryOptions.target + ')';
      return str;
    }

    default: {
      console.log('Error in queryBuilder: Invalid LookType passed in.');
      return undefined;
    }
  }
}
