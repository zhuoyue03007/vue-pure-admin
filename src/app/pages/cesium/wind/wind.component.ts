import { Component, OnInit, AfterViewInit } from '@angular/core';
import {WindService} from './wind.service';

declare var Cesium;
declare var $;

export interface BasicType {
  name: string;
  value: string;
}

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
  homeButton: true,
  sceneModePicker: true,
  selectionIndicator: false, // 去除选中Entity聚焦框
  navigationHelpButton: false,
  infoBox: false,
  vrButton: false,
  fullscreenButton: false,
  geocoder: false,
  showRenderLoopErrors: false,
  center: {y: 34.826718, x: 114.375556, z: 58000.0, pitch: -30},
  style: {atmosphere: true, lighting: false, fog: false, testTerrain: false},
  contextmenu: false,
  mouseZoom: false,
  navigation: false,
  mapProjection: new Cesium.WebMercatorProjection(),
  sceneMode: Cesium.SceneMode.SCENE3D,
};

// 风场控制
const OPENWIND: BasicType[] = [
  {name: '关闭风场', value: '1'},
  {name: '打开风场', value: '0'},
];

@Component({
  selector: 'app-wind',
  templateUrl: './wind.component.html',
  styleUrls: ['./wind.component.scss']
})
export class WindComponent implements OnInit, AfterViewInit {

  viewer: any; // 地图视图
  scene: any; // 照相机
  openWindList: BasicType[] = OPENWIND;
  checkedOpenWindList: string; // 选中是否打开风场
  constructor(
    private windService: WindService
  ) {
    this.checkedOpenWindList = this.openWindList[0].value;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /*
  * 初始化地图
  * */
  initMap(): void {
    /*
    * 创建地图图层
    * */
    this.viewer = new Cesium.Viewer('wind-map', MapOption);

    // 设置鹰眼图

    this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 5; // 最小级别
    this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 10000000; // 最大级别
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); // 清除默认鼠标双击事件
    this.scene = this.viewer.scene;
    /*
    * 解决标点显示不全问题
    * 去除深度检测
    * */
    this.scene.globe.depthTestAgainstTerrain = false;
    // 去除supermap等文字图标
    const credit = this.viewer.scene.frameState.creditDisplay;
    credit.container.removeChild(credit._cesiumCreditContainer);
    credit.container.removeChild(credit._expandLink);
    // 初始化地图图层
    this.setMapLayers();
    // 前往中心点
    $('.cesium-viewer-toolbar').css('z-index', 2);
    $('.cesium-viewer-toolbar').css('align-items', 'flex-start');
  }

  // 初始化地图图层
  setMapLayers(): void {
    const imageryLayers = this.viewer.imageryLayers;
    imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
      credit: new Cesium.Credit('天地图全球影像服务     数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局'),
      token: '95304915c6b414cf00e4a65beca9c8da',
    }));
    // 初始化天地图全球中文注记服务，并添加至影像图层
    const labelImagery = new Cesium.TiandituImageryProvider({
      mapStyle: Cesium.TiandituMapsStyle.CIA_C, // 天地图全球中文注记服务（经纬度投影）
      token: '95304915c6b414cf00e4a65beca9c8da',
    });
    this.viewer.imageryLayers.addImageryProvider(labelImagery);

    // 服务域名
    const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
    // 服务负载子域
    const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

    // 叠加国界服务
    const iboMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=95304915c6b414cf00e4a65beca9c8da',
      subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 10,
    });
    imageryLayers.addImageryProvider(iboMap);
    this.windService.setWind(this.viewer, this.checkedOpenWindList === '0');
    // 前往中心点
    this.gotoAddress(114.31508878448909, 35.854093252747646, 200000);
  }

  // 选中是否打开风场
  selectionWindType(): void {
    switch (this.checkedOpenWindList) {
      case '0': {
        this.windService.openWind(true);
        break;
      }
      case '1': {
        this.windService.openWind(false);
        break;
      }
    }
  }

  /*
    * 定位中心点
    * */
  gotoAddress(longitude, latitude, height, isOrientation?): void {
    const orientation = {
      // 指向
      heading: Cesium.Math.toRadians(0, 0),
      // 视角
      pitch: Cesium.Math.toRadians(-35),
      roll: 0.0,
    };
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
      duration: 3,
      orientation: isOrientation ? orientation : {},
    });
  }
}
