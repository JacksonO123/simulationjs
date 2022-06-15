# Simulation.js v2

Simulation.js is a simple JavaScript library for making graphics in the html canvas.

# Getting started

To use Simulation.js, you need to include the `Simulation.js` file in the head tag of your html file.

```html
<head>
  <script src="simulation.js"></script>
</head>
```

# Creating a new Simulation

Using `new Simulation()` method allows you to create a new simulation.

```javascript
const simulation = new Simulation(
	/* id of canvas: string */,
	/* frame rate: number */
);
```

**`add()`**

To add an element to the Simulation, use the `add()` method. You are able to add any objects that inherite the `SimulationElement` class, as well as any graphical object provided by simulation.js.

Example with a circle:

```javascript
const circle = new Circle(
	/* position: Point */,
	/* radius: number */,
	/* color: Color */
);
simulation.add(circle);
```

**`on()`**

To add events to the simulation, use the `on()` method.

```javascript
simulation.on(
	/* event: string */,
	/* callback: function */
);
```

**`setSize()`**

To set the size of the simulation, use the `setSize()` method.

```javascript
simulation.setSize(
	/* width: number */,
	/* height: number */
);
```

**`fitWindow()`**

To fullscreen the simulation, use the `fitWindow()` method.

```javascript
simulation.fitWindow();
```

# Provided Objects

## SimulationElement

`SimulationElement` is the base class for all objects that can be added to the simulation. It contains a position and color, along with general methods such as moving, and changing color.

**`move()`**

The `move()` method moves the element the amount specified. The movement is relative to the current position

```javascript
element.move(
	/* position: Vector */,
	/* animation time (optional): number */
);
```

**`fill()`**

The `fill()` method changes the color of the element.

```javascript
element.fill(
	/* color: Color */,
	/* animation time (optional): number */
);
```

**`setPosition()`**

the `setPosition()` method sets the position of the element.

```javascript
element.setPosition(
	/* position: vector */,
	/* aimation time (optional): number */
);
```

## Square

To create a Square object, use the `new Square()` method. Note that the `position` is the center of the square.

```javascript
const square = new Square(
	/* position: Point */,
	/* width: number */,
	/* height: number */,
	/* color: Color */,
	/* rotationOffsetX (optional): number */,
	/* rotationOffsetY (optional): number */,
	/* rotation (optional): number */,
);
```

**`setNodeVectors()`**

the `setNodeVectors()` method allows you to see the vectors from the center of rotation to each of the square's verticies.

```javascript
square.setNodeVectors();
```

**`rotate()`**

The `rotate()` method allows you to rotate the square around the center of rotation, relative to the current rotation amount.

_**Note:**_ Angle perameter is in degrees

```javascript
square.rotate(
	/* angle: number */
);
```

**`rotateTo()`**
The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

_**Note:**_ Angle perameter is in degrees

```javascript
square.rotateTo(
  /* angle: number */
);
```

**`on()`**

The `on()` method allows you to add events to the square. Valid events include `click`, `mousemove`, `hover`.

```javascript
square.on(
	/* event: string */,
	/* callback: function */
);
```

The hover event requires two callback functions, one for the mouseover event, and one for the mouseleave event.

```javascript
square.on(
	/* event: string */,
	/* callback1: function */
	/* callback2: function */
);
```

The `Square` class has access to all methods of the `SimulationElement` class.

## Circle

To create a Circle object, use the `new Circle()` method. Note that the `position` is the center of the circle.

```javascript
const circle = new Circle(
	/* position: Point */,
	/* radius: number */,
	/* color: Color */,
);
```

**`on()`**

The `on()` method allows you to add events to the square. Valid events include `click`, `mousemove`, `hover`.

```javascript
circle.on(
	/* event: string */,
	/* callback: function */
);
```

The hover event requires two callback functions, one for the mouseover event, and one for the mouseleave event.

```javascript
circle.on(
	/* event: string */,
	/* callback1: function */
	/* callback2: function */
);
```

The `Circle` class has access to all methods of the `SimulationElement` class.

## Polygon

To create more complicated shapes, use the `Polygon` oject.

```javascript
const poly = new Polygon(
	/* position: Point */,
	/* points: Point[] */,
	/* rotation: number */,
	/* rotationOffsetX: number */,
	/* rotationOffsetY: number */
);
```

**`rotate()`**

The `rotate()` method allows you to rotate the polygon around the center of rotation, relative to the current rotation amount.

_**Note:**_ Angle perameter is in degrees

```javascript
poly.rotate(
	/* angle: number */
);
```

**`rotateTo()`**

The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

_**Note:**_ Angle perameter is in degrees

```javascript
poly.rotateTo(
  /* angle: number */
);
```

The `Polygon` object does not support events due to the possible complexity of the shape.

## Vector

To create a vector, use the `new Vector()` method.

```javascript
const vector = new Vector(
	/* x: number */,
	/* y: number */,
	/* rotation (optional): number */
);
```

_**Note:**_ The `rotation` parameter is in degrees

**`rotate()`**

The `rotate()` method allows you to rotate the vector relative to the current rotation amount.

```javascript
vector.rotate(
  /* angle: number */
);
```

**`rotateTo()`**

The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

```javascript
vector.rotateTo(
  /* angle: number */
);
```

# Utility Objects/Functions

## Point

The point class is used for representing a point in 2D space.

```javascript
const point = new Point(
	/* x: number */,
	/* y: number */
);
```

The point class inherits methods from Vector class.

## Vector

The vector class is used for representing a vector in 2D space.

```javascript
const vector = new Vector(
	/* x: number */,
	/* y: number */,
	/* rotation (optional): number */
);
```

_**Note:**_ The `rotation` parameter is in degrees

**`rotate()`**

The `rotate()` method allows you to rotate the vector relative to the current rotation amount.

```javascript
vector.rotate(
  /* angle: number */
);
```

**`rotateTo()`**

The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

```javascript
vector.rotateTo(
  /* angle: number */
);
```

**`format()`**

The `format()` method allows you to format a vector into a string.

## Color

The color class is used for representing a color with rgb values.

```javascript
const color = new Color(
	/* r: number */,
	/* g: number */,
	/* b: number */
);
```
