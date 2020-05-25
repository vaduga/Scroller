/*
Задачи: 
1. Ленивая подгрузка добавляет +2 картинки слишком поздно. Сделать пораньше (сразу когда становится активен последний индикатор и картинка)
2. Прятать кнопки next/prev чтобы не тыкали, пока подгружаются новые картинки.
3. Остановить запросы когда кончится база (TOTAL_ITEMS) . На данный момент скрипт подгружаеть пустые элементы списка, 
и делаются активными элементы, которых нет (порядок картинок путается).
3.1. Для этого настроить промис в функции fetchData . Добавить возможность невыполнения промиса (reject)

*/


var list = document.querySelector('.list')
var items
var indicators
var prev_btn = document.querySelector('.prev')
var next_btn = document.querySelector('.next')
var state = {active: 0, auth: null, loadedPages: 3, visibleIndicators: 2}
const PAGE_SIZE = 3;
const TOTAL_ITEMS = 10;
const data = Array.from(Array(TOTAL_ITEMS)).map((v, i) => `Картинка ${i+1}`);  // БД для запросов
let renderData = []  // рез

var intersectionObserver = new IntersectionObserver(onObserve, {
  root: list,
  threshold: 0.6
})


async function lazyLoad() {
  const result = await fetchData(state.loadedPages,PAGE_SIZE);
  console.log("fetched+3")
  console.log(result)
  render(result);
}

function onObserve(entries) {         
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
      if (state.active==items.length-2) 
      activate(items.indexOf(entry.target));
    }
  })
}

render(data.slice(0, state.loadedPages))   /* для начала покажем две картинки напрямую из базы (нехорошо!), а не с помощью функции fetchData, т.к. она асинхронная и запускается только с какого-нибудь обработчика событий (кнопки)  */



function render(someData){
 let loadData = renderData.concat(someData)
 renderData = loadData
 loadData = loadData.map((el)=> `<li class="item">${el}</li>`)
 console.log(loadData)
 list.innerHTML = loadData.join('')
items = Array.from(document.querySelectorAll(".item"))
 
let indicatorsRender = renderData.map(() => `<button class="indicator"></button>`)
let indicatorsList = document.querySelector('.indicatorsList')
indicatorsList.innerHTML = indicatorsRender.join('')


indicators = document.querySelectorAll(".indicator")
indicators.forEach((indicator, index) => {                      
indicator.onclick = () => { items[index].scrollIntoView() }
})

items.forEach((val) => intersectionObserver.observe(val))

}



const fetchData = async (page, pageSize) => {
  let resolve;
  const promise = new Promise(rs => (resolve = rs));

  setTimeout(
    () => {
      resolve(data.slice(page, page + pageSize));
      state.loadedPages+=3
      }, Math.random() * 1000 + 500  
  );
  
  return promise;
};



prev_btn.addEventListener('click', ()=> items[state.active-1]?.scrollIntoView())

next_btn.addEventListener('click', async ()=> { 

  items[state.active+1]?.scrollIntoView()
 


  }
)



function activate(itemNumber) {
  state.active = itemNumber;
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i == itemNumber)
  }) 
}

