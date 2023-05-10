const url = 'https://api.exchangerate.host/latest';

let currentCurr = 'RUB', exchangeCurr = 'USD';
let currVal = 1;

const inpLeft = document.querySelector('.input1');
const inpRight = document.querySelector('.input2');

const currLeft = document.querySelector('.change1');
const currRight = document.querySelector('.change2');

const btnsLeft = document.querySelector('.div4').children;
for(let i=0; i<btnsLeft.length; i++) {
    btnsLeft[i].addEventListener('click', changeCurrentCurrency);
}

const btnsRight = document.querySelector('.div10').children;
for(let i=0; i<btnsRight.length; i++) {
    btnsRight[i].addEventListener('click', changeExchangeCurrency);
}

async function loadCurrency(a, b) {
    if(a === b) return 1;
    const query = `?base=${a}&symbols=${b}`;
    const res = await fetch(url + query);
    const data = await res.json();
    return data.rates[b];
}

function getData(c, e, l, r) {
    loadCurrency(c, e)
    .then(data => {
        currVal = data.toFixed(4);
        const val = parseFloat(l.value);
        r.value = (val * currVal).toFixed(4);
        currLeft.innerText = `1 ${c} = ${currVal} ${e}`;
        const excVal = (1/currVal).toFixed(4);
        currRight.innerText = `1 ${e} = ${excVal} ${c}`;
    })
    .catch(e => alert('Network error: error while getting data'));
}

function changeCurrentCurrency(e) {
    const btn = e.target;
    for(let i=0; i<btnsLeft.length; i++) {
        btnsLeft[i].classList.remove('btn-active');
    }
    btn.classList.add('btn-active');
    currentCurr = btn.innerText.toUpperCase();
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
}

function changeExchangeCurrency(e) {
    const btn = e.target;
    for(let i=0; i<btnsRight.length; i++) {
        btnsRight[i].classList.remove('btn-active');
    }
    btn.classList.add('btn-active');
    exchangeCurr = btn.innerText.toUpperCase();
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
}

inpLeft.addEventListener('input', (e) => {
    if(e.target.value === '') {
        e.target.value = 0;
    }
    e.target.value = e.target.value.replaceAll(',', '.');
    getData(currentCurr, exchangeCurr, inpLeft, inpRight);
});

inpRight.addEventListener('input', (e) => {
    if(e.target.value === '') {
        e.target.value = 0;
    }
    e.target.value = e.target.value.replaceAll(',', '.');
    getData(exchangeCurr, currentCurr, inpRight, inpLeft);
});

inpLeft.addEventListener('keydown', acceptNumber);
inpRight.addEventListener('keydown', acceptNumber);

function acceptNumber(e) {
    if( !( (e.key === 'Backspace') || (e.key === 'Delete') || 
    (('0' <= e.key) && (e.key <= '9')) ||
    (e.key === '.') || (e.key === ',') ) ) {
        e.preventDefault();
    }
    if((e.key === '.') || (e.key === ',')) {
        if(e.target.value.indexOf('.') >= 0) {
            e.preventDefault();
        }
    }
}

getData(currentCurr, exchangeCurr, inpLeft, inpRight);
