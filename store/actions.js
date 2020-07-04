export const SELECT_JOURNEY = "SELECT_JOURNEY";

export const NEW_JOURNEY = "NEW_JOURNEY";
export const UPDATE_JOURNEY_NAME = "UPDATE_JOURNEY_NAME";

export const NEW_LOCUS = "NEW_LOCUS";
export const UPDATE_LOCUS = "UPDATE_LOCUS";

export const selectJourney = (id) => ({ type: SELECT_JOURNEY, id });
export const newJourney = () => ({ type: NEW_JOURNEY });
export const updateJourneyName = (name) => ({
  type: UPDATE_JOURNEY_NAME,
  name,
});

export const newLocus = ({ name, location }) => ({
  type: NEW_LOCUS,
  name,
  location,
});

export const updateLocus = (index, { name, location }) => ({
  type: UPDATE_LOCUS,
  index,
  name,
  location,
});
