export const SELECT_JOURNEY = "SELECT_JOURNEY";

export const NEW_JOURNEY = "NEW_JOURNEY";
export const UPDATE_JOURNEY_NAME = "UPDATE_JOURNEY_NAME";

export const SET_LOCI = "SET_LOCI";

export const selectJourney = (id) => ({ type: SELECT_JOURNEY, id });
export const newJourney = () => ({ type: NEW_JOURNEY });
export const updateJourneyName = (name) => ({
  type: UPDATE_JOURNEY_NAME,
  name,
});

export const setLoci = (loci) => ({
  type: SET_LOCI,
  loci,
});
