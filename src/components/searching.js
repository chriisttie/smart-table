import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор

  return (data, state, action) => {
    const query = state[searchField];
    if (!query || query.trim() === "") {
      // @todo: #5.2 — применить компаратор
      return data;
    }

    const compare = createComparison({
      skipEmptyTargetValues: true,

      searchMultipleFields: rules.searchMultipleFields(
        fieldName,
        ["date", "customer", "seller"],
        false,
      ),
    });

    return data.filter((row) => compare(row, state));
  };
}
