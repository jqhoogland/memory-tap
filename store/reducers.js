import { NEW_JOURNEY, UPDATE_JOURNEY_NAME } from "./actions";

const initialState = { journeys: [] };

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_JOURNEY:
      return {
        journeys: [
          ...state.journeys,
          { name: "New Journey", id: state.journeys.length, locations: [] },
        ],
      };
    case UPDATE_JOURNEY_NAME:
      let newJourneys = [...state.journeys];
      let journey = newJourneys.find((journey) => journey.id === action.id);
      journey.name = action.name;

      return {
        journeys: newJourneys,
      };

    default:
      return state;
  }
}
