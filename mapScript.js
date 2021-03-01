var placeList =    [["Ba Sing Se", 19780, 5730],
                   ["Omashu", 15550,	9830],
                   ["Fong's Fortress",	14450,	10980],
                   ["Misty Palms Oasis", 17700,	11400],
                   ["Gaoling", 16710,	12600],
                   ["Kyoshi Island", 14300,	13500],
                   ["Gaipan", 15544,	8705],
									 ["Banyan-Grove Tree", 15825,	11600],
                   ["Republic City", 11810, 5850],
                   ["Northern Air Temple", 15860,	3670],
                   ["Eastern Air Temple",23500,	11960],
                   ["Southern Air Temple",	10820,	15010],
                   ["Western Air Temple",7220,	5300],
                   ["Northern Water Tribe",13300,	2030],
                   ["Southern Water Tribe",10600,	17900],
                   ["The Boiling Rock",5690,	7800],
                   ["Fire Nation Capital",3950,	9760],
                   ["Northern Spirit Portal",13120,	1030],
                   ["Southern Spirit Portal",13650,	18630],
								   ["Maoyi",21220, 6200],
									 ["Delcambre",19300, 14540],
									 ["Lego City",14000, 6000],
                   ["Skeleton Sculpture (Lego City)",21140, 11020],
									 ["Chestilvania",16300, 15360],
                   ["Urithiru",14680, 12890],
                   ["Axiom",19000, 7500],
                   ["AgniKai",5750, 9220],
                   ["BackpackerCity",6110, 9695],
                   ["BlackCliffs",6270, 10020],
                   ["Lilactown2.0",16820, 3939],
                   ["Pride Town",21360, 5280],
                   ["Ishtar",19850, 9670],
                   ["Pantora",13230, 14540],
                   ["Star Wars House (Pantora)",18120, 10820],
									 ["Newt City",4470, 10970],
                   ["Kamino",14720, 15700],
                   ["Anima",14460, 15350],
                   ["VaatusTeaShop",15030, 17200],
                   ["SouthernRaiders",12980, 13450],
                   ["Kraotum",7740, 4880],
                   ["Igloanie",13540, 1020]];

// map height is always the device height
// the width then gets adjusted to match the original image dimensions
var height = document.getElementById("mapid").clientHeight;
var width = document.getElementById("mapid").clientWidth;

// viewing on mobile
if (height > width) {
	height = width * 0.85427472;
	var mapHeight = height + "px";
	document.getElementById("mapid").style.height = map;
}

// viewing on computer
else {
	width = height * 1.17058363;
	var mapWidth = width + "px";
	document.getElementById("mapid").style.width = mapWidth;
}



// creates a leaflet map
var map = L.map('mapid', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: 6,
	attributionControl: false
});

document.getElementById('mapid').style.cursor = 'crosshair';

var markerIcon = L.icon({
    iconUrl: 'lotusTile.png',

    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [30, 30], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var markerGroup = L.layerGroup().addTo(map);


// declares the bounds of the map so it sizes correctly
var mapSW = [0, 0];
var mapNE = [height, width];


var bounds = [mapSW, mapNE];
var image = L.imageOverlay('bettermap.png', bounds).addTo(map);
map.fitBounds(bounds);

map.setMaxBounds(new L.LatLngBounds(
	map.unproject([0, 0]),
	map.unproject([width, -height])
));

// some code I found to get and display the mouse position on the map
let Position = L.Control.extend({
	_container: null,
	options: {
		position: 'bottomleft'
	},

	onAdd: function (map) {
		var lnglat = L.DomUtil.create('div', 'mouseposition');
		this._lnglat = lnglat;
		return lnglat;
	},

	scale: function (lng, lat, up) {

		// scaling between pixel dimensions and server block dimensions

		var coords = [];
		var actualX;
		var actualY;

		const MIN_X = 0;
		const MAX_X = width;

		const MIN_Y = 0;
		const MAX_Y = height;


		const MC_MIN_X = 1669;
		const MC_MAX_X = 25223;

		const MC_MIN_Y = -71;
		const MC_MAX_Y = 20106;


		var lnglat = lng + " " + lat;

		const scale = (num, in_min, in_max, out_min, out_max) => {
			return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		};

		if (up == 1) {

			actualX = Math.round(scale(lng, MIN_X, MAX_X, MC_MIN_X, MC_MAX_X));
			actualY = Math.round(scale(lat, MAX_Y, MIN_Y, MC_MIN_Y, MC_MAX_Y));

			coords = [actualX, actualY];
		}

		else {
			actualX = Math.round(scale(lng, MC_MIN_X, MC_MAX_X, MIN_X, MAX_X));
			actualY = Math.round(scale(lat, MC_MIN_Y, MC_MAX_Y, MAX_Y, MIN_Y));

			coords = [actualX, actualY];
		}
		return coords
	},

	updateHTML: function (coordsArray) {

		var coords = "~ " + coordsArray[0] + " " + coordsArray[1];


		// updates the coordinates in the bottom left corner

		this._lnglat.innerHTML = coords;
		this._lnglat.style.fontSize = "2.5em";
		this._lnglat.style.color = "#98ffcc";
		this._lnglat.style.fontWeight = "bold";
		this._lnglat.style.textShadow = "0px 0px 1px rgb(0,0,0)";
	}
});
this.position = new Position();
this.map.addControl(this.position);

// checks for mouse movement to update coords

this.map.addEventListener('mousemove', (event) => {
	let lat = Math.round(event.latlng.lat * 100000) / 100000;
	let lng = Math.round(event.latlng.lng * 100000) / 100000;
	var coords = this.position.scale(lng, lat, 1);
	this.position.updateHTML(coords);
}
);

function zoomOnPosition(lng,lat, townName) {

	markerGroup.clearLayers();

	var coordsArray = this.position.scale(lng, lat, 0);

	var mapX = coordsArray[0];
	var mapY = coordsArray[1];

	map.setZoom(3);
	setTimeout(() => map.panTo([mapY,mapX]), 400);
	var marker = L.marker([mapY, mapX], {icon: markerIcon}).addTo(markerGroup);
  
  marker.bindTooltip(townName, 
    {
        permanent: true, 
        direction: 'bottom'
    }
);
}

function createGrid() {
	var grid = document.getElementById("places");
	for (var i=0; i<placeList.length; i++) {
		grid.innerHTML += "<div class='grid-item'> <a href='javascript:goTo(" + i + ");'>" + placeList[i][0] + "</a> </div>";
	}
}


function goTo(location) {
	window.scrollTo(0, 0);
  var townName = placeList[location][0];
	var lng = placeList[location][1];
	var lat = placeList[location][2];
	var coords = [lng,lat];
	this.position.updateHTML(coords);
	zoomOnPosition(lng,lat, townName);
}


createGrid();

var gridTitle = document.getElementById("grid-title");
var placeGrid = document.getElementById("places");
gridTitle.style.width = width + "px";
placeGrid.style.width = width + "px";