/**
 * 这是模型的静态常量配置
 * 和货架的配置（一般要从数据库读取，这里仅做演示）
 * @author 谢宁, Created on 2020-01-07
 */
/** ***************************************************************** */
import global_ from "./Global"

class BaseData {
  constructor(){
    this.PLANE_LENGTH = 24;  //货架板面长度
    this.PLANE_WIDTH = 55;   //货架板面宽度
    this.PLANE_HEIGHT = 2;   //货架板面高度
    this.HOLDER_LENGTH = 2;  //支架长度
    this.HOLDER_WIDTH = 2;   //支架宽度
    this.HOLDER_HEIGHT = 25; //支架高度
    this.LAYER_NUM = 3;      //货架层数
    this.COLUMN_NUM = 2;     //货架每层列数
    this.BOX_SIZE = 16;      //货物的大小(立方体)
    //货架数组
    this.shelf_list = []
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A1',shelfName:'货架A1',x:-100,y:27,z:0});
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A2',shelfName:'货架A2',x:0,y:27,z:0});
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A3',shelfName:'货架A3',x:100,y:27,z:0});
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A4',shelfName:'货架A4',x:200,y:27,z:0});
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A5',shelfName:'货架A5',x:300,y:27,z:0});
    this.shelf_list.push({StorageZoneId:'Z1',shelfId:'A6',shelfName:'货架A6',x:400,y:27,z:0});
  }
  GET_PLANE_LENGTH(){
    return this.PLANE_LENGTH;
  }
   GET_PLANE_WIDTH(){
    return this.PLANE_WIDTH;
  }
  GET_PLANE_HEIGHT(){
    return this.PLANE_HEIGHT;
  }
  GET_HOLDER_LENGTH(){
    return this.HOLDER_LENGTH;
  }
  GET_HOLDER_WIDTH(){
    return this.HOLDER_WIDTH;
  }
  GET_HOLDER_HEIGHT(){
    return this.HOLDER_HEIGHT;
  }
   GET_LAYER_NUM(){
    return this.LAYER_NUM;
  }
  
   GET_COLUMN_NUM(){
    return this.COLUMN_NUM;
  }
  
   GET_BOX_SIZE(){
    return this.BOX_SIZE;
  }
  
   GET_SHELF_LIST(){
    return this.shelf_list;
  }
}

export {BaseData}

