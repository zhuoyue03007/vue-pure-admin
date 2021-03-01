import { Injectable } from '@angular/core';

declare var Cesium;

// 地图配置项
const MapOption = {
  contextOptions: {
    requestWebgl2: true,
  },
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: 'https://www.supermapol.com/realspace/services/3D-stk_terrain/rest/realspace/datas/info/data/path',
    requestWaterMask: true,
    requestVertexNormals: true,
    isSct: false,
  }), // 使用地形服务
  homeButton: false,
  sceneModePicker: false,
  selectionIndicator: false, // 去除选中Entity聚焦框
  navigationHelpButton: false,
  infoBox: false,
  vrButton: false,
  fullscreenButton: false,
  geocoder: false,
  showRenderLoopErrors: false,
  center: {y: 34.826718, x: 114.375556, z: 58000.0, pitch: -30},
  style: {atmosphere: false, lighting: false, fog: false, testTerrain: false},
  contextmenu: false,
  mouseZoom: false,
  navigation: false,
  mapProjection: new Cesium.WebMercatorProjection(),
  sceneMode: Cesium.SceneMode.SCENE3D,
};

@Injectable({
  providedIn: 'root'
})
export class EagleEyeMapService {

  viewer: any;

  constructor() { }

  setMap(viewer): void {
    this.viewer = viewer;
    const viewer2  = new Cesium.Viewer('eye', MapOption);
    const credit2 = viewer2.scene.frameState.creditDisplay;
    credit2.container.removeChild(credit2._cesiumCreditContainer);
    credit2.container.removeChild(credit2._expandLink);
    // 2、设置鹰眼图中球属性
    const control = viewer2.scene.screenSpaceCameraController;
    control.enableRotate = false;
    control.enableTranslate = false;
    control.enableZoom = false;
    control.enableTilt = false;
    control.enableLook = false;
    // 3、同步(有点卡顿)
    //            viewer.camera.changed.addEventListener(syncViewer);
    // 3、同步
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(0, 0),
      label: {
        text: new Cesium.CallbackProperty(() => {
          const cartographic = Cesium.Cartographic.fromCartesian(this.viewer.camera.position); // 笛卡尔转换为弧度坐标
          // 将弧度坐标转换为经纬度坐标
          const longitude = Cesium.Math.toDegrees(cartographic.longitude); // 经度
          const latitude = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
          const height = Cesium.Math.toDegrees(cartographic.height) / 20; // 高度
          viewer2.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            orientation : {
              heading : this.viewer.camera.heading,
              pitch : this.viewer.camera.pitch,
              roll : this.viewer.camera.roll
            },
            duration: 0.0
          });
          return '';
        }, true)
      }
    });

    const imageryLayers = viewer2.imageryLayers;
    imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
      credit: new Cesium.Credit('天地图全球影像服务     数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局'),
      token: '95304915c6b414cf00e4a65beca9c8da',
    }));
    // 初始化天地图全球中文注记服务，并添加至影像图层
    const labelImagery = new Cesium.TiandituImageryProvider({
      mapStyle: Cesium.TiandituMapsStyle.CIA_C, // 天地图全球中文注记服务（经纬度投影）
      token: '95304915c6b414cf00e4a65beca9c8da',
    });
    viewer2.imageryLayers.addImageryProvider(labelImagery);

    // 服务域名
    const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
    // 服务负载子域
    const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

    // 叠加国界服务
    const iboMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=95304915c6b414cf00e4a65beca9c8da',
      subdomains,
      tilingScheme : new Cesium.WebMercatorTilingScheme(),
      maximumLevel : 10
    });
    imageryLayers.addImageryProvider(iboMap);
  }
}
