<template>
  <div class="three_box">
    <canvas ref="canvas"
            style="width: 100%; height: 100%;"></canvas>
    <div class="label_box"
         :style="{top:top,left:left}">{{label.name}}</div>
  </div>
</template>
<script>
import * as THREE from 'three'
window.THREE = THREE
import { OrbitControls } from '../three/OrbitControls'
const ThreeBSP = require('three-js-csg')(THREE)
import { ThreeJsComposer } from './js/ThreeJs_Composer.js'
import { Modules } from './js/Modules.js'
export default {
  data() {
    return {
      label: '',
      top: '-1000px',
      left: '-1000px',
      matArrayA: [],
      matArrayB: [],
      planImg: require('../assets/images/plane.png'),
      fontJson: require('../assets/FZLanTingHeiS-UL-GB_Regular.json'),
      doorleft: require('../assets/images/door_left.png'),
      doorright: require('../assets/images/door_right.png'),
      imga: require('../assets/images/floor.jpg'),
      imga1: require('../assets/images/skybox/远山_RT.jpg'), // right
      imga2: require('../assets/images/skybox/远山_LF.jpg'), // left
      imga3: require('../assets/images/skybox/远山_UP.jpg'), // top
      imga4: require('../assets/images/skybox/远山_DN.jpg'), // bottom
      imga5: require('../assets/images/skybox/远山_BK.jpg'), // back
      imga6: require('../assets/images/skybox/远山_FR.jpg'), // front
      size: {
        width: this.width,
        height: this.height
      },
      object: null,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      camera: new THREE.PerspectiveCamera( // 初始化相机
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      ),
      scene: new THREE.Scene(),
      wrapper: new THREE.Object3D(),
      renderer: null,
      controls: null,
      composer: null
    }
  },
  mounted() {
    window.addEventListener('click', this.onMouseClick)
    this.size = {
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.$refs.canvas
    })
    this.renderer.setSize(this.size.width, this.size.height)
    this.renderer.setClearColor(0x4682b4, 1.0)
    this.camera.position.set(0, 800, 1500)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.initLight()
    this.initControls()
    this.initContent()
    //添加选中时的蒙版
    this.composer = new ThreeJsComposer(
      THREE,
      this.renderer,
      this.scene,
      this.camera
    )
    this.renderer.render(this.scene, this.camera)
    this.initMat()
    this.animate()
  },
  methods: {
    initMat() {
      let obj = {
        planImg: this.planImg,
        fontJson: this.fontJson
      }
      Modules.addArea(
        obj,
        THREE,
        0,
        0,
        1000,
        500,
        this.scene,
        'ID1$库区1号',
        'FF0000',
        20,
        '左对齐'
      )
      Modules.addShelf(this.scene, this.camera, this.renderer, this.controls)
    },
    onMouseClick(e) {
      let intersects = this.composer.onMouseClick(e)
      if (intersects.length == 0) {
        return
      }
      this.label = intersects[0].object

      this.top = e.clientY + 'px'
      this.left = e.clientX + 'px'
    },
    // 墙上挖门，通过两个几何体生成BSP对象
    createResultBsp(bsp, objects_cube) {
      var material = new THREE.MeshPhongMaterial({
        color: 0x9cb2d1,
        specular: 0x9cb2d1,
        shininess: 30,
        transparent: true,
        opacity: 1
      })
      var BSP = new ThreeBSP(bsp)
      for (var i = 0; i < objects_cube.length; i++) {
        var less_bsp = new ThreeBSP(objects_cube[i])
        BSP = BSP.subtract(less_bsp)
      }
      var result = BSP.toMesh(material)
      result.material.flatshading = THREE.FlatShading
      result.geometry.computeFaceNormals() //重新计算几何体侧面法向量
      result.geometry.computeVertexNormals()
      result.material.needsUpdate = true //更新纹理
      result.geometry.buffersNeedUpdate = true
      result.geometry.uvsNeedUpdate = true
      this.scene.add(result)
    },
    initContent() {
      this.createFloor()
      this.addSkybox(this.scene)
      this.createWallMaterail()
      this.createCubeWall(
        10,
        200,
        1400,
        0,
        this.matArrayB,
        -1295,
        100,
        0,
        '墙面'
      )
      this.createCubeWall(
        10,
        200,
        1400,
        1,
        this.matArrayB,
        1295,
        100,
        0,
        '墙面'
      )
      this.createCubeWall(
        10,
        200,
        2600,
        1.5,
        this.matArrayB,
        0,
        100,
        -700,
        '墙面'
      )
      var wall = this.returnWallObject(
        2600,
        200,
        10,
        0,
        this.matArrayB,
        0,
        100,
        700,
        '墙面'
      )
      var door_cube1 = this.returnWallObject(
        200,
        180,
        10,
        0,
        this.matArrayB,
        -600,
        90,
        700,
        '前门1'
      )
      var door_cube2 = this.returnWallObject(
        200,
        180,
        10,
        0,
        this.matArrayB,
        600,
        90,
        700,
        '前门2'
      )
      var window_cube1 = this.returnWallObject(
        100,
        100,
        10,
        0,
        this.matArrayB,
        -900,
        90,
        700,
        '窗户1'
      )
      var window_cube2 = this.returnWallObject(
        100,
        100,
        10,
        0,
        this.matArrayB,
        900,
        90,
        700,
        '窗户2'
      )
      var window_cube3 = this.returnWallObject(
        100,
        100,
        10,
        0,
        this.matArrayB,
        -200,
        90,
        700,
        '窗户3'
      )
      var window_cube4 = this.returnWallObject(
        100,
        100,
        10,
        0,
        this.matArrayB,
        200,
        90,
        700,
        '窗户4'
      )
      var objects_cube = []
      objects_cube.push(door_cube1)
      objects_cube.push(door_cube2)
      objects_cube.push(window_cube1)
      objects_cube.push(window_cube2)
      objects_cube.push(window_cube3)
      objects_cube.push(window_cube4)
      this.createResultBsp(wall, objects_cube)
      //为墙面安装门
      this.createDoor_left(100, 180, 2, 0, -700, 90, 700, '左门1')
      this.createDoor_right(100, 180, 2, 0, -500, 90, 700, '右门1')
      this.createDoor_left(100, 180, 2, 0, 500, 90, 700, '左门2')
      this.createDoor_right(100, 180, 2, 0, 700, 90, 700, '右门2')
      //为墙面安装窗户
      this.createWindow(100, 100, 2, 0, -900, 90, 700, '窗户')
      this.createWindow(100, 100, 2, 0, 900, 90, 700, '窗户')
      this.createWindow(100, 100, 2, 0, -200, 90, 700, '窗户')
      this.createWindow(100, 100, 2, 0, 200, 90, 700, '窗户')
    },
    // 返回墙
    returnWallObject(width, height, depth, angle, material, x, y, z, name) {
      var cubeGeometry = new THREE.BoxGeometry(width, height, depth)
      var cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.x = x
      cube.position.y = y
      cube.position.z = z
      cube.rotation.y += angle * Math.PI
      cube.name = name
      return cube
    },
    // 渲染灯光
    initLight() {
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3) //模拟远处类似太阳的光源
      directionalLight.color.setHSL(0.1, 1, 0.95)
      directionalLight.position.set(0, 200, 0).normalize()
      this.scene.add(directionalLight)

      var ambient = new THREE.AmbientLight(0xffffff, 1) //AmbientLight,影响整个场景的光源
      ambient.position.set(0, 0, 0)
      this.scene.add(ambient)
    },
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
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      // this.composer.render()
      this.update()
    },
    update() {
      this.controls.update()
    },
    //创建地板
    createFloor() {
      var loader = new THREE.TextureLoader()
      loader.load(this.imga, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 10)
        var floorGeometry = new THREE.BoxGeometry(2600, 1400, 1)
        var floorMaterial = new THREE.MeshBasicMaterial({
          map: texture
        })
        var floor = new THREE.Mesh(floorGeometry, floorMaterial)
        floor.rotation.x = -Math.PI / 2
        floor.name = '地面'
        this.scene.add(floor)
      })
    },
    //创建门_左侧
    createDoor_left(width, height, depth, angle, x, y, z, name) {
      var loader = new THREE.TextureLoader()
      loader.load(this.doorleft, texture => {
        var doorgeometry = new THREE.BoxGeometry(width, height, depth)
        doorgeometry.translate(50, 0, 0)
        var doormaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        })
        doormaterial.opacity = 1.0
        doormaterial.transparent = true
        var door = new THREE.Mesh(doorgeometry, doormaterial)
        door.position.set(x, y, z)
        door.rotation.y += angle * Math.PI //-逆时针旋转,+顺时针
        door.name = name
        this.scene.add(door)
      })
    },

    //创建门_右侧
    createDoor_right(width, height, depth, angle, x, y, z, name) {
      var loader = new THREE.TextureLoader()
      loader.load(this.doorright, texture => {
        var doorgeometry = new THREE.BoxGeometry(width, height, depth)
        doorgeometry.translate(-50, 0, 0)
        var doormaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        })
        doormaterial.opacity = 1.0
        doormaterial.transparent = true
        var door = new THREE.Mesh(doorgeometry, doormaterial)
        door.position.set(x, y, z)
        door.rotation.y += angle * Math.PI //-逆时针旋转,+顺时针8
        door.name = name
        this.scene.add(door)
      })
    },
    //创建墙纹理
    createWallMaterail() {
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //前  0xafc0ca :灰色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //后
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ) //上  0xd6e4ec： 偏白色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ) //下
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //左    0xafc0ca :灰色
      this.matArrayA.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //右

      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //前  0xafc0ca :灰色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0x9cb2d1
        })
      ) //后  0x9cb2d1：淡紫
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ) //上  0xd6e4ec： 偏白色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xd6e4ec
        })
      ) //下
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //左   0xafc0ca :灰色
      this.matArrayB.push(
        new THREE.MeshPhongMaterial({
          color: 0xafc0ca
        })
      ) //右
    },
    //创建窗户
    createWindow(width, height, depth, angle, x, y, z, name) {
      var loader = new THREE.TextureLoader()
      loader.load(require('../assets/images/window.png'), texture => {
        var windowgeometry = new THREE.BoxGeometry(width, height, depth)
        var windowmaterial = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        })
        windowmaterial.opacity = 1.0
        windowmaterial.transparent = true
        var window = new THREE.Mesh(windowgeometry, windowmaterial)
        window.position.set(x, y, z)
        window.rotation.y += angle * Math.PI //-逆时针旋转,+顺时针
        window.name = name
        this.scene.add(window)
      })
    },
    createCubeWall(width, height, depth, angle, material, x, y, z, name) {
      var cubeGeometry = new THREE.BoxGeometry(width, height, depth)
      var cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.x = x
      cube.position.y = y
      cube.position.z = z
      cube.rotation.y += angle * Math.PI //-逆时针旋转,+顺时针
      cube.name = name
      this.scene.add(cube)
    },
    // 设置天空盒子
    addSkybox(scene) {
      var materials = []
      var loader = new THREE.TextureLoader()
      let urls = [
        this.imga1,
        this.imga2,
        this.imga3,
        this.imga4,
        this.imga5,
        this.imga6
      ]
      for (let i = 0; i < urls.length; i++) {
        var texture = loader.load(
          urls[i],
          () => {
            console.log('q')
          },
          undefined,
          e => {
            console.log(e)
          }
        )
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
            // transparent: true,
            // needsUpdate:true
          })
        )
      }
      var cube = new THREE.Mesh(
        new THREE.BoxGeometry(9000, 9000, 9000),
        materials
      )
      cube.name = 'sky'
      scene.add(cube)
    }
  }
}
</script>
<style lang="scss" scoped>
.three_box {
  position: relative;
}
.label_box {
  position: absolute;
  padding: 10px 10px;
  border: 1px solid red;
  border-radius: 3px;
}
</style>