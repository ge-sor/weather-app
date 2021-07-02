import { ADD_ITEM, REMOVE_ITEM } from "../constants/action-types";

export const addItem = (newCard) => {
  return { type: ADD_ITEM, payload: newCard };
};

export const removeItem = (cardId) => {
  return { type: REMOVE_ITEM, payload: { id: cardId } };
};
