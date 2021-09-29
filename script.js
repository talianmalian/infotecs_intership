const requetURL = 'https://raw.githubusercontent.com/talianmalian/infotecs_intership/master/data.json';
const ROWS_ARE_SHOWN = 10;
let page = 0;
let d = [];
let objEdit = {
    number: 0,
    key: ''
}

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

fetch(requetURL)
    .then(response => response.json())
    .then(data => {
        createTable(saveData(data), ROWS_ARE_SHOWN);
        d = saveData(data);
        updateTable();
    });

function createTable(data, numberRows) {

    const table = document.querySelector('table');

    table.onclick = function(event) {

        let target = event.target;

        if (target.nodeName == 'TD') {
            let textarea = document.querySelector('textarea');

            objEdit.number = page * ROWS_ARE_SHOWN + Number(target.parentElement.getAttribute('id'));
            objEdit.key = target.getAttribute('data-key');
            textarea.value = d[objEdit.number][objEdit.key];
            // console.log(Number(target.parentElement.getAttribute('id')))
        }

    };

    //createTr(data[0], table, 'th');
    for (let i = 0; i < numberRows; i++) {
        createTr(data[0], table, 'td', i);
    }

}


function createTr(obj, table, type, index) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', index);
    tr.classList.add(`table_tr_${type}`);
    for (let i = 0; i < Object.keys(obj).length; i++) {
        const item = document.createElement(type);
        item.setAttribute('data-key', `${Object.keys(obj)[i]}`);

        if (Object.keys(obj)[i] == "eyeColor") {
            item.innerHTML = eyeSvg;
        }
        tr.appendChild(item);
    }
    table.appendChild(tr)
}

function saveData(response) {
    return response.map(item => ({
        firstName: item.name.firstName,
        lastName: item.name.lastName,
        about: item.about,
        eyeColor: item.eyeColor
    }))
}

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

function updateTable() {

    let data_to_show = d.slice(ROWS_ARE_SHOWN * page, ROWS_ARE_SHOWN * page + ROWS_ARE_SHOWN);
    let trs = document.querySelectorAll('.table_tr_td');
    trs.forEach((tr, i) => {
        tr.childNodes.forEach(td => {
            if (td.getAttribute('data-key') == 'eyeColor') {
                let svg = td.firstChild.getElementById('pupil');
                svg.setAttribute('fill', data_to_show[i][td.getAttribute('data-key')]);
            } else {
                td.innerHTML = data_to_show[i][td.getAttribute('data-key')];
            }


        })
    })
}

function hide(key) {
    document.querySelectorAll(`[data-key=${key}]`).forEach(item => item.classList.toggle('hide'));
}

function sortData(param) {

    d.sort((prev, next) => {
        if (prev[param] < next[param]) return -1;
        if (prev[param] > next[param]) return 1;
    });
    updateTable();
}

function changeValue() {
    d[objEdit.number][objEdit.key] = document.querySelector('.edit_textarea').value;
    updateTable();

}