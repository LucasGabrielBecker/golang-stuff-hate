import { createStore } from "solid-js/store";

interface Store {
  showingCommentsForBookIds: number[] | [];
}
const initialValue: Store = {
  showingCommentsForBookIds: [],
};
export const useCommentsStore = () => {
  const [store, setStore] = createStore(initialValue);
  return {
    store,
    setStore,
  };
};
