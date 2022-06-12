// global vars
let fps;

class Vector {
	constructor(x, y, r = 0) {
		this.x = x;
		this.y = y;
		this.mag = pythag(x, y);
		this.startAngle = radToDeg(atan2(y, x));
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
	draw(c, x = 0, y = 0, color = '#000000', s = 1) {
		c.beginPath();
		c.strokeStyle = color;
		c.moveTo(x, y);
		c.lineTo(x + this.x * s, y + this.y * s);
		c.stroke();
		c.closePath();
	}
	format() {
		return `(${this.x}, ${this.y})`;
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
		this.sim = null;
	}
	setSimulationElement(el) {
		this.sim = el;
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
				const currentColor = new Color(
					this.color.r,
					this.color.g,
					this.color.b
				);
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
	format() {
		return super.format();
	}
}

class Circle extends SimulationElement {
	constructor(pos, radius, color) {
		super(pos, color);
		this.radius = radius;
		this.hovering = false;
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = rgbToHex(this.color);
		c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
	}
	on(event, callback, callback2) {
		const validEvents = ['mousemove', 'click', 'hover'];
		if (!validEvents.includes(event)) {
			console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
		}

		switch (event) {
			case 'mouseover': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (!this.hovering && this.contains(p)) {
						this.hovering = true;
						callback(e);
					}
				});
				break;
			}
			case 'mouseleave': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.hovering && !this.contains(p)) {
						this.hovering = false;
						callback(e);
					}
				});
				break;
			}
			case 'hover': {
				this.on('mouseover', callback);
				this.on('mouseleave', callback2);
				break;
			}
			case 'mousemove': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.contains(p)) {
						callback(e);
					}
				});
				break;
			}
			case 'click': {
				this.sim.addEventListener('click', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.contains(p)) {
						callback(e);
					}
				});
			}
			default: break;
		}
	}
	contains(p) {
		return distance(p, this.pos) < this.radius;
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
	constructor(
		pos,
		width,
		height,
		color,
		offsetX = 0,
		offsetY = 0,
		rotation = 0
	) {
		super(pos, color);
		this.width = width;
		this.height = height;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.rotation = rotation;
		this.showNodeVectors = false;
		this.topLeft = new Vector(
			-this.width / 2 - offsetX,
			-this.height / 2 - offsetY
		);
		this.topRight = new Vector(
			this.width / 2 - offsetX,
			-this.height / 2 - offsetY
		);
		this.bottomLeft = new Vector(
			-this.width / 2 - offsetX,
			this.height / 2 - offsetY
		);
		this.bottomRight = new Vector(
			this.width / 2 - offsetX,
			this.height / 2 - offsetY
		);
		this.hovering = false;
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
		c.moveTo(
			this.pos.x + this.topLeft.x + this.offsetX,
			this.pos.y + this.topLeft.y + this.offsetY
		);
		c.lineTo(
			this.pos.x + this.topRight.x + this.offsetX,
			this.pos.y + this.topRight.y + this.offsetY
		);
		c.lineTo(
			this.pos.x + this.bottomRight.x + this.offsetX,
			this.pos.y + this.bottomRight.y + this.offsetY
		);
		c.lineTo(
			this.pos.x + this.bottomLeft.x + this.offsetX,
			this.pos.y + this.bottomLeft.y + this.offsetY
		);
		c.fill();
		c.closePath();

		if (this.showNodeVectors) {
			this.topLeft.draw(
				c,
				this.pos.x + this.offsetX,
				this.pos.y + this.offsetY
			);
			this.topRight.draw(
				c,
				this.pos.x + this.offsetX,
				this.pos.y + this.offsetY
			);
			this.bottomLeft.draw(
				c,
				this.pos.x + this.offsetX,
				this.pos.y + this.offsetY
			);
			this.bottomRight.draw(
				c,
				this.pos.x + this.offsetX,
				this.pos.y + this.offsetY
			);
		}
	}
	contains(p) {
		const topLeftVector = new Vector(this.topLeft.mag, 0);
		topLeftVector.rotateTo(this.topLeft.startAngle);

		const topRightVector = new Vector(this.topRight.mag, 0);
		topRightVector.rotateTo(this.topRight.startAngle);

		const bottomLeftVector = new Vector(this.bottomLeft.mag, 0);
		bottomLeftVector.rotateTo(this.bottomLeft.startAngle);

		const bottomRightVector = new Vector(this.bottomRight.mag, 0);
		bottomRightVector.rotateTo(this.bottomRight.startAngle);

		const cursorVector = new Vector(p.x - this.pos.x - this.offsetX, p.y - this.pos.y - this.offsetY);
		cursorVector.rotateTo(-this.rotation);

		if (
			cursorVector.x > topRightVector.x &&
			cursorVector.x < bottomLeftVector.x &&
			cursorVector.y > topLeftVector.y &&
			cursorVector.y < topRightVector.y
		) {
			return true;
		}
		return false;
	}
	on(event, callback, callback2) {
		const validEvents = ['mousemove', 'click', 'hover'];
		if (!validEvents.includes(event)) {
			console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
		}
		switch (event) {
			case 'mouseover': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (!this.hovering && this.contains(p)) {
						this.hovering = true;
						callback(e);
					}
				});
				break;
			}
			case 'mouseleave': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.hovering && !this.contains(p)) {
						this.hovering = false;
						callback(e);
					}
				});
				break;
			}
			case 'mousemove': {
				this.sim.addEventListener('mousemove', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.contains(p)) {
						callback(e);
					}
				});
				break;
			}
			case 'click': {
				this.sim.addEventListener('click', (e) => {
					const p = new Point(e.clientX, e.clientY);
					if (this.contains(p)) {
						callback(e);
					}
				});
				break;
			}
			case 'hover': {
				this.on('mouseover', callback);
				this.on('mouseleave', callback2);
				break;
			}
			default: break;
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
		const ctx = this.canvas.getContext('2d');

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
			element.setSimulationElement(this.canvas);
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
	let hex = Math.round(c).toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

/***
 * @param {Point} p1
 * @param {Point} p2
 */
function distance(p1, p2) {
	return pythag(p1.x - p2.x, p1.y - p2.y);
}

function atan2(x, y) {
	return Math.atan2(y, x);
}

function degToRad(deg) {
	return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
	return (rad * 180) / Math.PI;
}

/**
 * @param {Color} color
 */
function rgbToHex(color) {
	return '#' + compToHex(color.r) + compToHex(color.g) + compToHex(color.b);
}
