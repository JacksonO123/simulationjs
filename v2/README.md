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

```javascript
simulation.add(
	/* element: SimulationElement */,
	/* id (optional): string */
);
```

**`removeWithObject()`**

To remove an element from the Simulation, use the `removeWithObject()` method.

```javascript
simulation.removeWithObject(
	/* element: SimulationElement */
);
```

**`removeWithId()`**

To remove an element from the Simulation with an id, use the `removeWithId()` method.

```javascript
simulation.removeWithId(
	/* id: string */
);
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

**`fitElement()`**

To resize the canvas to the size of the parent element, use the `fitElement()` method.

```javascript
simulation.fitElement();
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
	/* callback1: function */,
	/* callback2: function */
);
```

**`scale()`**

The `scale()` method allows you to scale the size of the square by a scalar.

```javascript
square.scale(
	/* scalar: number */,
	/* animation time (optional): number */
);
```

**`scaleWidth()`**

The `scale()` method allows you to scale the width of a square by a scalar.

```javascript
square.scaleWidth(
	/* scalar: number */,
	/* animation time (optional): number */
);
```

**`scaleHeight()`**

The `scaleHeight()` method allows you to scale the height of a square by a scalar.

```javascript
square.scaleHeight(
	/* scalar: number */,
	/* animation time (optional): number */
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

**`setRadius()`**

the `setRadius()` method allows you to set the radius of a circle to a specific number.

```javascript
circle.setRadius(
	/* amount: number */,
	/* animation time (optional): number */
)
```

**`scale()`**

the `scale()` method allows you to scale the radius of a circle by a scalar.

```javascript
circle.scale(
	/* scalar: number */,
	/* animation time (optional): number */
)
```

The `Circle` class has access to all methods of the `SimulationElement` class.

## Line

To create a Line object, use the `new Line()` method.

```javascript
const line = new Line(
	/* start: Point */,
	/* end: Point */,
	/* thickness: number */,
	/* color: Color */,
);
```

**`rotate()`**

The `rotate()` method allows you to rotate the line around the center of rotation (first point perameter), relative to the current rotation amount.

_**Note:**_ Angle perameter is in degrees

```javascript
line.rotate(
	/* angle: number */
);
```

**`rotateTo()`**

The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

_**Note:**_ Angle perameter is in degrees

```javascript
line.rotateTo(
	/* angle: number */
);
```

**`moveStart()`**

The `moveStart()` method moves the start point of the line.

```javascript
line.moveStart(
	/* position: Vector */,
);
```

**`moveEnd()`**

The `moveEnd()` method moves the end point of the line.

```javascript
line.moveEnd(
	/* position: Vector */,
);
```

**`moveTo()`**

The `moveTo()` method moves the line to a specific position.

```javascript
line.moveTo(
	/* position: Vector */,
);
```

**`move()`**

The `move()` method moves the line the amount specified. The movement is relative to the current position.

```javascript
line.move(
	/* position: Vector */,
);
```

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

**`normalize()`**

The `normalize()` method allows you to normalize the vector.

```javascript
vector.normalize();
```

**`multiply()`**

The `multiply()` method allows you to multiply the vector by a scalar.

```javascript
vector.multiply(
	/* scalar: number */
);
```

**`multiplyX()`**

The `multiplyX()` method allows you to multiply the `x` component of a vector.

```javascript
vector.multiplyX(
	/* amount: number */
)
```

**`multiplyY()`**

The `multiplyY()` method allows you to multiply the `y` component of a vector.

```javascript
vector.multiplyY(
	/* amount: number */
)
```

**`divide()`**

The `divide()` method allows you to divide the vector by a scalar.

```javascript
vector.divide(
	/* scalar: number */
);
```

**`appendMag()`**

The `appendMag()` method allows you to scale the length of a vector up and down a specific amount.

```javascript
vector.appendMag(
	/* amount: number */
);
```

**`appendX()`**

The `appendX()` method allows you to append to the `x` component of a vector a specific amount.

```javascript
vector.appendX(
	/* amount: number */
);
```

**`appendY()`**

The `appendY()` method allows you to append to the `y` component of a vector a specific amount.

```javascript
vector.appendY(
	/* amount: number */
);
```

**`setMag()`**

The `setMag()` method allows you to set the magnitude of a vector to a specific amount.

```javascript
vector.setMag(
	/* amount: number */
);
```

**`clone()`**

The `clone()` method allows you to clone a vector and all of its component info.

```javascript
vector.clone();
```

# Utility Objects/Functions

## SceneCollection

The `SceneCollection` is an object used to group object in the scene.

```javascript
const sceneCollection = new SceneCollection(
	/* name (optional): string */
);
```

**`add()`**

The `add()` method allows you to add an object to the scene collection.

```javascript
sceneCollection.add(
	/* object: SimulationElement */,
	/* id (optional): string */
);
```

**`removeWithObject()`**

The `removeWithObject()` method allows you to remove an object from the scene collection.

```javascript
sceneCollection.removeWithObject(
	/* object: SimulationElement */
);
```

**`removeWithId()`**

The `removeWithId()` method allows you to remove an object from the scene collection using the id defined when adding the element to the collection.

```javascript
sceneCollection.removeWithId(
	/* id: string */
);
```

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

TODO:
- add animations to various methods of shapes