var items = Array.from(document.querySelectorAll(".item"))
var indicators = document.querySelectorAll(".indicator")
var list = document.querySelector('.list')
var prev_btn = document.querySelector('.prev')
var next_btn = document.querySelector('.next')
var state = {active: 0, auth: null}
var intersectionObserver = new IntersectionObserver(onObserve, {
  root: list,
  threshold: 0.6
})

function onObserve(entries) {         
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.4) activate(items.indexOf(entry.target));
  })
}

prev_btn.addEventListener('click', ()=> items[state.active-1]?.scrollIntoView({behavior: "smooth"}))
next_btn.addEventListener('click', ()=> items[state.active+1]?.scrollIntoView({behavior: "smooth"}))

function activate(itemNumber) {
  state.active = itemNumber;
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle("active", i == itemNumber)
  }) 
}

indicators.forEach((indicator, index) => {                      
  indicator.onclick = () => { items[index].scrollIntoView({behavior: "smooth"}) }
})

items.forEach((val) => intersectionObserver.observe(val))