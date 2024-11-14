import { html, render, sig, mem } from "../solid_monke/solid_monke.js"
let italic = sig(300)
let fontSize = sig(150)
let text = sig("pharmakon")
// let text = sig("interace")
let mouse_x = sig(0)
let mouse_y = sig(0)
let time = sig(0)

setInterval(() => {
	time.set(time() + .03)
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
	let other = `

	transform: rotateZ(${(italic * -1) / 5}deg) translateY(${italic / 4}px);
	transform:  translateY(${italic / 4}px);
	opacity: ${(Math.abs(italic) / 300)};
`

	return `font-size: ${fontSize()}px; font-variation-settings: "wght" 300, "ital" ${italic};
	color: rgb(210,210,255);
	filter: blur(${Math.abs(italic) / 300 * 5}px);
	opacity: ${1 - (Math.abs(italic) / 300 * -1) + .2};
	`
}


let letter = (letter, index) => {
	if ("function" == typeof index) { index = (index() + 1) }
	else { index = (index + 1) }
	let ital = sig(index)
	let css = mem(() => css_by_italic(ital))

	setInterval(() => {
		ital.set(Math.sin(time() * index / 8) * 300)
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
flex-wrap: wrap;
`
	return html`
div[style=${main_css}]
	div[style=display:flex;flex-wrap:wrap;]
		each of ${letters} as ${letter} `
}


render(page, document.body)
