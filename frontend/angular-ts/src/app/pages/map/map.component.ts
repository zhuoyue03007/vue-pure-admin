import { Component, OnInit, AfterViewInit } from '@angular/core';

import L from 'leaflet';
import {tiandituTileLayer} from '@supermap/iclient-leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    console.log(L.CRS);
    const url = 'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World';
    const map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      crs: L.CRS.TianDiTu_WGS84
    });
    tiandituTileLayer({
      layerType: 'img',
      key: '1d109683f4d84198e37a38c442d68311'
    }).addTo(map);
    tiandituTileLayer({
      isLabel: true,
      key: '1d109683f4d84198e37a38c442d68311'
    }).addTo(map);
  }

}
