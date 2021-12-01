import * as THREE from 'three'
import { OrbitControls } from '../../three/OrbitControls'
import {Object3D,AxisHelper} from "three"
import InitStl from "./InitStl"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

class InitThreeObj {
  constructor($option){
    this.$option = $option
    this.wrapper = new Object3D(),
    this.scene = new THREE.Scene()
    this.mouse = new THREE.Vector2()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initCamera()
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
        this.scene.add(mesh);
    });
    this.initLight()
    this.animate()
   
    // new InitStl(this.scene)

  }
  // 初始化渲染器
  initRenderer(){
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.$option.canvasRef
    })
    this.renderer.setSize(this.$option.sizeObj.width, this.$option.sizeObj.height)
    this.renderer.setClearColor(0x4682b4, 1.0)
    
  }
  // 初始化相机
  initCamera(innerWidth,innerHeight){
    this.camera= new THREE.PerspectiveCamera( // 初始化相机
      45,
      this.$option.innerWidth / this.$option.innerHeight,
      0.1,
      10000
    )
    this.camera.position.set(0, 800, 1500)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }
  // 初始化轨迹球控件
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.5
    // 视角最小距离
    this.controls.minDistance = 100
    // 视角最远距离
    this.controls.maxDistance = 2000
    this.controls.enabled = true
    this.controls.enableKeys = true
    // 最大角度
    this.controls.maxPolarAngle = Math.PI / 2.2
    this.controls.target = new THREE.Vector3(50, 50, 0)
    this.controls.type = 'orbit'
  }
  // 渲染灯光
  initLight(){
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3) //模拟远处类似太阳的光源
    directionalLight.color.setHSL(0.1, 1, 0.95)
    directionalLight.position.set(0, 200, 0).normalize()
    this.scene.add(directionalLight)

    var ambient = new THREE.AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源
    ambient.position.set(0, 0, 0)
    var axisHelper = new AxisHelper(250)
    this.scene.add(axisHelper)
    this.scene.add(ambient)
  }
   // 动画
  animate(){
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
    this.update()
  }
  // 更新
  update(){
    this.controls.update()
    console.log("执行")

  }
  // 获取场景
  getScene(){
    return this.scene
  }
  // 获取相机
  getCamera(){
    return this.camera
  }
  // 获取鼠标
  getMouse(){
    return this.mouse
  }
  // 获取wapper
  getWrapper(){
    return this.wrapper
  }
}

export default InitThreeObj