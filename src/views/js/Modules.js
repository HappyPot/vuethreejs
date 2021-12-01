import {BaseData} from './config'
import {StorageUnit} from './StorageUnit'
import DragControls from 'three-dragcontrols';
import {Shelf} from './Shelf'
import global_ from "./Global"

class Modules{
    
   constructor(){
       this.baseData = null
       this.storageUnit_obj = null
       this.shelf_obj = null
   }
    /** 根据3D库图货架配置表添加货架 */
    static addShelf(scene,camera, renderer,controls) {
         this.baseData = new BaseData()
        var shelf_list = this.baseData.GET_SHELF_LIST();
        global_.shelfSize = shelf_list.length;
        for(var i = 0; i < global_.shelfSize; i++){
            this.shelf_obj = new Shelf(shelf_list[i].StorageZoneId,
                shelf_list[i].shelfId,
                shelf_list[i].shelfName,
                this.baseData.GET_PLANE_LENGTH(),this.baseData.GET_PLANE_WIDTH(),this.baseData.GET_PLANE_HEIGHT(),
                this.baseData.GET_HOLDER_LENGTH(),this.baseData.GET_HOLDER_WIDTH(),this.baseData.GET_HOLDER_HEIGHT(),
                shelf_list[i].x,
                shelf_list[i].y,
                shelf_list[i].z,
                this.baseData.GET_LAYER_NUM(),this.baseData.GET_COLUMN_NUM());
            global_.shelfList.push(this.shelf_obj);
        }
    
        for(var i = 0;i < global_.shelfSize; i++){
            Modules.addStackOfRack(global_.shelfList[i].positionX,global_.shelfList[i].positionY,global_.shelfList[i].positionZ,global_.shelfList[i].planeLength,global_.shelfList[i].planeHeight,global_.shelfList[i].planeWidth,global_.shelfList[i].holderLength,global_.shelfList[i].holderHeight,global_.shelfList[i].holderWidth,scene,global_.shelfList[i].storageZoneId+"$"+global_.shelfList[i].shelfId+"$"+global_.shelfList[i].shelfName,global_.shelfList[i].columnNum,global_.shelfList[i].layerNum);
        }
            //添加货物
        for (var i = 1; i <= this.baseData.GET_LAYER_NUM(); i++) {
            for (var j = 1; j <= this.baseData.GET_COLUMN_NUM(); j++) {
            for (var k = 1; k <= shelf_list.length; k++) {
                Modules.addOneUnitCargos(shelf_list[k - 1].shelfId, i, j, scene)
            }
            }
        }
          //添加拖动效果
      // 过滤不是 Mesh 的物体,例如辅助网格
      var objects = [];
      for (var i = 0; i < scene.children.length; i++) {
        var Msg = scene.children[i].name.split("$");
        if (scene.children[i].isMesh && Msg[0] == "货物") {
          objects.push(scene.children[i]);
        }
      }

      var dragControls = new DragControls(objects, camera, renderer.domElement);
    //   dragControls.addEventListener('dragstart',  (event)=> {
    //     controls.enabled = false;
    //     controls.enablePan = false;
    //     var isPaused = true;
    //   });
      dragControls.addEventListener('drag',  (event)=> {
        controls.enabled = false;
        controls.enablePan = false;
        var isPaused = true;
      });
      dragControls.addEventListener('dragend',  (event)=> {
        controls.enablePan = true;
        controls.enabled = true;
        var isPaused = false;
      });
    }
    //region 库区
    /** 放置虚线框区域和库区名称 */
    static addArea(dataObj,THREE,x,z,width,length,scene,name,textColor,font_size,textposition) {
    let planeMat = new THREE.MeshLambertMaterial();

    new THREE.TextureLoader().load(dataObj.planImg, ( map )=> {
        planeMat.map = map;
        planeMat.transparent = true;
        planeMat.opacity = 0.8;
        planeMat.needsUpdate = true;
    } );
    var geometry = new THREE.PlaneGeometry( width, length );
    var obj = new THREE.Mesh( geometry, planeMat );
    obj.position.set(x,1.5,z);
    obj.rotation.x = -Math.PI / 2.0;
    obj.name = "库区"+"$"+name.split("$")[1];
    scene.add( obj );
    // 这里用绝对路径
    new THREE.FontLoader().load('/FZLanTingHeiS-UL-GB_Regular.json',(font)=>{
        var text= new THREE.TextGeometry(name.split("$")[1],{
            // 设定文字字体
            font:font,
            //尺寸
            size:font_size,
            //厚度
            height:0.01
        });
        text.computeBoundingBox();
        //3D文字材质
        var m = new THREE.MeshStandardMaterial({color:"#" + textColor});
        var mesh = new THREE.Mesh(text,m)
        if(textposition == "左对齐"){
            mesh.position.x = x - width/2 + 10;
        }else if(textposition == "居中"){
            mesh.position.x = x - 15;
        }else if(textposition == "右对齐"){
            mesh.position.x = x + width/2 - 60;
        }
        mesh.position.y = 1.3;
        mesh.position.z = z + length/2 - 20;
        mesh.rotation.x = -Math.PI / 2.0;
        scene.add(mesh);
    });
    }
    //region 货架货位

