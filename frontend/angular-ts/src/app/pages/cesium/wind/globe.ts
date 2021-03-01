declare var Cesium;
function globe(viewer): any {

  const G = viewer;

  function viewRect() {
    let east;
    let west;
    let north;
    let south;
    const camera = G.scene.camera;
    // tslint:disable-next-line:no-unused-expression
    let r = (G.scene.mapProjection.ellipsoid, camera.computeViewRectangle(G.scene.globe.ellipsoid));
    return r ? (east = 360 * r.east / 2 / Math.PI,
      west = 360 * r.west / 2 / Math.PI,
      north = 360 * r.north / 2 / Math.PI,
      south = 360 * r.south / 2 / Math.PI) : (r = 0,
      east = r.east,
      west = r.west,
      north = r.north,
      south = r.south),
      {
        east,
        west,
        north,
        south
      };
  }

  function cesiumWGS84ToWindowCoord(point) {
    const scene = G.scene;
    const lonlat = Cesium.Cartesian3.fromDegrees(point[0], point[1]);
    const coord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, lonlat);
    return [coord.x, coord.y];
  }

  function cesiumWindowToWGS84(x, y) {
    const point = {
      x,
      y
    };
    const scene = G.scene;
    const cartesian = G.camera.pickEllipsoid(point, scene.globe.ellipsoid);
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
    }
  }

  return {
    viewRect,
    cesiumWGS84ToWindowCoord,
    cesiumWindowToWGS84
  };
}

export default globe;
