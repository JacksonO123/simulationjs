// global vars
let fps;
let currentMousePos;
let currentMouseEvent;
const validEvents = ['mousemove', 'click', 'hover', 'mouseover', 'mouseleave'];

class Vector {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} r
	 */
	constructor(x, y, r = 0) {
		this.x = x;
		this.y = y;
		this.mag = pythag(x, y);
		this.startAngle = radToDeg(atan2(y, x));
		this.startX = x;
		this.startY = y;
		this.rotation = r;
	}
	/**
	 * @param {number} deg
	 */
	rotate(deg) {
		this.rotation += deg;
		this.#setRotation();
	}
	/**
	 * @param {number} deg
	 */
	rotateTo(deg) {
		this.rotation = deg;
		this.#setRotation();
	}
	#setRotation() {
		const deg = this.rotation * (Math.PI / 180);
		this.x = this.startX * Math.cos(deg) - this.startY * Math.sin(deg);
		this.y = this.startX * Math.sin(deg) + this.startY * Math.cos(deg);
	}
	/**
	 * 
	 * @param {any} c - context
	 * @param {number} x 
	 * @param {number} y 
	 * @param {string} color - hex color, not Color object
	 * @param {number} s - vector scale
	 * @param {number} t - stroke width
	 */
	draw(c, x = 0, y = 0, color = '#000000', s = 1, t = 1) {
		c.beginPath();
		c.strokeStyle = color;
		c.lineWidth = t;
		c.moveTo(x, y);
		c.lineTo(x + this.x * s, y + this.y * s);
		c.stroke();
		c.closePath();
	}
	normalize() {
		if (this.mag != 0) {
			this.x /= this.mag;
			this.startX = this.x;
			this.y /= this.mag;
			this.startY = this.y;
			this.mag = 1;
		}
	}
	/**
	 * @param {number} n
	 */
	multiply(n) {
		this.x *= n;
		this.startX = this.x;
		this.y *= n;
		this.startY = this.y;
		this.mag *= n;
	}
	/**
	 * @param {number} n
	 */
	multiplyX(n) {
		this.x *= n;
		this.#updateMag();
	}
	/**
	 * @param {number} n
	 */
	multiplyY(n) {
		this.y *= n;
		this.#updateMag();
	}
	/**
	 * @param {number} n
	 */
	divide(n) {
		this.x /= n;
		this.startX = this.x;
		this.y /= n;
		this.startY = this.y;
		this.mag /= n;
	}
	/**
	 * @param {number} value
	 */
	appendMag(value) {
		if (this.mag != 0) {
			const newMag = this.mag + value;
			this.normalize();
			this.multiply(newMag);
			this.mag = newMag;
		}
	}
	/**
	 * @param {number} value
	 */
	appendX(value) {
		this.x += value;
		this.#updateMag();
	}
	/**
	 * @param {number} value
	 */
	appendY(value) {
		this.y += value;
		this.#updateMag();
	}
	/**
	 * @param {number} value
	 */
	setX(value) {
		this.x = value;
		this.#updateMag();
	}
	/**
	 * @param {number} value
	 */
	setY(value) {
		this.y = value;
		this.#updateMag();
	}
	#updateMag() {
		this.mag = pythag(this.x, this.y);
	}
	/**
	 * @param {number} value
	 */
	setMag(value) {
		this.normalize();
		this.multiply(value);
		this.mag = value;
	}
	clone() {
		return new Vector(this.x, this.y, this.rotation);
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
	constructor(pos, color = new Color(0, 0, 0)) {
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
		const currentColor = new Color(
			this.color.r,
			this.color.g,
			this.color.b
		);
		const changeR = (color.r - this.color.r) / (t * fps);
		const changeG = (color.g - this.color.g) / (t * fps);
		const changeB = (color.b - this.color.b) / (t * fps);

		const func = () => {
			this.color = color;
		};

		return transitionValues(func, () => {
			currentColor.r += changeR;
			currentColor.g += changeG;
			currentColor.b += changeB;
			this.color.r = currentColor.r;
			this.color.g = currentColor.g;
			this.color.b = currentColor.b;
		}, func, t);
	}
	/**
	 * @param {Point} p
	 * @param {Number} t - time in seconds
	 */
	moveTo(p, t = 0) {
		const changeX = (p.x - this.pos.x) / (t * fps);
		const changeY = (p.y - this.pos.y) / (t * fps);

		return transitionValues(() => {
			this.pos = p;
		}, () => {
			this.pos.x += changeX;
			this.pos.y += changeY;
		}, () => {
			this.pos.x = p.x;
			this.pos.y = p.y;
		}, t);
	}
	/**
	 * @param {Vector} p
	 * @param {Number} t - time in seconds
	 *
	 */
	move(p, t = 0) {
		const changeX = p.x / (t * fps);
		const changeY = p.y / (t * fps);
		const startPos = new Point(this.pos.x, this.pos.y);

		return transitionValues(() => {
			this.pos.x += p.x;
			this.pos.y += p.y;
		}, () => {
			this.pos.x += changeX;
			this.pos.y += changeY;
		}, () => {
			this.pos.x = startPos.x + p.x;
			this.pos.y = startPos.y + p.y;
		}, t);
	}
}

