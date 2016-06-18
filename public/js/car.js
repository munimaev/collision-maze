var Car = function(texture) {
	this.cSpeed = 0;
	this.cAcceleration = 0.085;
	this.cReverse = 0.09;
	this.cMaxSpeed = 4;
	this.cRotationStep = 0.1;
	this.cFrictionForce = 0.04;
	PIXI.Sprite.apply(this, arguments);
	this.cOutR = Math.sqrt(Math.pow(this.height,2) + Math.pow(this.width,2)) / 2;
	this.cKeys = {};
	console.log(this)
}

Car.prototype = Object.create(PIXI.Sprite.prototype);
Car.prototype.constructor =  Car;

Car.prototype.move =  function() {
	var lastSpeed = 0;
	var lastRotation = 0;
	var lastDeltaX = 0;
	var lastDeltaY = 0;
	var preX = 0;
	var preY = 0;
	return function() {
		var startX =  this.position.x;
		var startY =  this.position.y;
		// var cl1 = this.cSpeed;
		var speedWithFriction = this.cSpeed >=  0 ? this.cSpeed - this.cFrictionForce :  this.cSpeed + this.cFrictionForce;
		if (speedWithFriction <= this.cFrictionForce && speedWithFriction >= -1 * this.cFrictionForce) {
			speedWithFriction = 0;
		} 

		// var cl2 = this.cSpeed;
		// console.log(speedWithFriction)

		var newDeltaX = Math.cos(this.rotation) * speedWithFriction / 1.25;
		var newDeltaY = Math.sin(this.rotation) * speedWithFriction / 1.25;
		

		this.position.y = preX = this.position.y-newDeltaX-lastDeltaX*(this.cSpeed/this.cMaxSpeed);
		this.position.x = preY = this.position.x+newDeltaY+lastDeltaY*(this.cSpeed/this.cMaxSpeed);

		var clx1 = this.position.x;
		var cly1 = this.position.y;

		// this.collision({x:startX,y:startY},{x:preX,y:preY});
		if (this.collision()) {
			
			if (this.collision()) {
				this.collision()
			}		
		}		


		lastDeltaX = newDeltaX;
		lastDeltaY = newDeltaY;

		this.cSpeed = speedWithFriction;

		// var clx2 = this.position.x;
		// var cly2 = this.position.y;

		// var cl3 = this.cSpeed;
		// console.log(clx1, cly1, clx2, cly2)
	}
}()

Car.prototype.cAccelerate = function(rev) {
	
	if (rev ) {
		this.cSpeed -= this.cReverse;
	} else {
		this.cSpeed += this.cAcceleration;
	}

	if (this.cSpeed > this.cMaxSpeed) {
		this.cSpeed = this.cMaxSpeed;
	}  
	if (this.cSpeed < -3.5) {
		this.cSpeed = -3.5;
		// console.log(this.cSpeed)
	}  
	else {
		// console.log('msg')
	}
}
Car.prototype.cRotate = function(d) {
	var r = this.cRotationStep > this.cSpeed / 50 ? this.cSpeed / 50 : this.cRotationStep;
	this.rotation += r * d;
}
/*
s1 = {x:0,y:0,r:0}
*/
var collision2Circle = function(s1,s2) {
	var dx = s1.x > s2.x ? s1.x - s2.x : s2.x - s1.x;
	var dy = s1.y > s2.y ? s1.y - s2.y : s2.y - s1.y;
	var dr = Math.sqrt(Math.pow(dy,2) + Math.pow(dx,2));
	return dr <= s1.r + s2.r ? true : false;
}
/*
r = {x:0, y:0, a:0, w:0, h:0}
*/
var collision2Rect = function(r1,r2) {
	/*r1 it is car */
	var maxColiionR1 = maxColiionRadius(r1);
	var maxColiionR2 = maxColiionRadius(r2);
	var maxColiionDistance = maxColiionR1  + maxColiionR2;

	var currentDistance = getDistance(r1,r2);


	if (currentDistance >= maxColiionDistance) {
		return false;
	}



	var A = {
		x: r2.position.x,
		y: r2.position.y-100,
	};
	var B = {
		x: r2.position.x,
		y: r2.position.y,
	};
	var C = {
		x: r1.position.x,
		y: r1.position.y,
	};
	var distanceAngle = find_angle(A,B,C);
	if (C.x < B.x) {
		distanceAngle = 2 * Math.PI - distanceAngle;
	}

	var dist1 = getDistanceInRectangle(r1,distanceAngle)
	var dist2 = getDistanceInRectangle(r2,distanceAngle)
	var distSum = dist1 + dist2 ;
	if (dist1 + dist2  >= currentDistance) {
		r1.position.x = r2.position.x + distSum * Math.sin(distanceAngle);
		r1.position.y = r2.position.y - distSum * Math.cos(distanceAngle);
		return true;
	} 
	return false;

}

