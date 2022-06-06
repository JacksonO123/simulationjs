// global vars
let fps;

class Vector {
	constructor(x, y, r = 0) {
		this.x = x;
		this.y = y;
		this.startX = x;
		this.startY = y;
		this.rotation = r;
	}
	rotate(deg) {
		this.rotation += deg;
		this.#setRotation();
	}
	rotateTo(deg) {
		this.rotation = deg;
		this.#setRotation();
	}
	#setRotation() {
		const deg = this.rotation * (Math.PI / 180);
		this.x = this.startX * Math.cos(deg) - this.startY * Math.sin(deg);
		this.y = this.startX * Math.sin(deg) + this.startY * Math.cos(deg);
	}
	draw(c, x = 0, y = 0, color = "#000000", s = 1) {
		c.beginPath();
		c.strokeStyle = color;
		c.moveTo(x, y);
		c.lineTo(x + (this.x * s), y + (this.y * s));
		c.stroke();
		c.closePath();
	}
}

class SimulationElement {
	/**
	 * @param {Point} pos 
	 * @param {Color} color
	 */
	constructor(pos, color) {
		this.pos = pos;
		this.color = color;
	}
	/**
	 * @param {Color} color 
	 * @param {Number} t - time in seconds
	 */
	fill(color, t = 0) {
		return new Promise((resolve, reject) => {
			if (t == 0) {
				this.color = color;
				resolve();
			} else {
				const currentColor = new Color(this.color.r, this.color.g, this.color.b);
				const changeR = (color.r - this.color.r) / (t * fps);
				const changeG = (color.g - this.color.g) / (t * fps);
				const changeB = (color.b - this.color.b) / (t * fps);
				const startTime = Date.now();
				const g = this;
				function changeLoop() {
					setTimeout(() => {
						currentColor.r += changeR;
						currentColor.g += changeG;
						currentColor.b += changeB;
						g.color.r = currentColor.r;
						g.color.g = currentColor.g;
						g.color.b = currentColor.b;
						if (Date.now() - startTime < t * 1000) {
							changeLoop();
						} else {
							g.color = color;
							resolve();
						}
					}, 1000 / fps);
				}
				changeLoop();
			}
		});
	}
	/**
	 * @param {Point} p
	 * @param {Number} t - time in seconds
	 */
	moveTo(p, t = 0) {
		return new Promise((resolve, reject) => {
			if (t == 0) {
				this.pos = p;
				resolve();
			} else {
				const changeX = (p.x - this.pos.x) / (t * fps);
				const changeY = (p.y - this.pos.y) / (t * fps);
				const g = this;
				const startTime = Date.now();
				function changeLoop() {
					setTimeout(() => {
						g.pos.x += changeX;
						g.pos.y += changeY;
						if (Date.now() - startTime < t * 1000) {
							changeLoop();
						} else {
							g.pos.x = p.x;
							g.pos.y = p.y;
							resolve();
						}
					}, 1000 / fps);
				}
				changeLoop();
			}
		});
	}
	/**
	 * @param {Vector} p 
	 * @param {Number} t - time in seconds
	 *
	*/
	move(p, t = 0) {
		return new Promise((resolve, reject) => {
			const startPos = new Point(this.pos.x, this.pos.y);
			if (t == 0) {
				this.pos.x += p.x;
				this.pos.y += p.y;
				resolve();
			} else {
				const changeX = p.x / (t * fps);
				const changeY = p.y / (t * fps);
				const g = this;
				const startTime = Date.now();
				function changeLoop() {
					setTimeout(() => {
						g.pos.x += changeX;
						g.pos.y += changeY;
						if (Date.now() - startTime < t * 1000) {
							changeLoop();
						} else {
							g.pos.x = startPos.x + p.x;
							g.pos.y = startPos.y + p.y;
							resolve();
						}
					}, 1000 / fps);
				}
				changeLoop();
			}
		});
	}
}

class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
}

class Point extends Vector {
	constructor(x, y) {
		super(x, y);
	}
}

class Circle extends SimulationElement {
	constructor(pos, radius, color) {
		super(pos, color);
		this.radius = radius;
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = rgbToHex(this.color);
		c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}
}

