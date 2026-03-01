import { cloneTemplate } from "../lib/utils.js";

/**
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2
  // Обработка массива before (в обратном порядке, так как используем prepend)
  if (before) {
    // Создаем копию массива перед реверсом, чтобы не мутировать исходные настройки
    [...before].reverse().forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      // Вставляем ДО таблицы. Так как мы перебираем в обратном порядке,
      // первый элемент reversed массива встанет самым последним из "before",
      // а последний самым первым, что восстановит правильный визуальный порядок.
      root.container.prepend(root[subName].container);
    });
  }

  // Обработка массива after (в прямом порядке, используем append)
  if (after) {
    after.forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      // Вставляем после таблицы
      root.container.append(root[subName].container);
    });
  }

  // @todo: #1.3

  // Событие change срабатывает при изменении любого поля формы
  root.container.addEventListener("change", () => {
    onAction(); // Вызываем без аргументов
  });

  // Событие reset: срабатывает при сбросе формы
  root.container.addEventListener("reset", () => {
    // Отложенный вызов, чтобы дать браузеру время очистить поля перед генерацией действия
    setTimeout(onAction);
  });

  // Событие submit: срабатывает при отправке формы
  root.container.addEventListener("submit", (evt) => {
    evt.preventDefault(); // Предотвращаем стандартную перезагрузку страницы
    // Передаем кнопку/элемент, который инициировал отправку если есть
    onAction(evt.submitter);
  });

  const render = (data) => {
    // @todo: #1.1
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
