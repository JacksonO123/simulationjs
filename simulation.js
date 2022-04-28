let fps;
let bgColor;

class Simulation {
	/**
	 * @param {string} id - id of the canvas element
	 * @param {Number} fps - frames per second
	 * @param {Number} width - width of the Simulation
	 * @param {Number} height - height of the Simulation
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
	/**
	 * 
	 * @param {Number} width - width of the Simulation
	 * @param {Number} height - height of the Simulation
	 */
	minimize(width = 500, height = 500) {
		removeEventListener('resize', () => this.resizeCanvas(this));
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
	}
	/**
	 * 
	 * @param {Simulation} g - simulation to resize
	 */
	resizeCanvas(c) {
		c.canvas.width = window.innerWidth;
		c.width = window.innerWidth;
		c.canvas.height = window.innerHeight;
		c.height = window.innerHeight;
		c.ctx.clearRect(0, 0, c.width, c.height);
	}
	/**
	 * 
	 * @param {CompatableSimulationObject} element
	 */
	add(element) {
		if (element instanceof CompatableSimulationObject) {
			this.scene.unshift(element);
		} else {
			console.error('incompatable simulation object', element);
		}
	}
	/**
	 * 
	 * @param {CompatableSimulationObject} element
	 */
	addBehind(element) {
		if (element instanceof CompatableSimulationObject) {
			this.scene.push(element);
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
	 * @param {Color} color
	 */
	setBackground(color) {
		if (typeof color == 'string') {
			if (color.length == 4) {
				color = color + color.substring(1);
			}
		}
		if (color instanceof Color) {
			bgColor = color;
		} else {
			bgColor = hexToColorObject(color);
		}
	}
	/**
	 * 
	 * @param {String} event
	 * @param {Function} callback
	 */
	on(event, callback) {
		this.canvas.addEventListener(event, callback);
	}
}

class CompatableSimulationObject {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
	/**
	 * @param {Number} t - time
	 * @param {Color} color
	 */
	fill(color, t = 0) {
		return new Promise((resolve, _) => {
			if (t == 0) {
				this.color = color;
				resolve(this);
			} else {
				const rgbStart = this.color;
				const rgbFinal = color;
				let currentColor = rgbStart;
				if (!rgbFinal) {
					console.error(`Invalid color: ${color}`);
					resolve(this);
				}
				const animationStartTime = Date.now();
				const g = this;
				const rChange = (rgbFinal.r - rgbStart.r) / (t * fps);
				const gChange = (rgbFinal.g - rgbStart.g) / (t * fps);
				const bChange = (rgbFinal.b - rgbStart.b) / (t * fps);
				function fillLoop() {
					g.color.r = currentColor.r;
					g.color.g = currentColor.g;
					g.color.b = currentColor.b;
					currentColor.r += rChange;
					currentColor.g += gChange;
					currentColor.b += bChange;
					setTimeout(() => {
						if (Date.now() - animationStartTime < t * 1000) {
							fillLoop();
						} else {
							resolve(g);
						}
					}, 1000 / fps);
				}
				fillLoop();
			}
		});
	}
	/**
	 * 
	 * @param {Number} t - time
	 * @returns {Promise<Circle>}
	 */
	empty(t = 0) {
		if (typeof t === 'number') {
			return this.fill('#ffffff', t);
		} else {
			return this.fill('#000000', t);
		}
	}
	/**
	 * 
	 * @param {Number} t - time
	 * @param {Number} x - relative x position
	 * @param {Number} y - relative y position
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
			const g = this;
			function moveLoop() {
				g.x += xChange;
				g.y += yChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						moveLoop();
					} else {
						resolve(g);
					}
				}, 1000 / fps);
			}
			moveLoop();
		});
	}
	/**
	 * 
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Boolean} center - whether to center the object
	 * @param {*} t 
	 * @returns 
	 */
	moveTo(x, y, center = false, t = 0) {
		return new Promise((resolve, reject) => {
			if (t == 0) {
				this.x = (x - this.x + (center ? 0 : this.radius));
				this.x = (y - this.y + (center ? 0 : this.radius));
				resolve(this);
			}
			const animationStartTime = Date.now();
			const xChange = (x - this.x + (center ? 0 : this.radius)) / (t * fps);
			const yChange = (y - this.y + (center ? 0 : this.radius)) / (t * fps);
			const g = this;
			function moveLoop() {
				g.x += xChange;
				g.y += yChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						moveLoop();
					} else {
						resolve(g);
					}
				}, 1000 / fps);
			}
			moveLoop();
		})
	}
	/**
	 * 
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Circle}
	 */
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}
}

