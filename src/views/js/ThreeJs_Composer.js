
import global_ from "./Global"
import * as THREE from 'three'

class ThreeJsComposer {
    constructor(WTHREE, _renderer, _scene, _camera){
      this.THREE = WTHREE
      this._renderer = _renderer
      this._scene = _scene
      this._camera = _camera
    }
    onMouseClick( event ) {
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      var selectedObjects = [];
      var x, y;
      if ( event.changedTouches ) {
          x = event.changedTouches[ 0 ].pageX;
          y = event.changedTouches[ 0 ].pageY;
      } else {
          x = event.clientX;
          y = event.clientY;
      }
      mouse.x = ( x / window.innerWidth ) * 2 - 1;
      mouse.y = - ( y / window.innerHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, this._camera );
      var intersects = raycaster.intersectObjects( [ this._scene ], true );
      return intersects
    }
}

export {ThreeJsComposer}