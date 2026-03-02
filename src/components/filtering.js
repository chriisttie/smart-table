import { createComparison, defaultRules } from "../lib/compare.js";

// Создаем базовый компаратор для обычных полей (дата, клиент, продавец)
// Мы исключим поля суммы из этого компаратора, чтобы он не путался
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

    // Нормализуем числа для фильтрации
    // Преобразуем строки "5000" в числа 5000, убираем пробелы
    const minTotal = state.totalFrom
      ? parseFloat(String(state.totalFrom).replace(/\s/g, ""))
      : null;
    const maxTotal = state.totalTo
      ? parseFloat(String(state.totalTo).replace(/\s/g, ""))
      : null;

    // Создаем объект состояния для обычного компаратора БЕЗ полей суммы
    // Чтобы compare не пытался искать totalFrom/totalTo в данных
    const { totalFrom, totalTo, ...restState } = state;

    return data.filter((row) => {
      // 1. Ручная проверка диапазона сумм
      // Парсим сумму из строки данных (например, "4 657.56" -> 4657.56)
      const rowTotal =
        typeof row.total === "string"
          ? parseFloat(row.total.replace(/\s/g, ""))
          : row.total;

      if (minTotal !== null && rowTotal < minTotal) {
        return false; // Отсекаем, если меньше минимума
      }
      if (maxTotal !== null && rowTotal > maxTotal) {
        return false; // Отсекаем, если больше максимума
      }

      // 2. Обычная фильтрация по остальным полям (дата, клиент, продавец)
      // Используем restState, где нет totalFrom/totalTo
      return baseCompare(row, restState);
    });
  };
}