class Circle extends CompatableSimulationObject {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Color} color
	 */
	constructor(x, y, radius, color = new Color(0, 0, 0)) {
		super(x, y, color);
		this.radius = radius;
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
	 * 
	 * @param {Number} scale
	 * @param {Number} t - time
	 * @returns {Promise<Circle>}
	 */
	expand(scale, t = 0) {
		return new Promise((resolve, reject) => {
			scale /= 2;
			if (t == 0) {
				console.log(this.radius, scale);
				this.radius *= (scale + 1);
				console.log(this.radius);
				resolve(this);
			} else {
				const animationStartTime = Date.now();
				const scaleChange = scale / (t * fps);
				const g = this;
				function expandLoop() {
					g.expanding = true;
					g.radius *= (scaleChange + 1);
					setTimeout(() => {
						if (Date.now() - animationStartTime < t * 1000) {
							expandLoop();
						} else {
							g.expanding = false;
							resolve(g);
						}
					}, 1000 / fps);
				}
				if (!this.expanding) expandLoop();
			}
		})
	}
	/**
	 * 
	 * @param {Number} radius
	 * @param {Number} t - time
	 * @returns {Promise<Circle>}
	 */
	expandTo(radius, t = 0) {
		if (t == 0) {
			this.radius = radius;
			return;
		}
		return new Promise((resolve, reject) => {
			const animationStartTime = Date.now();
			const radiusChange = (radius - this.radius) / (t * fps);
			const g = this;
			function expandLoop() {
				g.expanding = true;
				g.radius += radiusChange;
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						expandLoop();
					} else {
						g.expanding = false;
						resolve(g);
					}
				}, 1000 / fps);
			}
			if (!this.expanding) expandLoop();
		});
	}
}

class Square extends CompatableSimulationObject {
	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Color} color
	 */
	constructor(x, y, width, height, color = new Color(0, 0, 0)) {
		super(x, y, color);
		this.width = width;
		this.height = height;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
		ctx.closePath();
	}
	expand(scale, t = 0) {
		return new Promise((resolve, reject) => {
			scale = scale / 3;
			if (t == 0) {
				this.width *= scale;
				this.height *= scale;
				resolve(this);
			}
			const animationStartTime = Date.now();
			const scaleChange = scale / (t * fps);
			const g = this;
			function expandLoop() {
				g.expanding = true;
				g.width *= (scaleChange + 1);
				g.height *= (scaleChange + 1);
				setTimeout(() => {
					if (Date.now() - animationStartTime < t * 1000) {
						expandLoop();
					} else {
						g.expanding = false;
						resolve(g);
					}
				}, 1000 / fps);
			}
			if (!this.expanding) expandLoop();
		})
	}
	/**
	 * 
	 * @param {Number} radius - radius to shift circle to
	 * @param {Number} t - time in seconds
	 * @returns {Promise<Circle>}
	 */
	expandTo(dimensionX, dimensionY, t = 0) {
		return new Promise((resolve, reject) => {
			if (t == 0) {
				this.width = dimensionX;
				this.height = dimensionY;
				resolve(this)
			} else {
				const animationStartTime = Date.now();
				const dimChangeX = (dimensionX - this.width) / (t * fps);
				const dimChangeY = (dimensionY - this.height) / (t * fps);
				const g = this;
				function expandLoop() {
					g.expanding = true;
					g.width += dimChangeX;
					g.height += dimChangeY;
					setTimeout(() => {
						if (Date.now() - animationStartTime < t * 1000) {
							expandLoop();
						} else {
							g.expanding = false;
							resolve(g);
						}
					}, 1000 / fps);
				}
				if (!this.expanding) expandLoop();
			}
		});
	}
}

class Color {
	/**
	 * 
	 * @param {Number} r
	 * @param {Number} g 
	 * @param {Number} b 
	 */
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