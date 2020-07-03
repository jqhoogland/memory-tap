import { NEW_JOURNEY } from "./actions";

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
    default:
      return state;
  }
}
