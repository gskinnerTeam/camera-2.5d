/*
* Camera 2.5d
* By http://gskinner.com/
*
* Copyright (c) 2016 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/**
 * @module gskinner
 */
(function(scope) {

	/**
	 * A camera class that provides a 2.5d display list to a set of sprites. Sprites maintain underscore-prefixed
	 * properties for position and scale transformation, which are turned into a 2.5d view. Rotation on the x and y-axis
	 * is not supported.
	 * @class Camera
	 * @param {Array} points A list of objects to position in 2.5d.
	 * @param {Container} container An optional EaselJS container to sort. This should be provided if all the points are
	 * 	in the same container.
	 * @constructor
	 */
	function Camera(points, container) {
		/**
		 * The x position of the Camera
		 * @property x
		 * @type {number}
		 * @default 0
		 */
		this.x = 0;
		/**
		 * The y position of the Camera
		 * @property y
		 * @type {number}
		 * @default 0
		 */
		this.y = 0;
		/**
		 * The z position of the Camera
		 * @property z
		 * @type {number}
		 * @default 0
		 */
		this.z = 0;
		this.hRotation = 0;
		this.minZ = 10;
		/**
		 * The focal distance of the Camera.
		 * @property focalDistance
		 * @type {number}
		 * @default 300
		 */
		this.focalDistance = 300;

		/**
		 * A list of objects to position in 2.5d.
		 * @property points
		 * @type {Array}
		 */
		this.points = points;

		/**
		 * An optional container to sort.
		 * @property container
		 * @type createjs.Container
		 */
		this.container = container;
	}

	var p = Camera.prototype;
	var s = Camera;

	/**
	 * Update the sprite list. Remember to run this before updating the EaselJS stage.
	 * @method update
	 */
	p.update = function () {
		var l = this.points.length;
		while (l--) {
			var point = this.points[l];
			if (point.hidden) { continue; }
			point.visible = (point._z > this.z);

			var newZ = Math.max(this.minZ, point._z - this.z);
			var newX = point._x - this.x;
			var newY = point._y - this.y;

			var angle = Math.atan2(newX, newZ) - this.hRotation;
			var dist = Math.sqrt((newX * newX) + (newZ * newZ));
			newX = Math.sin(angle) * dist;
			newZ = Math.max(5, Math.cos(angle) * dist);
			var factor = this.focalDistance / newZ;
			point.scaleX = point.scaleY = factor * 0.40;
			point.scaleX *= point._scaleX;
			point.scaleY *= point._scaleY;
			point.x = newX * factor;
			point.y = newY * factor;
			point.d = dist;
		}
		if (this.container) { this.container.children.sort(s.depthSort); }
	};

	s.depthSort = function (a, b) {
		return b.d - a.d;
	};

	scope.Camera = Camera;

	
// *************** Helper Classes ************** //
	
	/**
	 * An EaselJS Container that already supports the required properties for the Camera class.
	 * @class ContainerSprite
	 * @extends createjs.Container
	 * @constructor
	 */
	function ContainerSprite() {
		this.Container_constructor();
		this._x = this._y = this._z = 0;
		this._scaleX = this._scaleY = 1;
	}
	var p = createjs.extend(ContainerSprite, createjs.Container);
	p.clone = function(recursive) {
		return this.Container_clone(recursive)
				.set({_x:this._x, _y:this._y, _z:this._z, _scaleX:this._scaleX, _scaleY:this._scaleY});
	};
	createjs.promote(ContainerSprite, "Container");
	scope.ContainerSprite = ContainerSprite;

	/**
	 * An EaselJS Shape that already supports the required properties for the Camera class.
	 * @class ShapeSprite
	 * @extends createjs.Shape
	 * @constructor
	 */
	function ShapeSprite(graphics) {
		this.Shape_constructor(graphics);
		this._x = this._y = this._z = 0;
		this._scaleX = this._scaleY = 1;
	}
	var p = createjs.extend(ShapeSprite, createjs.Shape);
	p.clone = function() {
		return this.Shape_clone()
				.set({_x:this._x, _y:this._y, _z:this._z, _scaleX:this._scaleX, _scaleY:this._scaleY});
	};
	createjs.promote(ShapeSprite, "Shape");
	scope.ShapeSprite = ShapeSprite;

	/**
	 * An EaselJS Bitmap that already supports the required properties for the Camera class.
	 * @class BitmapSprite
	 * @extends createjs.Bitmap
	 * @constructor
	 */
	function BitmapSprite(img) {
		this.Bitmap_constructor(img);
		this._x = this._y = this._z = 0;
		this._scaleX = this._scaleY = 1;
	}
	var p = createjs.extend(BitmapSprite, createjs.Bitmap);
	p.clone = function() {
		return this.Bitmap_clone()
				.set({_x:this._x, _y:this._y, _z:this._z, _scaleX:this._scaleX, _scaleY:this._scaleY});
	};
	createjs.promote(BitmapSprite, "Bitmap");
	scope.BitmapSprite = BitmapSprite;

}(window));