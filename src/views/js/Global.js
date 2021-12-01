import * as THREE from 'three'
window.THREE = THREE
//模型材质信息
var planeMat, RackMat, RackMat2, CargoMat, LineMat, RollTexture, RollMat;
//库区信息
var storageZoneSize = 0, storageZoneList = [];
//货架信息
var shelfSize = 0, shelfList = [];
//货位信息
var storageUnitSize = 0, storageUnitList = [];
//货物信息
var cargoSize = 0, cargoList = [], CargosExist;

planeMat = new THREE.MeshLambertMaterial();
RackMat = new THREE.MeshLambertMaterial();
RackMat2 = new THREE.MeshPhongMaterial({color:0x1C86EE});
CargoMat = new THREE.MeshLambertMaterial();
LineMat = new THREE.MeshLambertMaterial();
RollMat = new THREE.MeshLambertMaterial();

new THREE.TextureLoader().load( require('../../assets/images/plane.png'), function( map ) {
    planeMat.map = map;
    planeMat.transparent = true;
    planeMat.opacity = 0.8;
    planeMat.needsUpdate = true;
} );
new THREE.TextureLoader().load( require('../../assets/images/rack.png'), function( map ) {
    RackMat.map = map;
    RackMat.needsUpdate = true;
} );
new THREE.TextureLoader().load( require('../../assets/images/box.png'), function( map ) {
    CargoMat.map = map;
    CargoMat.needsUpdate = true;
} );
new THREE.TextureLoader().load( require('../../assets/images/line.png'), function( map ) {
    LineMat.map = map;
    LineMat.needsUpdate = true;
} );
RollTexture = new THREE.TextureLoader().load( require('../../assets/images/biaoyu.png'), function( map ) {
    RollMat.map = map;
    RollMat.needsUpdate = true;
    RollMat.transparent = true;
    RollMat.side = THREE.DoubleSide;
} );
RollTexture.wrapS = THREE.RepeatWrapping;
RollTexture.wrapT=THREE.RepeatWrapping;


export default
  {
    planeMat,
    RackMat,
    RackMat2,
    CargoMat,
    LineMat,
    RollTexture,
    RollMat,
    storageZoneSize,
    storageZoneList,
    shelfSize,
    shelfList,
    storageUnitSize,
    storageUnitList,
    cargoSize,
    cargoList,
    CargosExist
  }