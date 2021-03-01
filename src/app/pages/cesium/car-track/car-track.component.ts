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

@Component({
  selector: 'app-car-track',
  templateUrl: './car-track.component.html',
  styleUrls: ['./car-track.component.scss']
})
export class CarTrackComponent implements OnInit, AfterViewInit {
  viewer: any; // 地图视图
  scene: any; // 照相机

  start: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  /*
  * 初始化地图
  * */
  initMap(): void {
    /*
    * 创建地图图层
    * */
    this.viewer = new Cesium.Viewer('car', MapOption);

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
    this.cllj();
  }

  cllj(): void {
    // this.viewer.scene.globe.enableLighting = true;
    const data = [];
    data[0] = [
      {
        longitude: 116.30967534486967,
        dimension: 40.03787577917538,
        height: 0,
        time: 0,
      },
      {
        longitude: 116.37229697193095,
        dimension: 40.0392992127089,
        height: 0,
        time: 40,
      },
      {
        longitude: 116.37398716428874,
        dimension: 40.017362097447545,
        height: 0,
        time: 100,
      },
      {
        longitude: 116.30747809477879,
        dimension: 40.01969203741453,
        height: 0,
        time: 280,
      },
      {
        longitude: 116.30823868134979,
        dimension: 40.03696994236705,
        height: 0,
        time: 5000,
      },
    ];

    // 起始时间
    this.start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));
    // 结束时间
    const stop = Cesium.JulianDate.addSeconds(this.start, 360, new Cesium.JulianDate());

    // 设置始时钟始时间
    this.viewer.clock.startTime = this.start.clone();
    // 设置时钟当前时间
    this.viewer.clock.currentTime = this.start.clone();
    // 设置时钟停止时间
    this.viewer.clock.stopTime = stop.clone();
    // 时间速率，数字越大时间过的越快
    this.viewer.clock.multiplier = 10;
    // 时间轴
    //     this.viewer.timeline.zoomTo(this.start, stop);
    // 循环执行,即为2，到达终止时间，重新从起点时间开始
    this.viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;

    // view.camera.flyTo({
    //     destination:Cesium.Cartesian3.fromDegrees(116.405419,32.073514,20000)
    // })
    data.forEach(item => {
      const property = this.computeFlight(item);
      console.log(new Cesium.VelocityOrientationProperty(property));
      // 添加模型
      const planeModel = this.viewer.entities.add({
        // 和时间轴关联
        availability: new Cesium.TimeIntervalCollection(
          [new Cesium.TimeInterval({
            start: this.start,
            stop,
          })],
        ),
        position: property,
        // 根据所提供的速度计算模型的朝向
        orientation: new Cesium.VelocityOrientationProperty(property),
        // 模型数据
        model: {
          uri: 'assets/images/glb/GroundVehicle.glb',
          minimumPixelSize: 128,
          maximumScale: 50,
          runAnimations: true
        },
        verticalOrigin: Cesium.VerticalOrigin.CENTER, // 垂直位置
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 水平位置
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      });
    });
  }

  /**
   * 计算飞行
   * @param source 数据坐标
   * @ returns {SampledPositionProperty|*}
   */
  computeFlight(source) {
    // 取样位置 相当于一个集合
    const property = new Cesium.SampledPositionProperty();
    source.forEach(item => {
      const time = Cesium.JulianDate.addSeconds(this.start, item.time, new Cesium.JulianDate());
      const position = Cesium.Cartesian3.fromDegrees(item.longitude, item.dimension, 40.65611668665132);
      console.log(position);
      // 添加位置，和时间对应
      property.addSample(time, position);
    });
    return property;
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