class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	#compToHex(c) {
		const hex = Math.round(c).toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}
	toHex() {
		return '#' + this.#compToHex(this.r) + this.#compToHex(this.g) + this.#compToHex(this.b);
	}
}

class Point extends Vector {
	/**
	 * @param {number} x 
	 * @param {number} y 
	 */
	constructor(x, y) {
		super(x, y);
	}
	format() {
		return super.format();
	}
}

class SceneCollection extends SimulationElement {
	constructor(n = '') {
		super(new Point(0, 0), new Color(0, 0, 0));
		this.name = n;
		this.scene = [];
		this.idObjs = {};
	}
	add(element, id = null) {
		if (element instanceof SimulationElement) {
			if (this.sim != null) {
				element.setSimulationElement(this.sim);
			}
			if (id != null) {
				this.idObjs[id] = element;
			} else {
				this.scene.push(element);
			}
		} else {
			console.warn('Invalid Element. Must be an instance of SimElement');
		}
	}
	/**
	 * @param {string} id
	 */
	removeWithId(id) {
		delete this.idObjs[id];
	}
	removeWithObject(element) {
		for (const el of this.scene) {
			if (el == element) {
				this.scene.splice(this.scene.indexOf(el), 1);
				return;
			}
		}
		for (const key of Object.keys(this.idObjs)) {
			if (this.idObjs[key] == element) {
				delete this.idObjs[key];
			}
		}
	}
	setSimulationElement(sim) {
		this.sim = sim;
		for (const element of this.scene) {
			element.setSimulationElement(sim);
		}
	}
	draw(c) {
		for (const element of this.scene) {
			element.draw(c);
		}
		for (const element of Object.values(this.idObjs)) {
			element.draw(c);
		}
	}
}

class Line extends SimulationElement {
	/**
	 * @param {Point} p1 
	 * @param {Point} p2 
	 * @param {Color} color 
	 */
	constructor(p1, p2, thickness, color, r = 0) {
		super(p1, color);
		this.start = p1;
		this.end = p2;
		this.rotation = r;
		this.#setVector();
		this.thickness = thickness;
	}
	moveStart(p) {
		this.start = p;
		this.#setVector();
	}
	moveEnd(p) {
		this.end = p;
		this.#setVector();
	}
	#setVector() {
		this.vec = new Vector(this.end.x - this.start.x, this.end.y - this.start.y);
		this.vec.rotateTo(this.rotation);
	}
	rotate(deg) {
		this.rotation += deg;
		this.vec.rotate(deg);
	}
	rotateTo(deg) {
		this.rotation = deg;
		this.vec.rotateTo(deg);
	}
	/**
	 * @param {Point} p 
	 */
	moveTo(p) {
		this.start = p;
	}
	/**
	 * @param {Vector} v 
	 */
	move(v) {
		this.end.x += v.x;
		this.end.y += v.y;
		this.start.x += v.x;
		this.start.y += v.y;
	}
	draw(c) {
		this.vec.draw(c, this.start.x, this.start.y, this.color.toHex(), 1, this.thickness);
	}
}