var maxColiionRadius = function(r) {
	return Math.sqrt(r.height*r.height+r.width*r.width) / 2;
}

var getDistance = function(r1,r2) {
	var x = r1.position.x > r2.position.x ? r1.position.x - r2.position.x : r2.position.x - r1.position.x;
	var y = r1.position.y > r2.position.y ? r1.position.y - r2.position.y : r2.position.y - r1.position.y;
	return Math.sqrt(x*x+y*y);
}

var getVertices = function(r) {

	/*

	D--A
	|  |
	C--B

	*/

	var result = {
		A:{x:null,y:null},
		B:{x:null,y:null},
		C:{x:null,y:null},
		D:{x:null,y:null},
	}

	var cos = Math.cos(r.rotation);
	var sin = Math.sin(r.rotation);


	result.A.x = r.position.x + ((r.width/2)*Math.cos(r.rotation) + (r.height/2)*Math.sin(r.rotation));;
	result.A.y = r.position.y + ((r.width/2)*Math.sin(r.rotation) -(r.height/2)*Math.cos(r.rotation));;

	result.B.x = r.position.x + ((r.width/2)*Math.cos(r.rotation) - (r.height/2)*Math.sin(r.rotation));
	result.B.y = r.position.y + ((r.width/2)*Math.sin(r.rotation) + (r.height/2)*Math.cos(r.rotation));

	result.C.x = r.position.x + (-(r.width/2)*Math.cos(r.rotation) - (r.height/2)*Math.sin(r.rotation));
	result.C.y = r.position.y + (-(r.width/2)*Math.sin(r.rotation) + (r.height/2)*Math.cos(r.rotation));

	result.D.x = r.position.x + (-(r.width/2)*Math.cos(r.rotation) + (r.height/2)*Math.sin(r.rotation));
	result.D.y = r.position.y + (-(r.width/2)*Math.sin(r.rotation) - (r.height/2)*Math.cos(r.rotation));

	return result;
}

var getDistanceInRectangle = function(r,a, l) {
	var a = a - r.rotation;
	var PIx2 = Math.PI * 2;
	while (a < 0) {
		a = a + PIx2;
	}
	while (a > PIx2) {
		a = a - PIx2;
	}
	if (l) 	console.log(a, r.rotation)
	var halfHeight = r.height/2;
	var halfWidth  = r.width/2; 

	var preDeltaX = r.width/2  * Math.sin(a);
	var preDeltaY = r.height/2 * Math.cos(a);
	
 	var cart = 0;
 	var dist1 = 0;
 	var smallAngle = find_angle({x:0,y:halfHeight},{x:0,y:0},{x:halfWidth,y:halfHeight});

	if (a > Math.PI * 2 - smallAngle || a <= smallAngle ) { //  Math.PI/4
		dist1 = halfHeight / Math.cos(a)
	}
	else if  (a > smallAngle && a <= Math.PI - smallAngle ) {
		dist1 = halfWidth / Math.sin(a)
	}
	else if  (a > Math.PI - smallAngle && a <= Math.PI + smallAngle ) {
		dist1 = -1 * halfHeight / Math.cos(a)
	}
	else if  (a > Math.PI + smallAngle && a <= 2 * Math.PI - smallAngle ) {
		dist1 = -1 * halfWidth / Math.sin(a)
	}
	return dist1;
} 

function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

Car.prototype.speedChangeAfterCollizion = function(Start,Medium,Finish) {

}

