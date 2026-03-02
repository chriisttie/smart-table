import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  return (data, state, action) => {
    const query = state[searchField];

    // Если запрос пустой, возвращаем все данные
    if (!query || query.trim() === "") {
      return data;
    }

    // ПРАВИЛЬНОЕ СОЗДАНИЕ КОМПАРАТОРА:
    // 1 аргумент: Массив имен стандартных правил (только названия)
    // 2 аргумент: Массив кастомных функций-правил (результат вызова rules...)
    const compare = createComparison(
      ["skipEmptyTargetValues"], // Имена правил из defaultRules
      [
        // Кастомное правило поиска
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
