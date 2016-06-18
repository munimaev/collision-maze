var container, stats;
var camera, scene, renderer;
var particleMaterial;

var raycaster;
var mouse;

var objects = [];


var nextCameraAngle = 45;
var currentCameraAngle = 45;
var nextCameraVerticalAngle = 7.07;
var currentCameraVerticalAngle = 7.07;
var scale = 0.7;

var sprites = {

}
var levelMap = { // X Y Z
	'-3': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'-2': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'-1': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'0': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'10': { "init": {} }
		},
		'-1': {
			'5': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'1': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'2': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {"cost:":1} }
		},
		'2': {
			'0': { "init": {"cost:":1} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
	'3': {
		'-3': {
			'0': { "init": {} }
		},
		'-2': {
			'0': { "init": {} }
		},
		'-1': {
			'0': { "init": {} }
		},
		'0': {
			'0': { "init": {} }
		},
		'1': {
			'0': { "init": {} }
		},
		'2': {
			'0': { "init": {} }
		},
		'3': {
			'0': { "init": {} }
		}

	},
}


var map

init();
animate();

function Tile() {

	var _45 = 4.5*scale;
	var _05 = 0.5*scale;
	var _5 = 5*scale;

    var vertices = [
        new THREE.Vector3(_45,_05,_45),
        new THREE.Vector3(_45,_05,-_45),
        new THREE.Vector3(_5,0,_5),
        new THREE.Vector3(_5,0,-_5),
        new THREE.Vector3(-_45,_05,-_45),
        new THREE.Vector3(-_45,_05,_45),
        new THREE.Vector3(-_5,0,-_5),
        new THREE.Vector3(-_5,0,_5)
    ];

    var faces = [
        new THREE.Face3(0,2,1),
        new THREE.Face3(2,3,1),
        new THREE.Face3(4,6,5),
        new THREE.Face3(6,7,5),
        new THREE.Face3(4,5,1),
        new THREE.Face3(5,0,1),
        new THREE.Face3(7,6,2),
        new THREE.Face3(6,3,2),
        new THREE.Face3(5,7,0),
        new THREE.Face3(7,2,0),
        new THREE.Face3(1,3,4),
        new THREE.Face3(3,6,4),
    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;



    geom.computeBoundingBox();
    geom.mergeVertices();

    var materials = [
        // new THREE.MeshLambertMaterial( { opacity:0.6, color:  Math.random() * 0xffffff, transparent:false } ),
        // new THREE.MeshBasicMaterial( { color:  0xffcc00, wireframe: true } )
        new THREE.MeshBasicMaterial({
			color: Math.random() * 0xffffff,
			opacity: 1
		})

    ];
    return geom;
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom,materials);
    // mesh.children.forEach(function(e) {e.castShadow=true});
	//        mesh.children[0].translateX(0.5);
	//        mesh.children[0].translateZ(0.5);
	
	return mesh;
    // scene.add(mesh);
}
var tiles = [];
function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	var info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - clickable objects';
	container.appendChild(info);

	// camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
	// camera.position.set(0, 300, 500);
	camera =  new THREE.OrthographicCamera( 
            window.innerWidth / - 16, window.innerWidth / 16,
            window.innerHeight / 16, window.innerHeight / - 16,
            -200, 200 );
    camera.position.set(7.07, 12.07, 7.07);
	// camera.position.set(0, 1000, 500);
	
	scene = new THREE.Scene();


  var material = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture('public/pics/rainbow.jpg')
  });
  
  // loading manager
var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
    console.log( item, loaded, total );
};
            
	// load model
	var objLoader = new THREE.OBJLoader(manager);
	objLoader.load('public/models/cube.obj', function(object) {

	    // code for texture mapping, used later (see below)
	    /*
	    object.traverse( function ( child ) {
	        if ( child instanceof THREE.Mesh ) {
	            child.material.map = texture;
	        }
	    });
	    */

	    scene.add(object); 
	});


	var geometry = Tile();//new THREE.BoxGeometry(100, 100, 100);
	for (var x in levelMap) {
		for (var z in levelMap[x]) {
			for (var y in levelMap[x][z]) {
				
				var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
					color: 0x666666,// Math.random() * 0xffffff,
					opacity: 0.75
				}));
		

				object.position.x = x * 10 * scale;
				object.position.y = y * 1 * scale;
				object.position.z = z * 10 * scale;

				levelMap[x][z][y].obj = object;
				levelMap[x][z][y].step = 0;

				scene.add(object);

				objects.push(object);

			}
		}
	}
	// for (var i = 0; i < 100; i++) {

	// 	var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
	// 		color: Math.random() * 0xffffff,
	// 		opacity: 1
	// 	}));
	// 	// var object = Tile();
	// 	object.position.x = (-5 + i%10)*10 +5;
	// 	object.position.y = 0 ;// Math.random() * 800 - 400;
	// 	object.position.z = (-5 + Math.floor(i/10))*10 + 5;;

	// 	// object.scale.x = Math.random() * 2 + 1;
	// 	// object.scale.y = Math.random() * 2 + 1;
	// 	// object.scale.z = Math.random() * 2 + 1;

	// 	// object.rotation.x = Math.random() * 2 * Math.PI;
	// 	// object.rotation.y = Math.random() * 2 * Math.PI;
	// 	// object.rotation.z = Math.random() * 2 * Math.PI;

	// 	scene.add(object);

	// 	objects.push(object);

	// }



	var PI2 = Math.PI * 2;
	particleMaterial = new THREE.SpriteCanvasMaterial({

		color: 0x000000,
		program: function(context) {

			context.beginPath();
			context.arc(0, 0, 0.5, 0, PI2, true);
			context.fill();

		}

	});


		map = THREE.ImageUtils.loadTexture( "public/pics/sW.png" );
        var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
        sprites['char'] = new THREE.Sprite( material );

		sprites['char'].scale.x = sprites['char'].scale.y = 8;
		sprites['char'].position.set(0,5,0)

        scene.add( sprites['char'] );
	//

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0xf0f0f0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);

	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);

	//

	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentTouchStart(event) {

	event.preventDefault();

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown(event);
}