class Circle extends SimulationElement {
	/**
	 * @param {Point} pos 
	 * @param {number} radius 
	 * @param {Color} color 
	 */
	constructor(pos, radius, color) {
		super(pos, color);
		this.radius = radius;
		this.hovering = false;
		this.events = [];
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = this.color.toHex();
		c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
		c.fill();
		c.closePath();
		this.#checkEvents();
	}
	/**
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	setRadius(value, t = 0) {
		const radiusChange = (value - this.radius) / (t * fps);

		return transitionValues(() => {
			this.radius = value;
		}, () => {
			this.radius += radiusChange;
		}, () => {
			this.radius = value;
		}, t);
	}
	/**
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	scale(value, t = 0) {
		const radiusChange = ((this.radius * value) - this.radius) / (t * fps);
		const finalValue = this.radius * value;

		return transitionValues(() => {
			this.radius = finalValue;
		}, () => {
			this.radius += radiusChange;
		}, () => {
			this.radius = finalValue;
		}, t);
	}
	/**
	 * @param {string} event
	 * @param {Function} callback
	 * @param {Function} callback2
	 */
	#checkEvents() {
		this.events.forEach(event => {
			const name = event.name;
			switch (name) {
				case 'mouseover': {
					if (!this.hovering && currentMousePos && this.contains(currentMousePos)) {
						this.hovering = true;
						event.callback(currentMouseEvent);
					}
					break;
				}
				case 'mouseleave': {
					if (this.hovering && currentMousePos && !this.contains(currentMousePos)) {
						this.hovering = false;
						event.callback(currentMouseEvent);
					}
					break;
				}
				default: break;
			}
		});
	}
	on(event, callback1, callback2) {
		if (!validEvents.includes(event)) {
			console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
			return;
		}

		// specific events
		if (event === 'mousemove') {
			this.sim.addEventListener('mousemove', e => {
				const p = new Point(e.offsetX, e.offsetY);
				if (this.contains(p)) {
					callback1(e);
				}
			});
		} else if (event === 'hover') {
			this.on('mouseover', callback1);
			this.on('mouseleave', callback2);
		} else if (event === 'click') {
			this.sim.addEventListener('click', e => {
				const p = new Point(e.clientX, e.clientY);
				if (this.contains(p)) {
					callback1(e);
				}
			});
		} else {
			const newEvent = new Event(event, callback1);
			this.events.push(newEvent);
		}
	}
	/**
	 * @param {Point} p
	 * @returns {boolean}
	 */
	contains(p) {
		return distance(p, this.pos) < this.radius;
	}
}

class Polygon extends SimulationElement {
	/***
	 * @param {Color} color
	 * @param {Point[]} points
	 */
	constructor(pos, points, color, r = 0, offsetX = 0, offsetY = 0) {
		super(pos, color)
		this.points = points.map(p => {
			return new Point(p.x + offsetX, p.y + offsetY);
		});
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
		this.points = this.points.map(p => {
			p.rotateTo(this.rotation);
			return p;
		});
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = this.color.toHex();
		c.moveTo(this.points[0].x + this.pos.x, this.points[0].y + this.pos.y);
		for (let i = 1; i < this.points.length; i++) {
			c.lineTo(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y);
		}
		c.fill();
		c.closePath();
	}
}

class Event {
	constructor(name, callback) {
		this.name = name;
		this.callback = callback;
	}
}

