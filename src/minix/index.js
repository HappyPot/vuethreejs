export const myminix = {
  methods: {
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
      raycaster.setFromCamera( mouse, _camera );
      var intersects = raycaster.intersectObjects( [ _scene ], true );

      if(intersects.length == 0){
          // $("#label").attr("style","display:none;");//隐藏说明性标签
          console.log('1111')
          return;
      }
      if(intersects[0].object.name == "地面" || (intersects[0].object.name == "") || (intersects[0].object.name == "墙面")){
          // $("#label").attr("style","display:none;");//隐藏说明性标签
          console.log('222222')
          selectedObjects.pop();
      }else{
          // $("#label").attr("style","display:block;");// 显示说明性标签
          // $("#label").css({left: x, top: y-40});// 修改标签的位置
          // $("#label").text(intersects[0].object.name);// 显示模型信息
          console.log('333333')
          selectedObjects.pop();
          selectedObjects.push( intersects[0].object );
      }
  }
  }
}
