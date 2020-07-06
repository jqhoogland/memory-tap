import {
  SELECT_JOURNEY,
  NEW_JOURNEY,
  UPDATE_JOURNEY_NAME,
  SET_LOCI,
  DELETE_JOURNEY,
} from "./actions";

import { uuidv4 } from "../utils";

const initialState = { selJourney: 0, journeys: [] };
const blankLocus = { name: "", id: 0, coords: null };

export default function rootReducer(state = initialState, action) {
  let newJourneys = [...state.journeys];
  let selJourney = state.selJourney ? state.selJourney : null;
  let journeyIndex = newJourneys.findIndex(
    (journey) => journey.id === selJourney
  );
  let journey;

  if (newJourneys.length !== 0) {
    if (journeyIndex && journeyIndex >= 0) {
      journey = newJourneys[journeyIndex];
    } else {
      selJourney = newJourneys[0].id;
      journeyIndex = 0;
      journey = newJourneys[0];
    }
  }

  console.log("Reducing", action, state);

  //return initialState;

  switch (action.type) {
    case SELECT_JOURNEY:
      return {
        selJourney: action.id,
        journeys: newJourneys,
      };
    case NEW_JOURNEY:
      const id = uuidv4();
      return {
        selJourney: id,
        journeys: [
          ...state.journeys,
          {
            name: "New Journey",
            id,
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

    case DELETE_JOURNEY:
      if (state.selJourney) {
        newJourneys.splice(journeyIndex, 1);
      }

      return {
        selJourney:
          newJourneys.length > 0 ? newJourneys[newJourneys.length - 1].id : 0,
        journeys: newJourneys,
      };

    default:
      return state;
  }
}
