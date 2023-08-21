import { UserData, Cluster, Metric } from './userDataClass.js';
import { LookupType, ScopeType } from '../../types.js';
import { ACTIVE_DEPLOYMENT, DEPLOYMENT_URL } from '../../user-config.js';

const newUserData = new UserData();
newUserData.clusters.push(new Cluster('Testing Cluster', DEPLOYMENT_URL));

if (ACTIVE_DEPLOYMENT) {
  // Build live demo clusters
  newUserData.addMetric(
    'CPU Usage by Namespace',
    LookupType.CPUUsage,
    ScopeType.Range,
    {
      duration: 2 * 60 * 60,
      stepSize: 5 * 60,
      target: 'namespace',
    }
  );
  newUserData.addMetric(
    'Memory Usage by Container',
    LookupType.MemoryUsed,
    ScopeType.Range,
    {
      duration: 2 * 60 * 60,
      stepSize: 5 * 60,
      target: 'container',
    }
  );
  newUserData.addMetric(
    '% Memory Available by Node',
    LookupType.MemoryFreeInNode,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addMetric(
    '% Disk Space Available by Node',
    LookupType.FreeDiskinNode,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addMetric(
    'CPU Underutilization',
    LookupType.CPUIdle,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addMetric(
    'Memory Underutilization',
    LookupType.MemoryIdle,
    ScopeType.Range,
    {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    }
  );
  newUserData.addMetric(
    'Pod Count by Namespace',
    LookupType.PodCount,
    ScopeType.Range,
    {
      duration: 2 * 24 * 60 * 60,
      stepSize: 60 * 60,
    }
  );
  newUserData.addMetric(
    'Ready Nodes by Cluster',
    LookupType.ReadyNodesByCluster,
    ScopeType.Range,
    {
      duration: 21 * 24 * 60 * 60,
      stepSize: 4 * 60 * 60,
    }
  );
  // Verify before using Flapping Metric
  // userData.addMetric(
  //   'Nodes Readiness Flapping',
  //   LookupType.NodesReadinessFlapping,
  // );
} else {
  // Use placeholder data instead

  const placeHolderMetrics: any = [];
  placeHolderMetrics.push(
    new Metric('CPU Idle by Cluster', LookupType.CPUIdle, ScopeType.Range, {
      duration: 5 * 60 * 60,
      stepSize: 5 * 60,
    })
  );
  placeHolderMetrics.push(
    new Metric(
      'Memory Idle by Cluster',
      LookupType.MemoryIdle,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      }
    )
  );
  placeHolderMetrics.push(
    new Metric('Pod Count by Namespace', LookupType.PodCount, ScopeType.Range, {
      duration: 3 * 60 * 60,
      stepSize: 5 * 60,
    })
  );
  placeHolderMetrics.push(
    new Metric(
      '% Memory Used by Node',
      LookupType.MemoryUsed,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      }
    )
  );
  placeHolderMetrics.push(
    new Metric('CPU Usage by Container', LookupType.CPUUsage, ScopeType.Range, {
      duration: 24 * 60 * 60,
      stepSize: 20 * 60,
    })
  );
  placeHolderMetrics.push(
    new Metric(
      'Disk Space by Container',
      LookupType.FreeDiskinNode,
      ScopeType.Range,
      {
        duration: 24 * 60 * 60,
        stepSize: 20 * 60,
      }
    )
  );
  placeHolderMetrics.push(
    new Metric(
      'Ready Nodes by Cluster',
      LookupType.ReadyNodesByCluster,
      ScopeType.Range,
      {
        duration: 21 * 24 * 60 * 60,
        stepSize: 8 * 60 * 60,
      }
    )
  );

  placeHolderMetrics.forEach((el, index) => {
    el.metricId = index;
    newUserData.dashboards[0].metrics.push(el.metricId);
    newUserData.metrics[el.metricId] = el;
  });
}

export default newUserData;
