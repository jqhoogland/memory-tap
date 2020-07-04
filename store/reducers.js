import {
  SELECT_JOURNEY,
  NEW_JOURNEY,
  UPDATE_JOURNEY_NAME,
  NEW_LOCUS,
  UPDATE_LOCUS,
} from "./actions";

const initialState = { selJourney: 0, journeys: [] };

export default function rootReducer(state = initialState, action) {
  let newJourneys = [...state.journeys];
  let selJourney = state.selJourney ? state.selJourney : 0;
  let journeyIndex = newJourneys.findIndex(
    (journey) => journey.id === selJourney
  );
  let journey =
    newJourneys.length !== 0 && journeyIndex >= 0
      ? newJourneys[journeyIndex]
      : null;

  console.log(
    state.journeys.length,
    newJourneys.length,
    selJourney,
    journeyIndex,
    journey
  );

  switch (action.type) {
    case SELECT_JOURNEY:
      return {
        selJourney: action.id,
        journeys: newJourneys,
      };
    case NEW_JOURNEY:
      return {
        selJourney: state.journeys.length,
        journeys: [
          ...state.journeys,
          { name: "New Journey", id: state.journeys.length, locations: [] },
        ],
      };

    case UPDATE_JOURNEY_NAME:
      console.log(newJourneys[journeyIndex]);
      journey.name = action.name;
      newJourneys[journeyIndex] = journey;
      console.log(newJourneys[journeyIndex]);

      return {
        selJourney,
        journeys: newJourneys,
      };

    case NEW_LOCUS:
      journey.locations.push({ name: action.name, location: action.location });
      newJourneys[journeyIndex] = journey;

      return {
        selJourney,
        journeys: newJourneys,
      };

    case UPDATE_LOCUS:
      console.log(newJourneys[journeyIndex]);
      journey.locations[action.index] = {
        name: action.name,
        location: action.location,
      };
      newJourneys[journeyIndex] = journey;

      return {
        selJourney,
        journeys: newJourneys,
      };
    default:
      return state;
  }
}
