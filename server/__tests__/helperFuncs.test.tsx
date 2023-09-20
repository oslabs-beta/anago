import { cleanTime } from '../controllers/helperFuncs';
import { describe, expect, it } from 'vitest';

describe('helperFuncs.cleanTime', () => {
  it('converts units as expected', () => {
    expect(
      cleanTime(new Date('2023-07-22T16:59:47'), { duration: '2000000' })
    ).toBe('7/22/2023');
    expect(cleanTime(new Date('2023-07-22T16:59:47'), { duration: '2' })).toBe(
      '4:59 PM'
    );
    expect(
      cleanTime(new Date('2023-07-22T16:59:47'), { duration: '100000' })
    ).toBe('7/22:  4:59 PM');
  });
});
