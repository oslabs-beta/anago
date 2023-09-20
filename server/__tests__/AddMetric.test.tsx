import {
  timeConverter,
  timeToString,
} from '../../Components/Dashboard/AddMetric';
import { describe, expect, it } from 'vitest';

describe('AddMetric.timeConverter', () => {
  it('returns undefined with no units', () => {
    expect(timeConverter('14')).toBeUndefined;
  });
  it('returns undefined with unclear units', () => {
    expect(timeConverter('4 blankets')).toBeUndefined;
  });
  it('converts units as expected', () => {
    expect(timeConverter('4 secs')).toBe(4);
    expect(timeConverter('500s')).toBe(500);
    expect(timeConverter('3 days')).toBe(259200);
    expect(timeConverter('1week')).toBe(604800);
    expect(timeConverter('3fortnights')).toBe(3628800);
    expect(timeConverter('2y')).toBe(63072000);
  });
});

describe('AddMetric.timeToString', () => {
  it('returns seconds parsed into appropriate units', () => {
    expect(timeToString(10)).toBe('10 seconds.');
    expect(timeToString(300)).toBe('5 minutes.');
    expect(timeToString(604800)).toBe('7 days.');
    expect(timeToString(3628800)).toBe('6 weeks.');
    expect(timeToString(823483)).toBe('9.5 days.');
    expect(timeToString(525600 * 60)).toBe('12.2 months.');
    expect(timeToString(999888777)).toBe('31.7 years.');
  });
});
