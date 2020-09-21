import { useEffect, useRef, useState, useCallback } from "react";
import moment from "moment";
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (...args) => savedCallback.current(...args);
    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
// a cute little hook for all async tasks with status
export const useAsync = (asyncTask, immediate = true) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const execute = useCallback(() => {
    setLoading(true);
    setError(null);
    setData(null);
    asyncTask()
      .then((result) => {
        console.log("solved");
        setData(result);
      })
      .catch((err) => {
        console.log("errored");
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [asyncTask]);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, error, data, loading };
};
export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
};
export const useCountdown = (
  countdownStartTime,
  countdownEndTime = moment().utc().format("x")
) => {
  const getDuration = (startTime, currentTime) => {
    const diffTime = currentTime - startTime;
    return moment.duration(diffTime);
  };
  const initialDuration = getDuration(countdownStartTime, countdownEndTime);
  const [countdown, setCountdown] = useState({
    d: initialDuration.days(),
    h: initialDuration.hours(),
    m: initialDuration.minutes(),
    s: initialDuration.seconds(),
    ts: initialDuration.asSeconds(),
  });
  useInterval(() => {
    const duration = getDuration(countdownStartTime, countdownEndTime);
    setCountdown({
      d: duration.days(),
      h: duration.hours(),
      m: duration.minutes(),
      s: duration.seconds(),
      ts: duration.asSeconds(),
    });
  }, 1000);
  return countdown;
};
