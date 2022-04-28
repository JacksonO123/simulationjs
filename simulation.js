let fps;
let bgColor;

class CompatableSimulationObject {
	constructor() {}
}

class Simulation {
	/**
	 * @param {string} id - id of the canvas element
	 * @param {number} fps - frames per second
	 * @param {number} width - width of the Simulation
	 * @param {number} height - height of the Simulation
	 */
	constructor(id, _fps, width = 500, height = 500) {
		this.canvas = get(id);
		this.ctx = this.canvas.getContext('2d');
		this.width = width;
		this.height = height;
		fps = _fps;
		this.scene = [];
		bgColor = new Color(255, 255, 255);
		this.render();
	}
	fitWindow() {
		addEventListener('resize', () => this.resizeCanvas(this));
		this.resizeCanvas(this);
	}
	minimize(width = 500, height = 500) {
		removeEventListener('resize', () => this.resizeCanvas(this));
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
	}
	resizeCanvas(globalContext) {
		globalContext.canvas.width = window.innerWidth;
		globalContext.width = window.innerWidth;
		globalContext.canvas.height = window.innerHeight;
		globalContext.height = window.innerHeight;
		console.log(globalContext.width, globalContext.height);
		globalContext.ctx.clearRect(0, 0, globalContext.width, globalContext.height);
	}
	add(element) {
		if (element instanceof CompatableSimulationObject) {
			this.scene.push(element);
		} else {
			console.error('incompatable simulation object', element);
		}
	}
	addBehind(element) {
		if (element instanceof CompatableSimulationObject) {
			this.scene.unshift(element);
		} else {
			console.error('incompatable simulation object', element);
		}
	}
	render() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.beginPath();
		this.ctx.fillStyle = colorObjectToString(bgColor);
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.closePath();
		for (const element of this.scene) {
			element.draw(this.ctx);
		}
		setTimeout(() => {
			this.render();
		}, 1000 / fps);
	}
	/**
	 * @param {Color} color - background color in hexidecimal
	 */
	setBackground(color) {
		if (color instanceof Color) {
			bgColor = color;
		} else {
			bgColor = hexToColorObject(color);
		}
	}
	on(event, callback) {
		this.canvas.addEventListener(event, callback);
	}
}

class Circle extends CompatableSimulationObject {
	/**
	 * @param {number} x - x position
	 * @param {number} y - y position
	 * @param {number} radius - circle radius
	 * @param {Color} color - color of circle
	 */
	constructor(x, y, radius, color = new Color(0, 0, 0)) {
		super();
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.expanding = false;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
	/**
	 * @param {number} t - time in seconds
	 * @param {Color} color - color to translate to
	 */
	fill(color, t = 0) {
		if (t == 0) {
			this.color = color;
			return;
		}
		return new Promise((resolve, reject) => {
			const rgbStart = this.color;
			const rgbFinal = color;
			let currentColor = rgbStart;//new Color(rgbStart.r, rgbStart.g, rgbStart.b);
			if (!rgbFinal) {
				console.error(`Invalid color: ${color}`);
				return this;
			}
			const animationStartTime = Date.now();
			const globalContext = this;
			const rChange = (rgbFinal.r - rgbStart.r) / (t * fps);
			const gChange = (rgbFinal.g - rgbStart.g) / (t * fps);
			const bChange = (rgbFinal.b - rgbStart.b) / (t * fps);
			function fillLoop() {
				globalContext.color.r = currentColor.r;
				globalContext.color.g = currentColor.g;
				globalContext.color.b = currentColor.b;
				currentColor.r += rChange;
				currentColor.g += gChange;
				currentColor.b += bChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						fillLoop();
					} else {
						resolve(globalContext);
					}
				}, 1000 / fps);
			}
			fillLoop();
		});
	}
	empty(t = 0) {
		return this.fill('#ffffff', t);
	}
	/**
	 * 
	 * @param {number} t - time in seconds
	 * @param {number} x - relative x position
	 * @param {number} y - relative y position
	 */
	move(x, y, t = 0) {
		if (t == 0) {
			this.x += x;
			this.y += y;
			return;
		}
		return new Promise((resolve, reject) => {
			const animationStartTime = Date.now();
			const xChange = x / (t * fps);
			const yChange = y / (t * fps);
			const globalContext = this;
			function moveLoop() {
				globalContext.x += xChange;
				globalContext.y += yChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						moveLoop();
					} else {
						resolve(globalContext);
					}
				}, 1000 / fps);
			}
			moveLoop();
		});
	}
	moveTo(x, y, center = false, t = 0) {
		if (t == 0) {
			this.x = (x - this.x + (center ? 0 : this.radius));
			this.x = (y - this.y + (center ? 0 : this.radius));
			return;
		}
		return new Promise((resolve, reject) => {
			const animationStartTime = Date.now();
			const xChange = (x - this.x + (center ? 0 : this.radius)) / (t * fps);
			const yChange = (y - this.y + (center ? 0 : this.radius)) / (t * fps);
			const globalContext = this;
			function moveLoop() {
				globalContext.x += xChange;
				globalContext.y += yChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						moveLoop();
					} else {
						resolve(globalContext);
					}
				}, 1000 / fps);
			}
			moveLoop();
		})
	}
	expand(scale, t = 0) {
		if (t == 0) {
			this.radius *= scale;
			return;
		}
		return new Promise((resolve, reject) => {
			scale = scale / 2;
			const animationStartTime = Date.now();
			const scaleChange = scale / (t * fps);
			const globalContext = this;
			function expandLoop() {
				globalContext.expanding = true;
				globalContext.radius *= (scaleChange + 1);
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						expandLoop();
					} else {
						globalContext.expanding = false;
						resolve(globalContext);
					}
				}, 1000 / fps);
			}
			if (!this.expanding) expandLoop();
		})
	}
	expandTo(radius, t = 0) {
		if (t == 0) {
			this.radius = radius;
			return;
		}
		return new Promise((resolve, reject) => {
			const animationStartTime = Date.now();
			const radiusChange = (radius - this.radius) / (t * fps);
			const globalContext = this;
			function expandLoop() {
				globalContext.expanding = true;
				globalContext.radius += radiusChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						expandLoop();
					} else {
						globalContext.expanding = false;
						resolve(globalContext);
					}
				}, 1000 / fps);
			}
			if (!this.expanding) expandLoop();
		});
	}
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
}

class Color {
	constructor(r = 0, g = 0, b = 0) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

const get = (id) => {
	return document.getElementById(id);
}

const hexToColorObject = (hex) => {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return new Color(
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		);
	} else {
		console.error('Invalid hex color');
		return null;
	}
}

const colorObjectToString = (obj) => {
	if ([obj.r, obj.g, obj.b].includes(undefined)) {
		console.error('Invalid color object');
		return;
	}
	return `rgb(${obj.r}, ${obj.g}, ${obj.b})`;
}

const random = (range, scale = 1) => {
	return Math.floor(Math.random() * range) * scale;
}