class Square extends SimulationElement {
	/**
	 * @param {Point} pos
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
		this.events = [];
		this.#setRotation();
	}
	/**
	 * @param {boolean} show 
	 */
	setNodeVectors(show) {
		this.showNodeVectors = show;
	}
	#setRotation() {
		this.topLeft.rotateTo(this.rotation);
		this.topRight.rotateTo(this.rotation);
		this.bottomLeft.rotateTo(this.rotation);
		this.bottomRight.rotateTo(this.rotation);
	}
	/**
	 * @param {number} deg
	 * @param {number} t
	 */
	rotate(deg, t = 0) {
		const startRotation = this.rotation;
		const rotationChange = deg / (t * fps);

		const func = () => {
			this.rotation = startRotation + deg;
			this.#setRotation();
		};

		return transitionValues(func, () => {
			this.rotation += rotationChange;
			this.#setRotation();
		}, func, t);
	}
	/**
	 * @param {number} deg 
	 * @param {number} t 
	 */
	rotateTo(deg, t = 0) {
		const rotationChange = (deg - this.rotation) / (t * fps);

		const func = () => {
			this.rotation = deg;
			this.#setRotation();
		};

		return transitionValues(func, () => {
			this.rotation += rotationChange;
			this.#setRotation();
		}, func, t);
	}
	draw(c) {
		c.beginPath();
		c.fillStyle = this.color.toHex();
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
				this.pos.y + this.offsetY,
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

		this.#checkEvents();
	}
	/**
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	scale(value, t = 0) {
		const topRightMag = this.topRight.mag;
		const topLeftMag = this.topLeft.mag;
		const bottomRightMag = this.bottomRight.mag;
		const bottomLeftMag = this.bottomLeft.mag;

		const topRightChange = ((topRightMag * value) - topRightMag) / (t * fps);
		const topLeftChange = ((topLeftMag * value) - topLeftMag) / (t * fps);
		const bottomRightChange = ((bottomRightMag * value) - bottomRightMag) / (t * fps);
		const bottomLeftChange = ((bottomLeftMag * value) - bottomLeftMag) / (t * fps);

		return transitionValues(() => {
			this.topRight.multiply(value);
			this.topLeft.multiply(value);
			this.bottomRight.multiply(value);
			this.bottomLeft.multiply(value);
		}, () => {
			this.topRight.appendMag(topRightChange);
			this.topLeft.appendMag(topLeftChange);
			this.bottomRight.appendMag(bottomRightChange);
			this.bottomLeft.appendMag(bottomLeftChange);
		}, () => {
			this.topRight.normalize();
			this.topRight.multiply(topRightMag * value);

			this.topLeft.normalize();
			this.topLeft.multiply(topLeftMag * value);

			this.bottomRight.normalize();
			this.bottomRight.multiply(bottomRightMag * value);

			this.bottomLeft.normalize();
			this.bottomLeft.multiply(bottomLeftMag * value);
		}, t);
	}
	/**
	 * @param {value} value
	 * @param {value} t
	 * @returns {Promise}
	 */
	scaleWidth(value, t = 0) {
		const topRightStart = this.topRight.clone();
		const topLeftStart = this.topLeft.clone();
		const bottomLeftStart = this.bottomLeft.clone();
		const bottomRightStart = this.bottomRight.clone();
		const topRightMag = topRightStart.x;
		const topLeftMag = topLeftStart.x;
		const bottomRightMag = bottomRightStart.x;
		const bottomLeftMag = bottomLeftStart.x;
		const topRightChange = ((topRightMag * value) - topRightMag) / (t * fps);
		const topLeftChange = ((topLeftMag * value) - topLeftMag) / (t * fps);
		const bottomRightChange = ((bottomRightMag * value) - bottomRightMag) / (t * fps);
		const bottomLeftChange = ((bottomLeftMag * value) - bottomLeftMag) / (t * fps);

		return transitionValues(() => {
			this.topRight.multiplyX(value);
			this.topLeft.multiplyX(value);
			this.bottomRight.multiplyX(value);
			this.bottomLeft.multiplyX(value);
		}, () => {
			this.topRight.appendX(topRightChange);
			this.topLeft.appendX(topLeftChange);
			this.bottomRight.appendX(bottomRightChange);
			this.bottomLeft.appendX(bottomLeftChange);
		}, () => {
			topRightStart.x = topRightMag * value;
			this.topRight = topRightStart.clone();

			topLeftStart.x = topLeftMag * value;
			this.topLeft = topLeftStart.clone();

			bottomRightStart.x = bottomRightMag * value;
			this.bottomRight = bottomRightStart.clone();

			bottomLeftStart.x = bottomLeftMag * value;
			this.bottomLeft = bottomLeftStart.clone();

			this.width = this.topRight.x + this.topLeft.x;
		}, t);
	}
	/**
	 * 
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	scaleHeight(value, t = 0) {
		const topRightStart = this.topRight.clone();
		const topLeftStart = this.topLeft.clone();
		const bottomLeftStart = this.bottomLeft.clone();
		const bottomRightStart = this.bottomRight.clone();
		const topRightMag = topRightStart.y;
		const topLeftMag = topLeftStart.y;
		const bottomRightMag = bottomRightStart.y;
		const bottomLeftMag = bottomLeftStart.y;
		const topRightChange = ((topRightMag * value) - topRightMag) / (t * fps);
		const topLeftChange = ((topLeftMag * value) - topLeftMag) / (t * fps);
		const bottomRightChange = ((bottomRightMag * value) - bottomRightMag) / (t * fps);
		const bottomLeftChange = ((bottomLeftMag * value) - bottomLeftMag) / (t * fps);

		return transitionValues(() => {
			this.topRight.multiplyY(value);
			this.topLeft.multiplyY(value);
			this.bottomRight.multiplyY(value);
			this.bottomLeft.multiplyY(value);
		}, () => {
			this.topRight.appendY(topRightChange);
			this.topLeft.appendY(topLeftChange);
			this.bottomRight.appendY(bottomRightChange);
			this.bottomLeft.appendY(bottomLeftChange);
		}, () => {
			topRightStart.y = topRightMag * value;
			this.topRight = topRightStart.clone();

			topLeftStart.y = topLeftMag * value;
			this.topLeft = topLeftStart.clone();

			bottomRightStart.y = bottomRightMag * value;
			this.bottomRight = bottomRightStart.clone();

			bottomLeftStart.y = bottomLeftMag * value;
			this.bottomLeft = bottomLeftStart.clone();

			this.height = this.topRight.y + this.bottomRight.y;
		}, t);
	}
	/**
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	setWidth(value, t = 0) {
		// change this to use the y change of each vector individually
		function setValues(ctx) {
			ctx.topRight.setX(value / 2);
			ctx.topLeft.setX(-value / 2);
			ctx.bottomRight.setX(value / 2);
			ctx.bottomLeft.setX(-value / 2);
		}
		const widthChange = ((value - this.width) / 2) / (t * fps);

		return transitionValues(() => {
			setValues(this);
		}, () => {
			this.topRight.appendX(widthChange);
			this.topLeft.appendX(-widthChange);
			this.bottomRight.appendX(widthChange);
			this.bottomLeft.appendX(-widthChange);
		}, () => {
			setValues(this);
		}, t);
	}
	/**
	 * @param {number} value
	 * @param {number} t
	 * @returns {Promise}
	 */
	setHeight(value, t = 0) {
		// change this to use the y change of each vector individually
		function setValues(ctx) {
			ctx.topRight.setY(-value / 2);
			ctx.topLeft.setY(-value / 2);
			ctx.bottomRight.setY(value / 2);
			ctx.bottomLeft.setY(value / 2);
		}
		const heightChange = ((value - this.width) / 2) / (t * fps);

		return transitionValues(() => {
			setValues(this);
		}, () => {
			this.topRight.appendY(-heightChange);
			this.topLeft.appendY(-heightChange);
			this.bottomRight.appendY(heightChange);
			this.bottomLeft.appendY(heightChange);
		}, () => {
			setValues(this);
		}, t);
	}
	/**
	 * @param {Point} p
	 * @returns {Promise}
	 */
	contains(p) {
		const topLeftVector = new Vector(this.topLeft.mag, 0);
		topLeftVector.rotateTo(90 - this.topLeft.startAngle);

		const topRightVector = new Vector(this.topRight.mag, 0);
		topRightVector.rotateTo(90 - this.topRight.startAngle);

		const bottomLeftVector = new Vector(this.bottomLeft.mag, 0);
		bottomLeftVector.rotateTo(90 - this.bottomLeft.startAngle);

		const bottomRightVector = new Vector(this.bottomRight.mag, 0);
		bottomRightVector.rotateTo(90 - this.bottomRight.startAngle);

		const cursorVector = new Vector(p.x - this.pos.x - this.offsetX, p.y - this.pos.y - this.offsetY);
		cursorVector.rotateTo(-this.rotation);

		if (
			cursorVector.x > bottomLeftVector.x &&
			cursorVector.x < topRightVector.x &&
			cursorVector.y > topLeftVector.y &&
			cursorVector.y < bottomLeftVector.y
		) {
			return true;
		}
		return false;
	}
	#checkEvents() {
		this.events.forEach(event => {
			const name = event.name;
			switch (name) {
				case 'mouseover': {
					if (!this.hovering && currentMousePos && this.contains(currentMousePos)) {
						this.hovering = true;
						event.callback(currentMouseEvent);
					}
					break;
				}
				case 'mouseleave': {
					if (this.hovering && currentMousePos && !this.contains(currentMousePos)) {
						this.hovering = false;
						event.callback(currentMouseEvent);
					}
					break;
				}
				default: break;
			}
		});
	}
	/**
	 * @param {string} event
	 * @param {Function} callback
	 * @param {Function} callback2
	 */
	on(event, callback1, callback2) {
		if (!validEvents.includes(event)) {
			console.warn(`Invalid event: ${event}. Event must be one of ${validEvents.join(', ')}`);
			return;
		}

		// specific events
		if (event === 'mousemove') {
			this.sim.addEventListener('mousemove', (e) => {
				const p = new Point(e.clientX, e.clientY);
				if (this.contains(p)) {
					callback1(e);
				}
			});
		} else if (event === 'click') {
			this.sim.addEventListener('click', (e) => {
				const p = new Point(e.clientX, e.clientY);
				if (this.contains(p)) {
					callback1(e);
				}
			});
		} else if (event === 'hover') {
			this.on('mouseover', callback1);
			this.on('mouseleave', callback2);
		} else {
			const newEvent = new Event(event, callback1);
			this.events.push(newEvent);
		}
	}
}

