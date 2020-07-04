function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const getActiveJourney = (journeys, journeyId) => {
  const journeyIndex = journeys.findIndex(
    (journey) => journey.id === journeyId
  );

  if (journeyIndex >= journeyId) {
    return journeys[journeyIndex];
  } else {
    return journeys[journeys.length - 1];
  }
};
