import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  return (data, state, action) => {
    const query = state[searchField];

    if (!query || query.trim() === "") {
      return data;
    }

    const compare = createComparison(
      ["skipEmptyTargetValues"],
      [
        rules.searchMultipleFields(
          searchField,
          ["date", "customer", "seller"],
          false,
        ),
      ],
    );

    return data.filter((row) => compare(row, state));
  };
}
