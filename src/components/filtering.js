import { createComparison, defaultRules, rules } from "../lib/compare.js";

const filteringRules = {
  ...defaultRules,
};

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

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

    if (state.totalFrom)
      state.totalFrom = Number(state.totalFrom.replace(/\s/g, ""));
    if (state.totalTo) state.totalTo = Number(state.totalTo.replace(/\s/g, ""));

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => {
      if (row.total && typeof row.total === "string") {
        row.total = parseFloat(row.total.replace(/\s/g, ""));
      }
      return compare(row, state);
    });
  };
}
