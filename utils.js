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
  console.log(
    journeyId,
    journeys.map((journeys) => journeys.id)
  );
  const journeyIndex = journeys.findIndex(
    (journey) => journey.id === journeyId
  );
  if (journeyIndex < 0) {
    console.log("could not find", journeys, journeyId);
    return { name: "New Journey", id: "", loci: [] };
  }

  return { ...journeys[journeyIndex] }; // Return a copy otherwise react elements won't recognize it as changed
};

export const uuidv4 = () =>
  // Source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
