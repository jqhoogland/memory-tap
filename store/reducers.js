import {
  SELECT_JOURNEY,
  NEW_JOURNEY,
  UPDATE_JOURNEY_NAME,
  SET_LOCI,
} from "./actions";

const initialState = { selJourney: 0, journeys: [] };
const blankLocus = { name: "", id: 0, coords: null };

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

  console.log("Reducing", action, state);

  //return initialState;
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
          {
            name: "New Journey",
            id: state.journeys.length,
            loci: [blankLocus],
          },
        ],
      };

    case UPDATE_JOURNEY_NAME:
      journey.name = action.name;
      newJourneys[journeyIndex] = journey;

      return {
        selJourney,
        journeys: newJourneys,
      };

    case SET_LOCI:
      journey.loci = action.loci ? action.loci : [];
      newJourneys[journeyIndex] = journey;

      return {
        selJourney,
        journeys: newJourneys,
      };

    default:
      return state;
  }
}
