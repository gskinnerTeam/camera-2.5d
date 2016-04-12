# camera-2.5d
An EaselJS/Canvas approach to 2.5d. Based on an old Flash experiment by [@gskinner](http://gskinner.com)

Camera2.5d provides a viewport class that assists with layering, positioning, and scaling sprites to create a pseudo-
3d display. Sprites use transformation properties prefixed with an underscore instead of the typical properties, which
are then translated to a 2.5d space.

### Sprite properties:

* **_x:** The 2d x-axis position
* **_y:** The 2d y-axis position
* **_z:** The 2d z-axis position
* **_scaleX:** The 2d horizontal scale
* **_scaleY:** The 2d vertical scale

The un-prefixed properties should no longer be used on sprites that the camera is controlling.

## Classes
These public classes are included in Camera.js:

* **Camera:** The main display camera that controls all the points
* **ContainerSprite:** An EaselJS Container class that provides `_x`, `_y`, `_z`, `_scaleX`, and `_scaleY`
* **ShapeSprite:** An EaselJS Shape class that provides `_x`, `_y`, `_z`, `_scaleX`, and `_scaleY`
* **BitmapSprite:** An EaselJS Bitmap class that provides ``_x`, `_y`, `_z`, `_scaleX`, and `_scaleY`

Note that the any EaselJS DisplayObject can be used, and the helper classes aren't required, but they are useful, since
they already have default values, and can be properly cloned.

## Sample

Instantiate a few different display classes, add them to the Camera, and update the stage.

	var bmp = new BitmapSprite("img.png");
	bmp._x = 100; bmp._z = -100;

	var shape = new ShapeSprite();
	shape.graphics.beginFill("red").drawCircle(0,0,25);
	shape._y = 100; shape._z = -50;
	shape._scaleX = shape._scaleY = 2;

	var container = new ContainerSprite();
	container._z = 100; // In front of camera, won't be visible.

	var sprites = [bmp, shape, container];
	var camera = new Camera(sprites);

	camera.focalDistance = 500;
	camera.x = 100; // Move the camera relative to the contents

	// Later, update the camera before updating the stage.
	camera.update();
	stage.update();


