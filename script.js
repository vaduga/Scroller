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
var state = {active: 0, auth: null, loadedPages: 2}
const PAGE_SIZE = 2;
const TOTAL_ITEMS = 10;
const data = Array.from(Array(TOTAL_ITEMS)).map((_, i) => `Картинка ${i+1}`);  // БД для запросов
let renderData = []  // рез

var intersectionObserver = new IntersectionObserver(onObserve, {
  root: list,
  threshold: 0.6
})

function onObserve(entries) {         
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) activate(items.indexOf(entry.target));
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


 
indicatorsRender = renderData.map(() => `<button class="indicator"></button>`)
var indicatorsList = document.querySelector('.indicatorsList')
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
      state.loadedPages+=2
      }, Math.random() * 1000 + 500  
  );
  
  return promise;
};




prev_btn.addEventListener('click', ()=> items[state.active-1]?.scrollIntoView())

next_btn.addEventListener('click', async ()=> { 



  items[state.active+1]?.scrollIntoView()
  if (state.active==items.length-1) {
    const result = await fetchData(state.loadedPages,PAGE_SIZE);
    console.log("fetched+2")
    console.log(result)
    render(result);
  }


  }

)

function activate(itemNumber) {
  state.active = itemNumber;
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i == itemNumber)
  }) 
}

