
/**
 * [지도기능 > 맵 초기화 및 기본설정]
 */

// 맵 초기화
var map;
var view;


var zoom = 7;
var base_center = [ 126.9380517322744, 36.16792263658907 ]; // default
var base_extent = [ 116.0, 30.0, 136.0, 45.0 ]; // default

var epsg_cd = 'EPSG:3857';
var korea_extent = new ol.proj.transformExtent([ 121.5568230, 30.7637950, 132.5214820, 43.0636350 ], 'EPSG:4326', epsg_cd);


var initMap = function() {
   view = new ol.View({
      center : [14217511.74525903, 4329866.898586473],
//      center : ol.proj.transform(base_center, 'EPSG:4326', 'EPSG:3857'),
      zoom : zoom,
      extent : ol.proj.transformExtent(base_extent, 'EPSG:4326', 'EPSG:3857'),
      maxZoom : 17,
      minZoom : 7,
      enableRotation : false
   });

   // 현재 사용중인 지도
   var vworld_base = new ol.layer.Tile({
      title : '브이월드(기본)',
      layerId : 'vworld-base',
      visible : true,
      type : 'base',
      source : new ol.source.XYZ({
         url : 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png',
         crossOrigin : 'anonymous'
      })
   });

   var positionControl = new ol.control.MousePosition({
      coordinateFormat : ol.coordinate.createStringXY(4),
      projection : 'EPSG:4326',
      className : 'map_info',
      target : document.getElementById('map_lonlat'),
      undefinedHTML : '&nbsp;'
   });

   map = new ol.Map({
      pixelRatio : 1,
      controls : ol.control.defaults({
         attribution : false,
         zoom : false
      }),
      layers : [vworld_base],
      renderer : ([ 'canvas', 'webgl' ]),
      interactions : ol.interaction.defaults({
         shiftDragZoom : true
      }),
      target : document.getElementById('real_map'),
      view : view,
      logo : false
   });

   return map;
}

// geolocation 현재 본인 위치 좌표 가져오기
function geolocation() {

  // const status = document.querySelector('#status');
  // const mapLink = document.querySelector('#map-link');
  //
  // mapLink.href = '';
  // mapLink.textContent = '';

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    var result = [longitude, latitude];
    // status.textContent = '';
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    // 현재 본인 위치 좌표로 맵 이동
    var my_coordi = new ol.proj.transform(result, 'EPSG:4326', 'EPSG:3857')
    map.getView().setCenter(my_coordi);
    map.getView().setZoom(30);
  }

  function error() { // error
    // status.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) { // error
    // status.textContent = 'Geolocation is not supported by your browser';
  }
  else { // locating
    // status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

// geolocation 현재 본인 위치 좌표 가져오기
$('#location').click(function() {
  geolocation();
})
// document.querySelector('#location').addEventListener('click', geolocation);

//map클릭 이벤트 (popup기능 등 추가예정)
function setMapClickEvent(map){
  // 클릭 시 좌표 (3857)
  map.on('click', function(evt) {
    var coordinate = evt.coordinate;
    console.log(evt.coordinate)
  });
}

$(document).ready(function() {
   initMap();
   setMapClickEvent(map);
});