class Simulation {
	constructor(id, frameRate = 60) {
		fps = frameRate;
		this.scene = [];
		this.idObjs = {};
		this.fitting = false;
		this.bgColor = '#ffffff';

		this.canvas = document.getElementById(id);
		if (!this.canvas) {
			console.warn(`Canvas with id "${id}" not found`);
			return;
		}
		this.canvas.addEventListener('mousemove', e => {
			currentMousePos = new Point(e.offsetX, e.offsetY);
			currentMouseEvent = e;
		});
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
	add(element, id = null) {
		if (element instanceof SimulationElement) {
			element.setSimulationElement(this.canvas);
			if (id != null) {
				this.idObjs[id] = element;
			} else {
				this.scene.push(element);
			}
		} else {
			console.warn('Invalid Element. Must be an instance of SimElement');
		}
	}
	/**
	 * @param {string} id
	 */
	removeWithId(id) {
		delete this.idObjs[id];
	}
	removeWithObject(element) {
		for (const el of this.scene) {
			if (el == element) {
				this.scene.splice(this.scene.indexOf(el), 1);
				return;
			}
		}
		for (const key of Object.keys(this.idObjs)) {
			if (this.idObjs[key] == element) {
				delete this.idObjs[key];
			}
		}
	}
	/**
	 * @param {string} event
	 * @param {Function} callback
	 * @returns
	 */
	on(event, callback) {
		if (!this.canvas) return;
		this.canvas.addEventListener(event, callback);
	}
	fitElement() {
		if (!this.canvas) return;
		this.fitting = true;
		this.#resizeCanvas(this.canvas);
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns
	 */
	setSize(x, y) {
		if (!this.canvas) return;
		this.canvas.width = x;
		this.canvas.height = y;
		this.fitting = false;
	}
	/**
	 * @param {Color} color
	 */
	setBgColor(color) {
		if (color instanceof Color) {
			this.bgColor = color.toHex();
		} else {
			console.warn('Invalid color. Must be an instance of Color object');
		}
	}
	#resizeCanvas(c) {
		if (!this.canvas) return;
		if (this.fitting) {
			c.width = c.parentElement.clientWidth;
			c.height = c.parentElement.clientHeight;
		}
		this.width = this.canvas.width;
		this.height = this.canvas.height;
	}
}

/**
 * @param {number} num
 * @returns {number}
 */
function abs(num) {
	return Math.abs(num);
}

/**
 * @param {number} x 
 * @param {number} y 
 * @returns {number}
 */
function pythag(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/***
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
function distance(p1, p2) {
	return pythag(p1.x - p2.x, p1.y - p2.y);
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function atan2(x, y) {
	return Math.atan2(y, x);
}

/**
 * @param {number} deg 
 * @returns {number}
 */
function degToRad(deg) {
	return (deg * Math.PI) / 180;
}

/**
 * @param {number} rad 
 * @returns {number}
 */
function radToDeg(rad) {
	return (rad * 180) / Math.PI;
}

/**
 * @param {Function} callback1 - called when t is 0
 * @param {Function} callback2 - called every frame until the animation is finished
 * @param {Function} callback3 - called after animation is finished
 * @param {number} t - animation time (seconds)
 * @returns {Promise}
 */
function transitionValues(callback1, callback2, callback3, t) {
	return new Promise((resolve, reject) => {
		if (t == 0) {
			callback1();
			resolve();
		} else {
			const startTime = Date.now();

			function changeLoop() {
				setTimeout(() => {
					callback2();
					if (Date.now() - startTime < t * 1000) {
						changeLoop();
					} else {
						callback3();
						resolve();
					}
				}, 1000 / fps);
			}
			changeLoop();
		}
	});
}
