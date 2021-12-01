import * as THREE from 'three'

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

class InitStl {
  constructor(scene){
   let loader = new STLLoader();
        loader.load("../static/model/pr13lc01-77-07-0008.stl",  (geometry)=> {
            //创建纹理
            var mat = new THREE.MeshPhongMaterial({
              color: 0x7777ff,
              specular:0x7777ff,
              shininess:30
              });
            var mesh = new THREE.Mesh(geometry, mat);
            mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
            mesh.scale.set(4, 4, 4); //缩放
            geometry.center(); //居中显示
            scene.add(mesh);
        });
  }
}

export default InitStl


