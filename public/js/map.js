var Map = function(iniData) {
	this.$map = $('.map');
	this.$map0 = $('.map0');
	this.current ={
		rotationAngle : 45,
		rotationVerticalAngle : 60,
		rotationCubClass : 'rotate0'
	}
	this.H = 10;
	this.W = 10;
	this.S = 10;
	this.Spx = 1250 * this.S / 100 * 0.707106781187; 
	this.blocks = {};
	this.pers = {};
	this.fill(iniData.blocks);
	this.fillPers(iniData.pers);
	this.iniHotKeys();
}
Map.prototype.fill = function(blocks) {
	for (var y in blocks) {
		for (var x in blocks[y]) {
			for (var z in blocks[y][x]) {
				var cub = this.createCub(y,x,z,blocks[y][x][z]);
				var cubId = this.createCubId(x,y,z);
				this.blocks[cubId] = {
					id : cubId,
					$cub : cub
				}
				this.$map.append(cub)
			}
		}
	}
}
Map.prototype.createCubId = function(x,y,z) {
	return 'id_'+y+'_'+x+'_'+z+'';
}
Map.prototype.createCub = function(y,x,z,block) {
	var cub = $('<div />',{
		'class' : 'cub rotate0 ' + block
	})
	var tr = y*this.S;
	cub.css({
		'width' : this.S + '%',
		'height' : this.S + '%',
		'top' : 50 + z * this.S + '%',
		'left': 50 + x * this.S + '%',
		'transform' : 'translate3d(0,0,'+(this.Spx * y)+'px)'
	})

	var cubId = this.createCubId(x,y,z);
	var funcClick = function(){
		console.log(cubId);
	}
	cub.click(funcClick)
	return cub;
}

Map.prototype.fillPers = function(pers) {
	console.log(pers)
	for (var i in pers) {
		console.log(i, pers[i])
		var person = new Pers(i, pers[i], this);
		this.pers[i] = person;

	}
}

Map.prototype.createLayer = function() {
	var layer = $('<div />',{
		'class' : 'layer'
	})
	layer.css({
		'height' : this.H * this.S,
		'width' : this.W * this.S
	})
	return layer;
}
Map.prototype.rotation = function(args) {
	var args = args || {};
	var angle = args.hasOwnProperty('angle') ? args.angle : 90;

	var val = this.current.rotationAngle; 
	val = val + angle;
	while (val >= 360) {
		val = val -360;
	}
	while (val < 0) {
		val = val + 360;
	}
	var oldCubClass = this.current.rotationCubClass;
	var newCubClass = 'rotate0';

	if (val > 90 ) {
		newCubClass = 'rotate1'

	}
		if (val > 180 ) {
		newCubClass = 'rotate2'
	}
	if (val > 270 ) {
		newCubClass = 'rotate3'
	}

	this.current.rotationAngle = val;
	this.$map.attr('style', '-webkit-transform:rotate3d(0,0,1,'+val+'deg);')

	this.current.rotationCubClass = newCubClass;
	for (var i in this.blocks) {
		this.blocks[i].$cub.removeClass(oldCubClass);
		this.blocks[i].$cub.addClass(newCubClass);
	}
	for (var i in this.pers) {
		this.pers[i].mapRotation();
	}
}
Map.prototype.rotationVertical = function(args) {
	var args = args || {};
	var angle = args.hasOwnProperty('angle') ? args.angle : -10;

	var val = this.current.rotationVerticalAngle; 
	val = val + angle;
	while (val > 60) {
		val = 60;
	}
	while (val < 30) {
		val = 30;
	}

	this.current.rotationVerticalAngle = val;
	this.$map0.attr('style', '-webkit-transform:rotate3d(1,0,0,'+val+'deg);')

}
Map.prototype.iniHotKeys = function () {
	var $body = $('body');
	var _this = this;
	var func = function (e) {
		if (e.keyCode == 37 && e.ctrlKey) { //left
			_this.rotation();
			return false;
		}
		if (e.keyCode == 38 && e.ctrlKey) { //up
			_this.rotationVertical({angle:-10});
			return false;
		}
		if (e.keyCode == 39 && e.ctrlKey) { //right
			_this.rotation({angle:-90});
			return false;
		}
		if (e.keyCode == 40 && e.ctrlKey) { //down
			_this.rotationVertical({angle:10});
			return false;
		}
	}
	$body.keyup(func);
}