    /** 放置单层货架 */
    /** x,y,z 整个模型在场景中的位置 */
    /** plane_x,plane_y,plane_z 货架板面的长高宽 */
    /** holder_x,holder_y,holder_z 货架支架的长高宽 */
    /** scene,name,num 要添加的场景,货架的名字,单层货架的库位数量 */
    static addRack(x,y,z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name,num) {
        var plane = new THREE.BoxGeometry( plane_x, plane_y, plane_z/num );
        var gz = [];
        for(var i = 0; i < num; i++){
            gz.push( z + plane_z/num/2 + (plane_z/num)*i );
            var obj = new THREE.Mesh( plane, global_.RackMat );
            obj.position.set(x , y, gz[i]) ;
            var msg = name+"$"+(this.baseData.GET_COLUMN_NUM() - i);
    
            var storageUnitId = msg.split("$")[1] + "$" + msg.split("$")[3] + "$" + msg.split("$")[4];
    
            //添加货位
            this.storageUnit_obj = new StorageUnit(msg.split("$")[0],
                msg.split("$")[1],
                msg.split("$")[2],
                msg.split("$")[3],
                msg.split("$")[4],
                x, y, gz[i], storageUnitId);
                global_.storageUnitList.push(this.storageUnit_obj);
                global_.storageUnitSize++;
    
            var Unit = this.storageUnit_obj.getStorageUnitById(msg.split("$")[1],msg.split("$")[3],msg.split("$")[4]);
            obj.name = "货位"+"$"+Unit.storageUnitId;
            scene.add(obj);
        }
    
        var holder = new THREE.BoxGeometry( holder_x, holder_y, holder_z );
        var obj2 = new THREE.Mesh( holder, global_.RackMat2, 0 );
        var obj3 = new THREE.Mesh( holder, global_.RackMat2, 0 );
        var obj4 = new THREE.Mesh( holder, global_.RackMat2, 0 );
        var obj5 = new THREE.Mesh( holder, global_.RackMat2, 0 );
    
        obj2.position.set(x-plane_x/2+holder_x/2,y-holder_y/2-plane_y/2,z+holder_z/2);
        obj3.position.set(x+plane_x/2-holder_x/2,y-holder_y/2-plane_y/2,z+holder_z/2);
        obj4.position.set(x-plane_x/2+holder_x/2,y-holder_y/2-plane_y/2,z+plane_z-holder_z/2);
        obj5.position.set(x+plane_x/2-holder_x/2,y-holder_y/2-plane_y/2,z+plane_z-holder_z/2);
        scene.add(obj2);scene.add(obj3);scene.add(obj4);scene.add(obj5);
    }
      /** 放置一叠货架 */
    /** stack_num 货架的叠数 */
    static addStackOfRack(x,y,z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name,num,stack_num) {
        for(var i = 0; i < stack_num; i++){
            Modules.addRack(x,y*(i+1),z,plane_x,plane_y,plane_z,holder_x,holder_y,holder_z,scene,name+"$"+(i+1),num);
        }
    }
    //region 货物
    /** 放置单个货物 */
    static addCargo(x,y,z,box_x,box_y,box_z,scene,name) {
        var geometry = new THREE.BoxGeometry( box_x, box_y, box_z );
        var obj = new THREE.Mesh( geometry, global_.CargoMat );
        obj.position.set(x,y,z);
        obj.name = name;
        scene.add(obj);
    }
    static addOneUnitCargos(shelfId,inLayerNum,inColumnNum,scene) {
        var storageUnit = this.storageUnit_obj.getStorageUnitById(shelfId,inLayerNum,inColumnNum);
        var shelf = this.shelf_obj.getShelfById(storageUnit.shelfId);
        var storageUnitid = storageUnit.storageUnitId;
        var x = storageUnit.positionX;
        var y = storageUnit.positionY + this.baseData.GET_BOX_SIZE()/2 + shelf.planeHeight/2;
        var z = storageUnit.positionZ;
        Modules.addCargo(x,y,z,this.baseData.GET_BOX_SIZE(),this.baseData.GET_BOX_SIZE(),this.baseData.GET_BOX_SIZE(),scene,"货物"+"$"+storageUnitid)
    }
}
export {Modules}