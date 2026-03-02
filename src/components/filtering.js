import { createComparison, defaultRules } from "../lib/compare.js";

const baseCompare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    if (elements[elementName]) {
      const options = Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      });
      elements[elementName].append(...options);
    }
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const parent = action.closest("label") || action.parentElement;
      if (parent) {
        const input = parent.querySelector("input");
        if (input) {
          input.value = "";
          const fieldName = action.dataset.field;
          if (fieldName && state[fieldName]) {
            state[fieldName] = "";
          }
        }
      }
    }

    const minTotal = state.totalFrom
      ? parseFloat(String(state.totalFrom).replace(/\s/g, ""))
      : null;
    const maxTotal = state.totalTo
      ? parseFloat(String(state.totalTo).replace(/\s/g, ""))
      : null;

    const { totalFrom, totalTo, ...restState } = state;

    return data.filter((row) => {
      const rowTotal =
        typeof row.total === "string"
          ? parseFloat(row.total.replace(/\s/g, ""))
          : row.total;

      if (minTotal !== null && rowTotal < minTotal) {
        return false;
      }
      if (maxTotal !== null && rowTotal > maxTotal) {
        return false;
      }

      return baseCompare(row, restState);
    });
  };
}