class Square extends SimulationElement {
	/**
	 * @param {Vector} position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Color} color
	 * @param {Number} offsetX
	 * @param {Number} offsetY
	 * @param {Number} rotation - rotation in degrees
	 */
	constructor(pos, width, height, color, offsetX = 0, offsetY = 0, rotation = 0) {
		super(pos, color);
		this.width = width;
		this.height = height;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.rotation = rotation;
		this.showNodeVectors = false;
		this.topLeft = new Vector(-this.width / 2 - offsetX, -this.height / 2 - offsetY)
		this.topRight = new Vector(this.width / 2 - offsetX, -this.height / 2 - offsetY)
		this.bottomLeft = new Vector(-this.width / 2 - offsetX, this.height / 2 - offsetY)
		this.bottomRight = new Vector(this.width / 2 - offsetX, this.height / 2 - offsetY)
		this.#setRotation();
	}
	setNodeVectors(show) {
		this.showNodeVectors = show;
	}
	#setRotation() {
		this.topLeft.rotateTo(this.rotation);
		this.topRight.rotateTo(this.rotation);
		this.bottomLeft.rotateTo(this.rotation);
		this.bottomRight.rotateTo(this.rotation);
	}
	rotate(deg) {
		this.rotation += deg;
		this.#setRotation();
	}
	rotateTo(deg) {
		this.rotation = deg;
		this.#setRotation();
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = rgbToHex(this.color);
		c.moveTo(this.pos.x + this.topLeft.x + this.offsetX, this.pos.y + this.topLeft.y + this.offsetY);
		c.lineTo(this.pos.x + this.topRight.x + this.offsetX, this.pos.y + this.topRight.y + this.offsetY);
		c.lineTo(this.pos.x + this.bottomRight.x + this.offsetX, this.pos.y + this.bottomRight.y + this.offsetY);
		c.lineTo(this.pos.x + this.bottomLeft.x + this.offsetX, this.pos.y + this.bottomLeft.y + this.offsetY);
		c.fill();
		c.closePath();
		if (this.showNodeVectors) {
			this.topLeft.draw(c, this.pos.x + this.offsetX, this.pos.y + this.offsetY);
			this.topRight.draw(c, this.pos.x + this.offsetX, this.pos.y + this.offsetY);
			this.bottomLeft.draw(c, this.pos.x + this.offsetX, this.pos.y + this.offsetY);
			this.bottomRight.draw(c, this.pos.x + this.offsetX, this.pos.y + this.offsetY);
		}
	}
}

class Simulation {
	constructor(id, frameRate) {
		fps = frameRate;
		this.scene = [];
		this.fullScreen = false;
		this.bgColor = '#ffffff';

		this.canvas = document.getElementById(id);
		window.addEventListener('resize', () => this.#resizeCanvas(this.canvas));
		this.#resizeCanvas(this.canvas);
		const ctx = this.canvas.getContext("2d");

		this.#render(ctx);
	}
	#render(c) {
		setTimeout(() => {
			c.clearRect(0, 0, this.canvas.width, this.canvas.height);

			c.beginPath();
			c.fillStyle = this.bgColor;
			c.fillRect(0, 0, this.canvas.width, this.canvas.height);
			c.closePath();

			for (const element of this.scene) {
				element.draw(c);
			}
			this.#render(c);
		}, 1000 / fps);
	}
	add(element) {
		if (element instanceof SimulationElement) {
			this.scene.push(element);
		} else {
			console.warn('Invalid Element. Must be an instance of SimElement');
		}
	}
	on(event, callback) {
		this.canvas.addEventListener(event, callback);
	}
	fitWindow() {
		this.fullScreen = true;
		this.#resizeCanvas(this.canvas);
	}
	setSize(x, y) {
		this.canvas.width = x;
		this.canvas.height = y;
		this.fullScreen = false;
	}
	/**
	 * @param {Color} color 
	 */
	setBgColor(color) {
		this.bgColor = rgbToHex(color);
	}
	#resizeCanvas(c) {
		if (this.fullScreen) {
			c.width = window.innerWidth;
			c.height = window.innerHeight;
		}
	}
}

function pythag(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function compToHex(c) {
	let hex = (Math.round(c)).toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

/**
 * @param {Color} color 
 */
function rgbToHex(color) {
	return '#' + compToHex(color.r) + compToHex(color.g) + compToHex(color.b);
}