Car.prototype.collision = function() {
	var hasColision = false;
	var l = allObjStatic.length;
	var arrToRemove = [];
	for (var i = 0; i < l; i++) {
		if (allObjStatic[i].cType == 'Ghost'
			|| allObjStatic[i].position.x > this.position.x + 100 
			|| allObjStatic[i].position.x < this.position.x - 100
			|| allObjStatic[i].position.y > this.position.y + 100
			|| allObjStatic[i].position.y < this.position.y - 100
		) {
			continue;
		}
		if (allObjStatic[i].cType == 'colon') {

			var col = collision2Circle({
				x: allObjStatic[i].position.x,
				y: allObjStatic[i].position.y,
				r: 24
			}, {
				x: this.position.x,
				y: this.position.y,
				r: this.cOutR
			});

			if (col) {
				var A = {
					x: allObjStatic[i].position.x,
					y: allObjStatic[i].position.y,
				};

				var B = {
					x: this.position.x,
					y: this.position.y,
				};

				var C = {
					x: A.x < B.x && A.y < B.y ? B.x : A.x,
					y: A.x < B.x && A.y < B.y ? A.y : B.y,
				};

				var beta = find_angle(A,B,C);
				var deltaCos = Math.cos(beta)*(this.cOutR+24);
				var deltaSin = Math.sin(beta)*(this.cOutR+24);

				if (A.x < B.x && A.y < B.y) {	
					this.position.x =A.x+deltaSin;
					this.position.y =A.y+deltaCos;
				} else if (A.x > B.x && A.y > B.y) {
					this.position.x =A.x-deltaCos;
					this.position.y =A.y-deltaSin;
				} else if (A.x > B.x && A.y < B.y) {
					this.position.x =A.x-deltaCos;
					this.position.y =A.y+deltaSin;
				} else {
					this.position.x =A.x+deltaCos;
					this.position.y =A.y-deltaSin;
				}

				
			hasColision = true;    
			}
		}

		if (allObjStatic[i].cType == 'rect' ) {
			var col = collision2Rect(this, allObjStatic[i]);  
			if (col) {

			hasColision = true;      
		
			}    
		}

		if (allObjStatic[i].cType == 'Finish' ) {
			var col = collision2Rect(this, allObjStatic[i]);  
			if (col) {
				finish();
			}    
		}

		if (allObjStatic[i].cType == 'Lock' && !this.cKeys[allObjStatic[i].cColor]) {
			var col = collision2Rect(this, allObjStatic[i]);
			if (col) {

			hasColision = true;      
		
			}    
		}

		if (allObjStatic[i].cType == 'Key') {
			var col = collision2Circle({
				x: allObjStatic[i].position.x,
				y: allObjStatic[i].position.y,
				r: allObjStatic[i].height / 2
			}, {
				x: this.position.x,
				y: this.position.y,
				r: this.cOutR-2
			});
			console.log(col);
			if (col) {
				this.cKeys[allObjStatic[i].cColor] = true;
        		stage.removeChild( allObjStatic[i]);
        		arrToRemove.push(i);

        		var count = 0;
        		for (var j in this.cKeys) {
        			if (this.cKeys[j]) count++;
        		}

		        var textures = {
		            B : 'Black',
		            G : 'Green',
		            Y : 'Yellow',
		            U : 'Blue'
		        }
	
		        var C = allObjStatic[i].cColor;
		        var myRect = new Key(PIXI.Texture.fromImage("public/pics/key"+textures[C]+".png"),C);
		        myRect.anchor.x = 0.5;
		        myRect.anchor.y = 0.5;
		        myRect.position.x = renderWidth - (40 * count ) + 8;
		        myRect.position.y = renderHeight - 32; 
		        stage.addChild(myRect);
			    

			}
		}



	// var vertices1 = getVertices(this);


	// pointA.position.x = vertices1.A.x;
	// pointA.position.y = vertices1.A.y;
	
	// pointB.position.x = vertices1.B.x;
	// pointB.position.y = vertices1.B.y;

	// pointC.position.x = vertices1.D.x;
	// pointC.position.y = vertices1.D.y;


	}
	for (var i = arrToRemove.length -1; i >=0 ; i--) {
		allObjStatic.splice(arrToRemove[i],1)
	}
	return hasColision;
}


function finish() {
	endTime = new Date();
	var sec = (endTime - startTime) / 1000;
	var min = Math.floor(sec / 60);
	sec = Math.round(sec % 60) ;
	alert("Выход найден за "+min+" минут "+sec+" секунд.")
}