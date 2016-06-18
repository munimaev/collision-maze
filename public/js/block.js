var Block = function(texture) {
	this.cType = this.cType;
	PIXI.Sprite.apply(this, arguments);
}

Block.prototype = Object.create(PIXI.Sprite.prototype);
Block.prototype.constructor =  Block;


var Colon = function(texture) {
	this.cType = 'colon';
	Block.apply(this, arguments);
}

Colon.prototype = Object.create(Block.prototype);
Colon.prototype.constructor =  Colon;



var Rect = function(texture) {
	this.cType = this.cType || 'rect';
	Block.apply(this, arguments);
}

Rect.prototype = Object.create(Block.prototype);
Rect.prototype.constructor =  Rect;


var Ghost = function(texture) {
	this.cType = this.cType || 'Ghost';
	Block.apply(this, arguments);
}

Ghost.prototype = Object.create(Block.prototype);
Ghost.prototype.constructor =  Ghost;



var Finish = function(texture) {
	this.cType = 'Finish';
	Rect.apply(this, arguments);
}

Finish.prototype = Object.create(Rect.prototype);
Finish.prototype.constructor =  Finish;



var Lock = function(texture, color) {
	this.cType = 'Lock';
	this.cColor = color;
	Rect.apply(this, arguments);
}

Lock.prototype = Object.create(Rect.prototype);
Lock.prototype.constructor =  Lock;


var Key = function(texture, color) {
	this.cType = 'Key';
	this.cColor = color;
	Rect.apply(this, arguments);
}

Key.prototype = Object.create(Rect.prototype);
Key.prototype.constructor =  Key;