function onDocumentMouseDown(event) {

	event.preventDefault();

	mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
	mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {

		intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

		var particle = new THREE.Sprite(particleMaterial);
		particle.position.copy(intersects[0].point);
		particle.scale.x = particle.scale.y = 2;
		scene.add(particle);

	}

	/*
	// Parse all the faces
	for ( var i in intersects ) {

		intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

	}
	*/
}

function animate() {

	requestAnimationFrame(animate);

	render();
	stats.update();
}

var radius = 10;
var theta = 0;



function render() {

	if (currentCameraAngle !== nextCameraAngle) {
		currentCameraAngle += currentCameraAngle < nextCameraAngle ? 3 : -3;
		var rad = THREE.Math.degToRad(currentCameraAngle);
		camera.position.x = radius * Math.sin(rad) ;
		camera.position.z = radius * Math.cos(rad) ;
	}

	if (currentCameraVerticalAngle < nextCameraVerticalAngle
		&& currentCameraVerticalAngle / nextCameraVerticalAngle < 0.95) {

		currentCameraVerticalAngle += 0.2;
		camera.position.y = currentCameraVerticalAngle;
		console.log(camera.position.y)
	}
	else if (currentCameraVerticalAngle > nextCameraVerticalAngle
		&& nextCameraVerticalAngle / currentCameraVerticalAngle  < 0.95) {

		currentCameraVerticalAngle += -0.2;
		camera.position.y = currentCameraVerticalAngle;
	} 
	else {
		currentCameraVerticalAngle = nextCameraVerticalAngle;
	}


	camera.lookAt(scene.position);

	renderer.render(scene, camera);

}

$('body').keydown(function(e) {
	if (e.ctrlKey || true) {
		if (e.keyCode === 37) {//left 
			nextCameraAngle +=90;
		}
		if (e.keyCode === 39) {//right 
			nextCameraAngle -=90;
		}
		if (e.keyCode === 38) {//up 
			nextCameraVerticalAngle = 12.0;
		}
		if (e.keyCode === 40) {//down 
			nextCameraVerticalAngle  = 7.0;
		}
	}
})

var ps = {
	x : 0,
	y : 0,
	z : 0
};
var steps = {
	'0' : []
}
//set start
levelMap[ps.x][ps.z][ps.y].obj.material.color.setHex(0x660000);
levelMap[ps.x][ps.z][ps.y].step = 3;
var bigCount = 0;

// see on nord
function checkSide(x,z,y, step, maxstep, diagonal) {

	bigCount++;
	var ss = '';
	for (var i = step; maxstep >= i; i++ ) {
		ss += '- ';
	}
	// console.log(ss+'> ', x,y,z, step, maxstep)
	var arr = [
		[-1, 1,true]   , [ 0, 1, false] , [ 1, 1,true],
		[-1, 0, false] ,                  [ 1, 0, false],
		[-1,-1,true]   , [ 0,-1, false] , [ 1,-1,true]
	]
	if (step === maxstep) {
		levelMap[x][z][y].step = maxstep;
	}
	for (var s in arr) {

		// console.log(ss+'- ['+arr[s][0]+','+arr[s][1]+'] = ['+(x+arr[s][0])+','+(z+arr[s][1])+']' 
		// 	, levelMap.hasOwnProperty(x+arr[s][0]) 
		// 	, levelMap[x+arr[s][0]].hasOwnProperty([z+arr[s][1]]))

		var X = x+arr[s][0];
		var Z = z+arr[s][1];
		if (levelMap[X] && levelMap[X][Z]) {
			for (var i in levelMap[X][Z]) {

				var Y = parseInt(i);
				// console.log(ss+'> ',levelMap[X][Z][Y].step,  step, levelMap[X][Z][Y].step < step)

				var stepCost = 1;
				var yDelta = y-Y;
				yDelta *= yDelta < 0 ? -1 : 1;
				if (yDelta > 6) {
					stepCost +=10000;
				}
				else if (yDelta > 3) {
					stepCost += 1;
				}
				if (levelMap[X][Z][Y].hasOwnProperty)
				var newStep = step - stepCost;

				if (levelMap[X][Z][Y].step < step && stepCost <= step) {
					var newColor = 0x8888bb;
					if (step == maxstep) {
						newColor = 0xccccff;
					}
					if (step < 3) {
						newColor = 0x333388;
					}
					levelMap[X][Z][Y].obj.material.color.setHex(newColor);
					levelMap[X][Z][Y].step = step;
					var newDiagonal = diagonal;
					if (arr[s][2]) {
						newDiagonal = !diagonal;
						if (diagonal) {
							newStep -= 1;
						}
					}
					if (newStep > 0) {
						checkSide(X, Z ,Y, newStep, maxstep, newDiagonal);
					}
				}
			}
		}
	}
}
checkSide(2,2,0,7,7, false)
console.log(bigCount);