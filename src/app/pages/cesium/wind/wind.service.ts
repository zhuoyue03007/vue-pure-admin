import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import globe from './globe';

declare var Windy;
declare var $;

@Injectable({
  providedIn: 'root'
})
export class WindService {

  // 风场
  started = false;
  windy: any;
  viewer: any; // 地图实例

  isOpenWind: boolean; // 是否隐藏风场

  constructor(
    private http: HttpClient
  ) {
  }

  // 设置风场
  setWind(viewer, isOpenWind = false): void {
    this.isOpenWind = isOpenWind;
    this.viewer = viewer;
    this.started = false;
    this.viewer._cesiumWidget._creditContainer.style.display = 'none';
    $('#wind')[0].width = parseInt(this.viewer.canvas.width, 0);
    $('#wind')[0].height = parseInt(this.viewer.canvas.height, 0);
    this.http.get('assets/json/gfs.json')
      .subscribe(res => {
        this.windy = new Windy({canvas: document.getElementById('wind'), data: res}, globe(this.viewer));
        this.redraw();
        this.viewer.camera.moveStart.addEventListener(() => {
          $('#wind').hide();
          if (!!this.windy && this.started) {
            this.windy.stop();
          }
        });
        this.viewer.camera.moveEnd.addEventListener(() => {
          $('#wind').hide();
          if (!!this.windy && this.started) {
            if (!this.isOpenWind) {
              return false;
            }
            this.redraw();
          }
        });
      });
  }

  openWind(isOpenWind): void {
    this.isOpenWind = isOpenWind;
    this.redraw();
  }

  redraw() {
    const width = this.viewer.canvas.width;
    const height = this.viewer.canvas.height;
    $('#wind')[0].width = width;
    $('#wind')[0].height = height;
    this.windy.stop();
    this.started = this.windy.start(
      [[0, 0], [width, height]],
      width,
      height,
    );
    if (this.isOpenWind) {
      $('#wind').show();
    } else {
      $('#wind').hide();
    }
  }
}
