const canvas = document.getElementById("babcanv"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true);
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin);
    
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 10, 30, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.setPosition(new BABYLON.Vector3(0, 20, -30));
    // camera.attachControl(canvas, true);

    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.ellipsoid = new BABYLON.Vector3(1.5, 0.5, 1.5);
    camera.applyGravity = true;
    camera.keysUp.pop(38);
    camera.keysDown.pop(40);
    camera.keysLeft.pop(37);
    camera.keysRight.pop(39);
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);
    camera.speed = 0.5;

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var groundmat = new BABYLON.StandardMaterial("groundmat", scene);
    groundmat.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/fr2946D.png", scene);

    var wallmat = new BABYLON.StandardMaterial("wallmat", scene);
    wallmat.diffuseTexture = new BABYLON.Texture("wood.jpg", scene);

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:0.3}, scene);
    ground.applyGravity = true;
    ground.checkCollisions = true;
    ground.material = groundmat;
    var wallz = [15, 0, 0, -15];
    var wallrot = [0, 1, 1, 0];
    var wallx = [null, -15, 15, null];
    for (i=0;i<4;i++) {
        var wall = BABYLON.MeshBuilder.CreateBox("wall", {width:30, height:2, depth:0.1}, scene);
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution: 0.3}, scene);
        wall.position.y = 1;
        wall.position.z = wallz[i];
        wall.checkCollisions = true;
        wall.material = wallmat;
        if (wallrot[i] == 1) {
            wall.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2, BABYLON.Space.LOCAL);
        }
        if  (!(wallx[i] == null)) {
            wall.position.x = wallx[i];
        }
    }

    var bluemat = new BABYLON.StandardMaterial("bluemat", scene);
    bluemat.diffuseColor = new BABYLON.Color3.FromHexString("#87CEEB");
    bluemat.backFaceCulling = false;
    var skybox = BABYLON.MeshBuilder.CreateSphere("skybox", {segments:32, diameter:100}, scene);
    skybox.material = bluemat;

    var redmat = new BABYLON.StandardMaterial("redmat", scene);
    redmat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    redmat.backFaceCulling = false;

    var cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder1", {height:3, diameter:3}, scene);
    cylinder1.position.z = 4;
    cylinder1.physicsImpostor = new BABYLON.PhysicsImpostor(cylinder1, BABYLON.PhysicsImpostor.CylinderImpostor, {mass:3, restitution:0.3}, scene);
    cylinder1.material = redmat;
    cylinder1.checkCollisions = true;

    for (i=0.15;i<3.15;i+=0.3) {
        var stairmaterial = new BABYLON.StandardMaterial("stairmat", scene);
        stairmaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        var stairpiece = BABYLON.MeshBuilder.CreateBox("stairpiece", {width:0.3,height:0.3,depth:5}, scene);
        stairpiece.position.set(i,i,-5)
        stairpiece.material = stairmaterial;
        stairpiece.checkCollisions = true;
        stairpiece.physicsImpostor = new BABYLON.PhysicsImpostor(stairpiece, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.3}, scene);
    }
    var invisiblestairholder = BABYLON.MeshBuilder.CreateBox("stairholder", {width:5, height:4.24264069, depth:0.1}, scene);
    invisiblestairholder.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI/2, BABYLON.Space.LOCAL);
    invisiblestairholder.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/4, BABYLON.Space.LOCAL);
    invisiblestairholder.position.set(0.15+1.5, 0.15+1.5, -5);
    invisiblestairholder.visibility = 0;
    var boxstartanim = BABYLON.MeshBuilder.CreateBox("startanim", {width:0.15, height:3, depth:5}, scene);
    boxstartanim.position.set(-0.30, 0.15, -5);
    boxstartanim.checkCollisions = true;
    boxstartanim.visibility = 0;

    camera.onCollide = function(colMesh) {
        if (colMesh.uniqueId == cylinder1.uniqueId) {
            var camPosition = camera.position.clone();
            camPosition.y -= camera.ellipsoid.y * 0.80;
            var movementDirectionVector = colMesh.getAbsolutePosition().subtract(camPosition);
            cylinder1.physicsImpostor.setLinearVelocity(movementDirectionVector.scale(5/cylinder1.physicsImpostor.mass));
        }
        if (colMesh.uniqueId == boxstartanim.uniqueId) {
            BABYLON.Animation.CreateAndStartAnimation("anim", camera, "position", 5, 30, new BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z), new BABYLON.Vector3(stairpiece.position.x, stairpiece.position.y+2, stairpiece.position.z), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
    };

    var upperland = BABYLON.MeshBuilder.CreateBox("upperland", {width:10, height:0.1, depth:10}, scene);
    upperland.checkCollisions = true;
    upperland.position.set(stairpiece.position.x+5, stairpiece.position.y, stairpiece.position.z);
    upperland.physicsImpostor = new BABYLON.PhysicsImpostor(upperland, BABYLON.PhysicsImpostor.BoxImpostor, {mass:0, restitution:0.3}, scene);

    const particleSystem = new BABYLON.ParticleSystem("particles", 2000);
    particleSystem.particleTexture = new BABYLON.Texture("react.png");
    particleSystem.emitter = new BABYLON.Vector3(stairpiece.position.x+5, stairpiece.position.y, stairpiece.position.z);
    particleSystem.start();
    return scene;
};

canvas.onclick = function(){
    canvas.requestPointerLock = 
    canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock
    canvas.requestPointerLock();

    var bullet = BABYLON.MeshBuilder.CreateSphere("bullet", {diameter:0.5, segments:32}, scene);
    bullet.physicsImpostor = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0.3}, scene);
    
    var startPos = camera.position;
    bullet.position = new BABYLON.Vector3(startPos.x, startPos.y, startPos.z);
    var invView = new BABYLON.Matrix();
	camera.getViewMatrix().invertToRef(invView);
	var direction = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, 1), invView);
	direction.normalize();
    bullet.physicsImpostor.applyImpulse(direction.scale(30), bullet.getAbsolutePosition());
}

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
