import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '../useCountdown';

// Mock Date and timers
const mockDate = new Date('2024-01-01T12:00:00.000Z');
const mockTargetDate = new Date('2024-01-01T13:30:45.000Z'); // 1 hour, 30 minutes, 45 seconds from mock date

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);
  
  // Mock console methods to avoid noise in tests
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('useCountdown', () => {
  describe('Initial State', () => {
    it('should return initial countdown values', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(1);
      expect(result.current.minutes).toBe(30);
      expect(result.current.seconds).toBe(45);
      expect(result.current.isExpired).toBe(false);
    });

    it('should handle target date in the past', () => {
      const pastDate = new Date('2023-12-31T12:00:00.000Z');
      const { result } = renderHook(() => useCountdown(pastDate));

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });

    it('should handle invalid date', () => {
      const { result } = renderHook(() => useCountdown(new Date('invalid')));

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });

    it('should handle null target date', () => {
      const { result } = renderHook(() => useCountdown(null));

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });
  });

  describe('Countdown Updates', () => {
    it('should update countdown every second', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      // Initial state
      expect(result.current.seconds).toBe(45);

      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.seconds).toBe(44);

      // Advance time by 5 more seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.seconds).toBe(39);
    });

    it('should handle minute rollover', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      // Initial state: 1:30:45
      expect(result.current.minutes).toBe(30);
      expect(result.current.seconds).toBe(45);

      // Advance time by 46 seconds (should roll over to next minute)
      act(() => {
        jest.advanceTimersByTime(46000);
      });

      expect(result.current.minutes).toBe(29);
      expect(result.current.seconds).toBe(59);
    });

    it('should handle hour rollover', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      // Initial state: 1:30:45
      expect(result.current.hours).toBe(1);
      expect(result.current.minutes).toBe(30);

      // Advance time by 31 minutes (should roll over to next hour)
      act(() => {
        jest.advanceTimersByTime(31 * 60 * 1000 + 45000);
      });

      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(59);
      expect(result.current.seconds).toBe(0);
    });

    it('should handle day rollover', () => {
      const futureDate = new Date('2024-01-02T14:30:45.000Z'); // More than 24 hours
      const { result } = renderHook(() => useCountdown(futureDate));

      // Should show 1 day, 2 hours, 30 minutes, 45 seconds
      expect(result.current.days).toBe(1);
      expect(result.current.hours).toBe(2);
      expect(result.current.minutes).toBe(30);
      expect(result.current.seconds).toBe(45);

      // Advance time by 25 hours
      act(() => {
        jest.advanceTimersByTime(25 * 60 * 60 * 1000);
      });

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(1);
    });
  });

  describe('Expiration Handling', () => {
    it('should set isExpired to true when countdown reaches zero', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      expect(result.current.isExpired).toBe(false);

      // Advance time to exactly the target date
      act(() => {
        jest.advanceTimersByTime(1 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000);
      });

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });

    it('should stop updating when expired', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      // Advance time past the target date
      act(() => {
        jest.advanceTimersByTime(2 * 60 * 60 * 1000); // 2 hours
      });

      expect(result.current.isExpired).toBe(true);
      expect(result.current.seconds).toBe(0);

      // Advance time further - should not change
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });
  });

  describe('Target Date Changes', () => {
    it('should update countdown when target date changes', () => {
      const { result, rerender } = renderHook(
        ({ targetDate }) => useCountdown(targetDate),
        { initialProps: { targetDate: mockTargetDate } }
      );

      expect(result.current.hours).toBe(1);
      expect(result.current.minutes).toBe(30);

      // Change target date to 2 hours from now
      const newTargetDate = new Date('2024-01-01T14:00:00.000Z');
      rerender({ targetDate: newTargetDate });

      expect(result.current.hours).toBe(2);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
    });

    it('should handle changing from valid to invalid date', () => {
      const { result, rerender } = renderHook(
        ({ targetDate }) => useCountdown(targetDate),
        { initialProps: { targetDate: mockTargetDate } }
      );

      expect(result.current.isExpired).toBe(false);

      // Change to invalid date
      rerender({ targetDate: new Date('invalid') });

      expect(result.current.days).toBe(0);
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
      expect(result.current.isExpired).toBe(true);
    });

    it('should handle changing from expired to valid date', () => {
      const pastDate = new Date('2023-12-31T12:00:00.000Z');
      const { result, rerender } = renderHook(
        ({ targetDate }) => useCountdown(targetDate),
        { initialProps: { targetDate: pastDate } }
      );

      expect(result.current.isExpired).toBe(true);

      // Change to future date
      rerender({ targetDate: mockTargetDate });

      expect(result.current.isExpired).toBe(false);
      expect(result.current.hours).toBe(1);
      expect(result.current.minutes).toBe(30);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large time differences', () => {
      const farFutureDate = new Date('2025-01-01T12:00:00.000Z'); // 1 year from mock date
      const { result } = renderHook(() => useCountdown(farFutureDate));

      expect(result.current.days).toBe(365); // Assuming non-leap year
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
    });

    it('should handle millisecond precision', () => {
      const preciseDate = new Date('2024-01-01T12:00:01.500Z'); // 1.5 seconds from mock date
      const { result } = renderHook(() => useCountdown(preciseDate));

      expect(result.current.seconds).toBe(1); // Should round down
    });

    it('should handle timezone differences', () => {
      // Create date in different timezone
      const timezoneDate = new Date(mockDate.getTime() + 60 * 60 * 1000); // 1 hour later
      const { result } = renderHook(() => useCountdown(timezoneDate));

      expect(result.current.hours).toBe(1);
      expect(result.current.minutes).toBe(0);
      expect(result.current.seconds).toBe(0);
    });
  });

  describe('Memory Management', () => {
    it('should cleanup interval on unmount', () => {
      const { unmount } = renderHook(() => useCountdown(mockTargetDate));

      // Spy on clearInterval
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should cleanup previous interval when target date changes', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      const { rerender } = renderHook(
        ({ targetDate }) => useCountdown(targetDate),
        { initialProps: { targetDate: mockTargetDate } }
      );

      const initialCallCount = clearIntervalSpy.mock.calls.length;

      // Change target date
      rerender({ targetDate: new Date('2024-01-01T14:00:00.000Z') });

      expect(clearIntervalSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useCountdown(mockTargetDate);
      });

      const initialRenderCount = renderCount;

      // Advance time by multiple seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Should have re-rendered 5 times (once per second)
      expect(renderCount).toBe(initialRenderCount + 5);
    });

    it('should handle rapid time changes efficiently', () => {
      const { result } = renderHook(() => useCountdown(mockTargetDate));

      // Rapidly advance time
      for (let i = 0; i < 10; i++) {
        act(() => {
          jest.advanceTimersByTime(1000);
        });
      }

      expect(result.current.seconds).toBe(35); // 45 - 10
    });
  });

  describe('Calculation Accuracy', () => {
    it('should calculate correct time units', () => {
      // Test with specific time differences
      const testCases = [
        {
          target: new Date('2024-01-01T12:00:01.000Z'),
          expected: { days: 0, hours: 0, minutes: 0, seconds: 1 }
        },
        {
          target: new Date('2024-01-01T12:01:00.000Z'),
          expected: { days: 0, hours: 0, minutes: 1, seconds: 0 }
        },
        {
          target: new Date('2024-01-01T13:00:00.000Z'),
          expected: { days: 0, hours: 1, minutes: 0, seconds: 0 }
        },
        {
          target: new Date('2024-01-02T12:00:00.000Z'),
          expected: { days: 1, hours: 0, minutes: 0, seconds: 0 }
        },
        {
          target: new Date('2024-01-03T14:25:30.000Z'),
          expected: { days: 2, hours: 2, minutes: 25, seconds: 30 }
        }
      ];

      testCases.forEach(({ target, expected }) => {
        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.days).toBe(expected.days);
        expect(result.current.hours).toBe(expected.hours);
        expect(result.current.minutes).toBe(expected.minutes);
        expect(result.current.seconds).toBe(expected.seconds);
      });
    });

    it('should handle leap year calculations', () => {
      // Set mock date to leap year
      const leapYearDate = new Date('2024-02-28T12:00:00.000Z');
      const nextDayDate = new Date('2024-02-29T12:00:00.000Z');
      
      jest.setSystemTime(leapYearDate);

      const { result } = renderHook(() => useCountdown(nextDayDate));

      expect(result.current.days).toBe(1);
      expect(result.current.hours).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle Date constructor errors', () => {
      // Mock Date constructor to throw
      const originalDate = global.Date;
      global.Date = jest.fn(() => {
        throw new Error('Date error');
      });

      expect(() => {
        renderHook(() => useCountdown(mockTargetDate));
      }).not.toThrow();

      global.Date = originalDate;
    });

    it('should handle setInterval errors', () => {
      // Mock setInterval to throw
      const originalSetInterval = global.setInterval;
      global.setInterval = jest.fn(() => {
        throw new Error('setInterval error');
      });

      expect(() => {
        renderHook(() => useCountdown(mockTargetDate));
      }).not.toThrow();

      global.setInterval = originalSetInterval;
    });
  });
});
