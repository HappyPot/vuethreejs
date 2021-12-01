//创建货位对象
import global_ from "./Global"

class StorageUnit{
  constructor(storageZoneId, shelfId, shelfName,
    inLayerNum , inColumnNum ,
    positionX , positionY , positionZ, storageUnitId){
    this.storageZoneId=storageZoneId;
    this.shelfId=shelfId;
    this.shelfName=shelfName;
    this.inLayerNum=inLayerNum;
    this.inColumnNum=inColumnNum;
    this.positionX=positionX;
    this.positionY=positionY;
    this.positionZ=positionZ;
    this.storageUnitId=storageUnitId;
    }
    getStorageUnitById(shelfId,inLayerNum,inColumnNum) {
      for(var i = 0; i < global_.storageUnitSize; i++){
          if(global_.storageUnitList[i].shelfId == shelfId && global_.storageUnitList[i].inLayerNum == inLayerNum && global_.storageUnitList[i].inColumnNum == inColumnNum){
              return global_.storageUnitList[i];
          }
      }
  }
  getStorageUnitByUnitId(storageUnitId) {
    for(var i = 0; i < global_.storageUnitSize; i++){
        if(global_.storageUnitList[i].storageUnitId == storageUnitId){
            return global_.storageUnitList[i];
        }
      }
  }
}

export {
  StorageUnit
}