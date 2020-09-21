import { useEffect, useRef, useState } from "react";
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
