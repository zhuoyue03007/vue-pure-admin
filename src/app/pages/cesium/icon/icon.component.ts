import { Component, OnInit, AfterViewInit } from '@angular/core';

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

export interface UserPlace {
  name: string;
  companyName: string;
  latitude: number;
  longitude: number;
  centralPoint?: boolean;
}

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit {
  viewer: any; // 地图视图
  scene: any; // 照相机

  userPlaceList: UserPlace[];
  constructor() { }

  ngOnInit(): void {
    this.userPlaceList = [
      {
        name: 'xx',
        companyName: '前端（vue）',
        latitude: 0.6073955666863973,
        longitude: 1.9816311125865307,
      },
      {
        name: '和尚',
        companyName: '后端（node）',
        latitude: 0.6079849247637235,
        longitude: 1.9810105559145992,
        centralPoint: true,
      },
      {
        name: 'Only efforts',
        companyName: '前端（vue）',
        latitude: 0.6075121542802234,
        longitude: 1.9819805572034528,
      },
    ];
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
    this.viewer = new Cesium.Viewer('icon-cesiumContainer', MapOption);

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
    this.gotoAddress(116.30967534486967, 40.03787577917538, 10000);
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
      complete: () => {
        this.setCrewAddress();
      }
    });
  }

  /*
  * 放置图标
  * */
  setCrewAddress(): void {
    this.userPlaceList.forEach(item => {
      const longitude = Cesium.Math.toDegrees(item.longitude);
      const latitude = Cesium.Math.toDegrees(item.latitude);

      if (item.centralPoint) {
        this.gotoAddress(longitude, latitude, 20000);
      }

      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 2.61),
        label: {
          show: true,
          text: item.name,
          font: '12px Source Han Sans CN',    // 字体样式
          fillColor: Cesium.Color.WHITE,        // 字体颜色
          backgroundColor: Cesium.Color.RED,    // 背景颜色
          showBackground: false,                // 是否显示背景颜色
          style: Cesium.LabelStyle.FILL,        // label样式
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平位置
          pixelOffset: new Cesium.Cartesian2(1, -25),            // 偏移
          eyeOffset: new Cesium.Cartesian3(0, 0, -10),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          // disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        billboard: {
          image: 'assets/images/icon/icon-air-city-level1.svg',
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平位置
          height: 42,
          width: 100,
          scale: 1,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          // disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        type: 'crewAddress',
        data: item
      });

      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 2.61),
        label: {
          show: true,
          text: item.companyName,
          font: '14px Source Han Sans CN',    // 字体样式
          fillColor: Cesium.Color.RED,        // 字体颜色
          backgroundColor: Cesium.Color.RED,    // 背景颜色
          showBackground: false,                // 是否显示背景颜色
          style: Cesium.LabelStyle.FILL,        // label样式
          verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平位置
          pixelOffset: new Cesium.Cartesian2(1, -55),            // 偏移
          eyeOffset: new Cesium.Cartesian3(0, 0, -10),
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
          // disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
    });

  }

}
