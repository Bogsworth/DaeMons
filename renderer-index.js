const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

//const func = async () => {
async function func() {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
}


// const foo = async () => {
//     let btn = document.getElementsByName('startGame')[0]
//     btn.addEventListener('click', window.versions.start)
//     //btn.onclick = window.versions.start()
// }

// // I do not understand how to get it to load battle.html
// const bar = async () => {
//     //const newHTML = await window.versions.start()
//     console.log('newHTML')
//     //window.loadFile('battle.html')
// }

func()

let btn = document.getElementsByName('startGame')[0]
//btn.addEventListener('click', bar)

//foo()

