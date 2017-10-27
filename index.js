// import 'babel-polyfill'

const p = new Promise((a, b) => {
    a(3333)
})

p.then((a) => {
    console.log(444, a)
})

var a = ['a', 'b', 'c']
var iterator = a.entries()

for (let e of iterator) {
  console.log(e);
}
