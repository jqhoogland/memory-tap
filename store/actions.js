export const NEW_JOURNEY = "NEW_JOURNEY";
export const UPDATE_JOURNEY_NAME = "UPDATE_JOURNEY_NAME";
export const NEW_LOCUS = "NEW_LOCUS";
export const UPDATE_LOCUS = "UPDATE_LOCUS";

export const newJourney = () => ({ type: NEW_JOURNEY });
export const updateJourneyName = (name, id) => ({
  type: UPDATE_JOURNEY_NAME,
  name,
  id,
});
