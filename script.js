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
var state = {active: 0, auth: null, loadedPages: 0}
const PAGE_SIZE = 3;
const TOTAL_ITEMS = 10;
const data = Array.from(Array(TOTAL_ITEMS)).map((v, i) => `Картинка ${i+1}`);  // БД для запросов
let renderData = []  // рез

var intersectionObserver = new IntersectionObserver(onObserve, {
  root: list,
  threshold: 0.6
})


async function lazyLoad() {
  const result = await fetchData(state.loadedPages, PAGE_SIZE).catch(console.log);
  
  console.log("fetched+3" + result)
  if (!result) console.log('No more')
   else render(result)
}

function onObserve(entries) {         
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
      activate(items.indexOf(entry.target));
      if (state.active == items.length-1) lazyLoad()
    }
  })
}

window.onload = () => lazyLoad()


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


const fetchData = (page, pageSize) => {
  let promise = new Promise(function(resolve, reject){

let cut = data.length - page
pageSize = cut > pageSize ? pageSize : cut

if (cut == 0) reject(new Error("Nothing more"))

  state.loadedPages += pageSize
  resolve(data.slice(page, page+pageSize)); 
}
  )
promise.catch(console.log);
  return promise;
}  


prev_btn.addEventListener('click', ()=> items[state.active-1]?.scrollIntoView())

next_btn.addEventListener('click', async ()=>  items[state.active+1]?.scrollIntoView())


function activate(itemNumber) {
  state.active = itemNumber;
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i == itemNumber)
  }) 
}

