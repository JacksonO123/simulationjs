const canvas = new Simulation('canvas');
canvas.fitElement();

const collection = new SceneCollection();
canvas.add(collection);

const circle = new Circle(new Point(150, 150), 50, new Color(0, 0, 255));
collection.add(circle);

const square = new Square(new Point(350, 400), 100, 200, new Color(255, 0, 0), 50, 100);
collection.add(square, 'sq');

const poly = new Polygon(new Point(600, 600), [
	new Point(0, 0),
	new Point(100, 0),
	new Point(100, 200),
	new Point(0, 100)
], new Color(0, 255, 0));
canvas.add(poly);

const line = new Line(new Point(100, 100), new Point(0, 0), 4, new Color(0, 255, 255));
canvas.add(line);

circle.on('hover', () => {
	circle.fill(new Color(255, 0, 0));
}, () => {
	circle.fill(new Color(0, 0, 255));
});

square.on('hover', () => {
	square.fill(new Color(0, 255, 0));
}, () => {
	square.fill(new Color(255, 0, 0));
});

// square.setNodeVectors(true);

async function scale() {
	await square.scaleWidth(2, 1);
	await square.scaleHeight(2, 2);
	async function rotate() {
		setTimeout(() => {
			square.rotate(0.5);
			rotate();
		}, 1000 / fps);
	}
	rotate();
}
scale();

async function changeColor() {
	await circle.fill(new Color(0, 255, 0), 1);
	await circle.fill(new Color(0, 0, 255), 1);
	await circle.fill(new Color(255, 0, 0), 1);
	changeColor();
}
changeColor();

function rotate() {
	setTimeout(() => {
		poly.rotate(2);
		line.rotate(2);
		rotate();
	}, 1000 / fps);
}
rotate();
