import { Component, OnInit, AfterViewInit } from '@angular/core'

declare var Cesium;

@Component({
  selector: 'app-super-map-gis',
  templateUrl: './super-map-gis.component.html',
  styleUrls: ['./super-map-gis.component.scss'],
})
export class SuperMapGisComponent implements OnInit, AfterViewInit {

  viewer: any;
  scene: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap(): void {
    this.viewer = new Cesium.Viewer('cesiumContainer', {
      contextOptions: {
        requestWebgl2: true,
      },
      'homeButton': true,
      'sceneModePicker': true,
      'navigationHelpButton': false,
      'infoBox': false,
      'vrButton': false,
      'fullscreenButton': false,
      'geocoder': false,
      'showRenderLoopErrors': true,
      'center': {'y': 34.826718, 'x': 114.375556, 'z': 58000.0, 'pitch': -30},
      'minzoom': 1,
      'maxzoom': 50000000,
      'style': {'atmosphere': true, 'lighting': false, 'fog': false, 'testTerrain': false},
      'contextmenu': true,
      'mouseZoom': true,
      'navigation': false,
    });
    this.scene = this.viewer.scene;
    this.scene.globe.depthTestAgainstTerrain = false;
    const imageryLayers = this.viewer.imageryLayers;
    imageryLayers.addImageryProvider(new Cesium.TiandituImageryProvider({
      credit: new Cesium.Credit('天地图全球影像服务     数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局'),
      token: '95304915c6b414cf00e4a65beca9c8da',
    }))
    // 初始化天地图全球中文注记服务，并添加至影像图层
    const labelImagery = new Cesium.TiandituImageryProvider({
      mapStyle: Cesium.TiandituMapsStyle.CIA_C, // 天地图全球中文注记服务（经纬度投影）
      token: '95304915c6b414cf00e4a65beca9c8da',
    })
    imageryLayers.addImageryProvider(labelImagery);

    const longitude = Cesium.Math.toDegrees(1.9828023207314347)
    const latitude = Cesium.Math.toDegrees(0.6072129924527264)
    const height = 300;

    console.log(Cesium.Cartesian3.fromDegrees(longitude, latitude, height))

    setTimeout(() => {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        duration: 3,
        orientation: {
          // 指向
          heading: Cesium.Math.toRadians(0,0),
          // 视角
          pitch: Cesium.Math.toRadians(-35),
          roll: 0.0
        }
      });
    }, 2000)
    this.viewerEvent();
  }

  viewerEvent(): void {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    handler.setInputAction(e => {
      console.log(e)
      // 获取点击位置笛卡尔坐标
      const position = this.scene.pickPosition(e.position);

      console.log(position)

      // 将笛卡尔坐标转化为经纬度坐标
      const cartographic = Cesium.Cartographic.fromCartesian(position);

      console.log(cartographic);

      const pick = this.viewer.scene.pick(e.position); // 获取点击点位信息

      console.log(pick);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

}
