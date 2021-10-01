// ссылка на JSON с исходными данными 
const requetURL = 'https://raw.githubusercontent.com/talianmalian/infotecs_intership/master/data.json';
// Количество строк выводимых в таблицу на одной странице
const ROWS_ARE_SHOWN = 10;
// Переменная для хранения номера страницы 
let page = 0;
// Массив для входных данных
let d = [];
// Объект для хранения данных о изменившейся ячейке, number - порядковый номер объекта в массиве, key - поле для изменения
let objEdit = {
        number: 0,
        key: ''
    }
    // html-код для добавления SVG изображения глаза 
const eyeSvg = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 30 30;" xml:space="preserve" width="30" height="30"> <g>
<g>
    <path d="M508.177,245.995C503.607,240.897,393.682,121,256,121S8.394,240.897,3.823,245.995c-5.098,5.698-5.098,14.312,0,20.01
        C8.394,271.103,118.32,391,256,391s247.606-119.897,252.177-124.995C513.274,260.307,513.274,251.693,508.177,245.995z M256,361
        c-57.891,0-105-47.109-105-105s47.109-105,105-105s105,47.109,105,105S313.891,361,256,361z"/>
</g>
</g>
<g>
<g>
    <path id='pupil' fill='green' d="M271,226c0-15.09,7.491-28.365,18.887-36.53C279.661,184.235,268.255,181,256,181c-41.353,0-75,33.647-75,75
        c0,41.353,33.647,75,75,75c37.024,0,67.668-27.034,73.722-62.358C299.516,278.367,271,255.522,271,226z"/>
</g>
</g>

</svg>`;

// Получение данных и создание таблицы
fetch(requetURL)
    .then(response => response.json())
    .then(data => {
        createTable(saveData(data), ROWS_ARE_SHOWN);
        d = saveData(data);
        updateTable();
    });


function createTable(data, numberRows) {

    const table = document.querySelector('table');
    // Добавление обработчика события "click" для таблицы. При нажатии на ячейку таблицы, данные из нее копируются в поле для редактирования
    table.onclick = function(event) {
        //Получаем node в приделах таблицы, на которое было произведено нажатие
        let target = event.target;

        if (target.nodeName == 'TD') {
            let textarea = document.querySelector('textarea');

            objEdit.number = page * ROWS_ARE_SHOWN + Number(target.parentElement.getAttribute('id'));
            objEdit.key = target.getAttribute('data-key');
            textarea.value = d[objEdit.number][objEdit.key];

        }

    };
    // Создание строк таблицы 
    for (let i = 0; i < numberRows; i++) {
        createTr(data[0], table, 'td', i);
    }

}

//Функция для создания строк, принимает: 
// obj - объект по полям которого будут создаваться столбцы, 
// table -  таблица в которую будет добавлена строка,
// type - td|th,
// index - номер строки
function createTr(obj, table, type, index) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', index);
    tr.classList.add(`table_tr_${type}`);

    // Создание ячеек строки
    for (let i = 0; i < Object.keys(obj).length; i++) {

        const item = document.createElement(type);
        // Добавление атбирута data-key для ячеек строки соответственно полям выводимого объекта 
        item.setAttribute('data-key', `${Object.keys(obj)[i]}`);

        if (Object.keys(obj)[i] == "eyeColor") {
            item.innerHTML = eyeSvg;
        }
        tr.appendChild(item);
    }
    table.appendChild(tr)
}
// Функция для обработки входного массива данных. Сохраняем только необходимые поля объектов.
function saveData(response) {
    return response.map(item => ({
        firstName: item.name.firstName,
        lastName: item.name.lastName,
        about: item.about,
        eyeColor: item.eyeColor
    }))
}
// Функции для изменения страницы. Производится изменение глобальной переменной page и вызывается фукнкция updateTable дляобновления данных таблицы
function nextPage() {
    if (page < 4) {
        page++;
        document.getElementById('currentPage').innerHTML = page + 1;
        updateTable()
    }
}

function previousPage() {
    if (page > 0) {
        page--;
        document.getElementById('currentPage').innerHTML = page + 1;
        updateTable()
    }
}
// Функция для обновления данных в ячейках таблицы
function updateTable() {
    // Создаем массив данных для вывода на конкретной странице
    let data_to_show = d.slice(ROWS_ARE_SHOWN * page, ROWS_ARE_SHOWN * page + ROWS_ARE_SHOWN);
    // Получаем все строки и проходимся по каждой ячеке в строке
    let trs = document.querySelectorAll('.table_tr_td');
    trs.forEach((tr, i) => {
        tr.childNodes.forEach(td => {

            if (td.getAttribute('data-key') == 'eyeColor') {
                // Изменяем цвет зрачка в зависимости от данных в массиве объектов, по id находим необходимый path в svg и меняем цвет
                let svg = td.firstChild.getElementById('pupil');
                svg.setAttribute('fill', data_to_show[i][td.getAttribute('data-key')]);
            } else {

                td.innerHTML = data_to_show[i][td.getAttribute('data-key')];
            }

        })
    })
}
// Функция для скрытия столбцов
function hide(key) {
    document.querySelectorAll(`[data-key=${key}]`).forEach(item => item.classList.toggle('hide'));
}
// Функция для соктировки данных по столбцам
function sortData(param) {

    d.sort((prev, next) => {
        if (prev[param] < next[param]) return -1;
        if (prev[param] > next[param]) return 1;
    });
    updateTable();
}
// Функция обновления измененных данных 
function changeValue() {
    d[objEdit.number][objEdit.key] = document.querySelector('.edit_textarea').value;
    updateTable();

}