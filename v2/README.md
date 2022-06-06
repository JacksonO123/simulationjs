# Simulation.js v2

Simulation.js is a simple JavaScript library for making graphics in the html canvas.

# Getting started

To use Simulation.js, you need to include the `Simulation.js` file in the head tag of your html file.

```
<head>
	<script src="simulation.js"></script>
</head>
```

# Creating a new Simulation

Using `new Simulation()` method allows you to create a new simulation.

```
const simulation = new Simulation(
	/* id of canvas: string */,
	/* frame rate: number */
);
```

**`add()`**

To add an element to the Simulation, use the `add()` method. You are able to add any objects that inherite the `SimulationElement` class, as well as any graphical object provided by simulation.js.

Example with a circle:

```
const circle = new Circle(
	/* position: Point */,
	/* radius: number */,
	/* color: Color */
);
simulation.add(circle);
```

**`on()`**

To add events to the simulation, use the `on()` method.

```
simulation.on(
	/* event: string */,
	/* callback: function */
);
```

**`setSize()`**

To set the size of the simulation, use the `setSize()` method.

```
simulation.setSize(
	/* width: number */,
	/* height: number */
);
```

**`fitWindow()`**

To fullscreen the simulation, use the `fitWindow()` method.

```
simulation.fitWindow();
```

# Provided Objects

## SimulationElement

`SimulationElement` is the base class for all objects that can be added to the simulation. It contains a position and color, along with general methods such as moving, and changing color.

**`move()`**

The `move()` method moves the element the amount specified. The movement is relative to the current position

```
element.move(
	/* position: Vector */,
	/* animation time (optional): number */
);
```

**`fill()`**

The `fill()` method changes the color of the element.

```
element.fill(
	/* color: Color */,
	/* animation time (optional): number */
);
```

**`setPosition()`**

the `setPosition()` method sets the position of the element.

```
element.setPosition(
	/* position: Vector */,
	/* aimation time (optional): number */
);
```

## Square

To create a Square object, use the `new Square()` method. Note that the `position` is the center of the square.

```
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

```
square.setNodeVectors();
```

**`rotate()`**

The `rotate()` method allows you to rotate the square around the center of rotation, relative to the current rotation amount.

_**Note:**_ Angle perameter is in degrees

```
square.rotate(
	/* angle: number */
);
```

**`rotateTo()`**
The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

_**Note:**_ Angle perameter is in degrees

```
square.rotateTo(
	/* angle: number */
);
```

The `Square` class has access to all methods of the `SimulationElement` class.

## Circle

To create a Circle object, use the `new Circle()` method. Note that the `position` is the center of the circle.

```
const circle = new Circle(
	/* position: Point */,
	/* radius: number */,
	/* color: Color */,
);
```

The `Circle` class has access to all methods of the `SimulationElement` class.

## Vector

To create a vector, use the `new Vector()` method.

```
const vector = new Vector(
	/* x: number */,
	/* y: number */,
	/* rotation (optional): number */
);
```

_**Note:**_ The `rotation` parameter is in degrees

**`rotate()`**

The `rotate()` method allows you to rotate the vector relative to the current rotation amount.

```
vector.rotate(
	/* angle: number */
);
```

**`rotateTo()`**

The `rotateTo()` method allows you to set the current rotation amount to a specific angle.

```
vector.rotateTo(
	/* angle: number */
);
```
