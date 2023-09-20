import { optionsBuilder, queryBuilder } from '../models/queryBuilder';
import { LookupType, ScopeType, GraphType } from '../../types.js';
import { describe, expect, it } from 'vitest';

describe('queryBuilder.optionsBuilder', () => {
  it('handles custom queries', () => {
    expect(
      optionsBuilder({
        lookupType: LookupType.CustomEntry,
        customQuery: 'testQuery',
      })
    ).toHaveProperty('customQuery', 'testQuery');
  });

  it('handles ranged and inst queries', () => {
    const rangedRes = optionsBuilder({
      scopeType: ScopeType.Range,
      duration: 24 * 60 * 60,
      stepSize: 300,
    });
    expect(rangedRes).toHaveProperty('duration', 24 * 60 * 60);
    expect(rangedRes).toHaveProperty('stepSize', 300);
    const instRes = optionsBuilder({
      scopeType: ScopeType.Instant,
      refresh: 300,
    });
    expect(instRes).toHaveProperty('refresh', 300);
  });

  it('handles query contexts', () => {
    const res = optionsBuilder({
      context: 'Namespace',
      contextChoice: 'default',
    });
    expect(res).toHaveProperty('context', 'namespace');
    expect(res).toHaveProperty('contextChoice', 'default');
  });

  it('handles query targets', () => {
    expect(
      optionsBuilder({
        target: 'Namespaces',
      })
    ).toHaveProperty('target', 'namespace');
    expect(
      optionsBuilder({
        target: 'Nodes',
      })
    ).toHaveProperty('target', 'node');
    expect(
      optionsBuilder({
        target: 'Containers',
      })
    ).toHaveProperty('target', 'container');
  });
});

describe('queryBuilder.queryBuilder', () => {
  it('builds custom queries', () => {
    expect(
      queryBuilder(LookupType.CustomEntry, { customQuery: 'testQuery' })
    ).toBe('testQuery');
    expect(queryBuilder(LookupType.CustomEntry, {})).toBeUndefined;
  });

  it('builds CPUUsage queries', () => {
    expect(queryBuilder(LookupType.CPUUsage, {})).toBe(
      'rate (container_cpu_usage_seconds_total{mode!="idle"}[10m])'
    );
    expect(
      queryBuilder(LookupType.CPUUsage, {
        context: 'namespace',
        contextChoice: 'default',
      })
    ).toBe(
      'rate (container_cpu_usage_seconds_total{mode!="idle",namespace="default"}[10m])'
    );
    expect(queryBuilder(LookupType.CPUUsage, { target: 'container' })).toBe(
      'sum (rate (container_cpu_usage_seconds_total{mode!="idle"}[10m])) by (container)'
    );
  });

  it('builds MemoryUsed queries', () => {
    expect(queryBuilder(LookupType.MemoryUsed, {})).toBe(
      'container_memory_working_set_bytes/ (1024*1024*1024)'
    );
    expect(
      queryBuilder(LookupType.MemoryUsed, {
        context: 'namespace',
        contextChoice: 'default',
      })
    ).toBe(
      'container_memory_working_set_bytes{namespace="default"}/ (1024*1024*1024)'
    );
    expect(queryBuilder(LookupType.MemoryUsed, { target: 'container' })).toBe(
      'sum (container_memory_working_set_bytes) by (container)/ (1024*1024*1024)'
    );
  });

  it('builds HPAByDeployment queries', () => {
    expect(queryBuilder(LookupType.HPAByDeployment, {})).toBe(
      'kube_horizontalpodautoscaler_metadata_generation'
    );
  });
});
