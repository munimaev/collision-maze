var container, stats;
var camera, scene, renderer;
var particleMaterial;

var raycaster;
var mouse;

var objects = [];

init();
animate();

function Tile() {


        var vertices = [
            new THREE.Vector3(45,5,45),
            new THREE.Vector3(45,5,-45),
            new THREE.Vector3(50,0,50),
            new THREE.Vector3(50,0,-50),
            new THREE.Vector3(-45,5,-45),
            new THREE.Vector3(-45,5,45),
            new THREE.Vector3(-50,0,-50),
            new THREE.Vector3(-50,0,50)
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
            -200, 500 );
            
	// camera.position.set(0, 1000, 500);
// 
	scene = new THREE.Scene();

	var geometry = Tile();//new THREE.BoxGeometry(100, 100, 100);

	for (var i = 0; i < 100; i++) {

		var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color: Math.random() * 0xffffff,
			opacity: 1
		}));
		// var object = Tile();
		object.position.x = (-5 + i%10)*100;
		object.position.y = 0 ;// Math.random() * 800 - 400;
		object.position.z = (-5 + Math.floor(i/10))*100;;

		// object.scale.x = Math.random() * 2 + 1;
		// object.scale.y = Math.random() * 2 + 1;
		// object.scale.z = Math.random() * 2 + 1;

		// object.rotation.x = Math.random() * 2 * Math.PI;
		// object.rotation.y = Math.random() * 2 * Math.PI;
		// object.rotation.z = Math.random() * 2 * Math.PI;

		scene.add(object);

		objects.push(object);

	}

	var PI2 = Math.PI * 2;
	particleMaterial = new THREE.SpriteCanvasMaterial({

		color: 0x000000,
		program: function(context) {

			context.beginPath();
			context.arc(0, 0, 0.5, 0, PI2, true);
			context.fill();

		}

	});

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
	console.log(intersects)
	if (intersects.length > 0) {

		intersects[0].object.material.color.setHex(Math.random() * 0xffffff);

		var particle = new THREE.Sprite(particleMaterial);
		particle.position.copy(intersects[0].point);
		particle.scale.x = particle.scale.y = 16;
		scene.add(particle);

	}

	/*
	// Parse all the faces
	for ( var i in intersects ) {

		intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

	}
	*/
}

//

function animate() {

	requestAnimationFrame(animate);

	render();
	stats.update();

}

var radius = 600;
var theta = 0;

function render() {

	theta += 0.1;

	camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
	camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
	camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
	camera.lookAt(scene.position);

	renderer.render(scene, camera);

}