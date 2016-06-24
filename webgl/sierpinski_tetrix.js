var camera, scene, renderer;
var NUMBERLEVELS = 3;
var old;


function setRenderer() {

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}


function setCamera() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.x = -10;
	camera.position.y = -10;
	camera.position.z = -10;
}


function setControls() {

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
}


function setScene() {

	scene = new THREE.Scene();
}


function setWorld() {
	
	// creating first Tetrahedron
	var Geometry = new THREE.TetrahedronGeometry( 1, 0 );
	var Material = new THREE.MeshNormalMaterial( { wireframe:true } );
	var mesh = new THREE.Mesh( Geometry, Material );
	
	// center a mesh vertex on origin
	mesh.position.copy(mesh.geometry.vertices[0]);
	mesh.rotation.y += Math.PI/2;
	
	// update his world position
	mesh.updateMatrixWorld();
	
	// store 4 initial tetrahedron's vertex
	var vertexPositions = new Array(4);
	for(var i=0 ; i < vertexPositions.length; ++i){
		vertexPositions[i] = mesh.geometry.vertices[i].clone();
		vertexPositions[i].applyMatrix4( mesh.matrixWorld );
	}
	
	var object = new THREE.Object3D();
	object.add(mesh);
	
	// creating first level 0
	var mesh0 = object.clone();
	mesh0.position.copy(vertexPositions[0]);
	
	var mesh1 = object.clone();
	mesh1.position.copy(vertexPositions[1]);
	
	var mesh2 = object.clone();
	mesh2.position.copy(vertexPositions[2]);
	
	// add all those meshes to "old", the first level of Tetrix		
	old = new THREE.Object3D();
	old.add(mesh);
	old.add(mesh0);
	old.add(mesh1);
	old.add(mesh2);
	
	// We have one level, we can copy it recursively.
	for(var k=0; k<NUMBERLEVELS; ++k){
		var newOne = new THREE.Object3D();
		
		for(var j = 0; j<vertexPositions.length; ++j){
			vertexPositions[j].multiplyScalar( 2.0 );
		}
		
		for( var i=0; i<3; ++i ){
			var levelChild = old.clone();
			levelChild.position.copy(vertexPositions[i]);
			newOne.add( levelChild );
		}
		
		newOne.add(old);
		old = newOne;
	}

	// Center the object to the origin
	var bbox = new THREE.Box3().setFromObject( old );
	var center = bbox.center();
	old.position.set( -center.x, -center.y, -center.z );

	// Add to the scene
	scene.add( old );
}


function setEventListenerHandler(){

	window.addEventListener( 'resize', onWindowResize, false );
	document.onkeydown = function( ev ){ keydown( ev ); };
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}


function setDrawHelpers() {

	var axisHelper = new THREE.AxisHelper( 5 );
	scene.add( axisHelper );
}	


function keydown(ev){
	
	switch( ev.keyCode ){
	
		case 81: // Q
			
			if( NUMBERLEVELS > 0 && NUMBERLEVELS <= 5 ){
				setScene();
				NUMBERLEVELS--;
				setWorld();
			}
         	break;
        
        case 87: // W
           	
        	if( NUMBERLEVELS >= 0 && NUMBERLEVELS < 5 ){
				setScene();
				NUMBERLEVELS++;
				setWorld();
			}
			break;
    }
}


function main() {

	setRenderer();
	setCamera();
	setControls();
	setScene();
	setWorld();
	//setDrawHelpers();
	setEventListenerHandler();
	animate();
}
