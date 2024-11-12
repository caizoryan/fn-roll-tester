
import { html, render, sig, mem } from "./solid_monke/solid_monke.js"
let italic = sig(300)
let fontSize = sig(259)
let text = sig("interaction")
// let text = sig("interace")
let mouse_x = sig(0)
let mouse_y = sig(0)
let val = sig(0)

setInterval(() => {
	val.set(val() + .01)
}, 10)

document.addEventListener("keydown", (e) => {
	let available_letters = "abcdefghijklmnopqrstuvwxyz ".split("")
	if (available_letters.includes(e.key)) {
		text.set(text() + e.key)
	}
	else if (e.key == "Backspace") {
		text.set(text().slice(0, -1))
	}
})

document.addEventListener("mousemove", (e) => {
	// TODO: remove .set on sigs. if arg passed, sig sets and returns, else returns value:w
	//
	// mouse_x.set(e.clientX)
	// mouse_y.set(e.clientY)

	italic.set(300 - ((mouse_y() / window.innerHeight) * 600))
	// fontSize.set(300 - (mouse_x() / window.innerWidth * 300))
})

let css_by_index = (index) => {
	if ("function" == typeof index) { index = index() }
	let _fontSize = fontSize()
	let italic = 300 - (index * 5)

	return `font-size: ${_fontSize}px; font-variation-settings: "wght" 300, "ital" ${italic};`
}

let css_by_italic = (italic) => {
	if ("function" == typeof italic) { italic = italic() }
	return `font-size: ${fontSize()}px; font-variation-settings: "wght" 300, "ital" ${italic};
	transform: rotateZ(${(italic * -1) / 5}deg) translateY(${italic / 4}px);
	transform:  translateY(${italic / 4}px);
	transform:  translateX(${italic / 4}px);

	border: 1px dotted rgba(255,255,255,.4);
opacity: ${1 - ((Math.abs(italic) / 300))};
border-radius: 100px;
	`
}


let letter = (letter, i) => {
	if ("function" == typeof i) { i = (i() + 1) }
	else { i = (i + 1) }
	let ital = sig(i)
	let css = mem(() => css_by_italic(ital))

	setInterval(() => {
		ital.set(Math.sin(val() + i) * 300)
	}, 10)

	return html`div[style = ${css}]--${letter} `
}
let page = () => {
	let letters = mem(() => text().split(""))
	let main_css = `
width: 100vw;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
`
	return html`
div[style=${main_css}]
	div[style =display:flex;]
		each of ${letters} as ${letter} `
}


render(page, document.body)
