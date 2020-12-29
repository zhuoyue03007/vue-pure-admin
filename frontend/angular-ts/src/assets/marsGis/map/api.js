import axios from 'axios'


export function getMapConfig() {
  const url = 'config/config.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMapTrackConfig() {
  const url = 'config/track-config.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getWidgetConfig() {
  const url = 'config/widget.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getGisHisTrend() {
  const url = 'json/atmo-gis-his.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getStatisticChart() {
  const url = 'json/base-gis-charts.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSite() {
  const url = 'json/base-gis-v2.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getRegion() {
  const url = 'json/getCompleteRegion.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSiteType() {
  const url = 'json/siteType.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getPolluteTrend() {
  const url = 'json/polluteTrend.json';
  const data = '';
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
