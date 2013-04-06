
var seguirId = null;
var map = null;
var uscCordenadas = {
	latitude : 3.40332,
	longitude : -76.54930
};

window.onload = darMiLocalizacion;

function darMiLocalizacion() {
	if (navigator.geolocation) {
		var btnSeguir = document.getElementById("seguir");
		btnSeguir.onclick = seguirLocalizacion;
		var btnLimpiar = document.getElementById("limpiar");
		btnLimpiar.onclick = limpiarVista;
	} else {
		alert("Oops, no soporta geolocalizacion");
	}
}

function mostrarLocalizacion(position) {
	var latitud = position.coords.latitude;
	var longitud = position.coords.longitude;

	var div = document.getElementById("localizacion");
	div.innerHTML = "Tu estas en, Latitud: " + latitud + ", Longitud: " + longitud;
	div.innerHTML += " (con una precision" + position.coords.accuracy + " metros)";
	var km = calcularDistancia(position.coords, uscCordenadas);
	var distancia = document.getElementById("distancia");
	distancia.innerHTML = "Tu estas a " + km + " km de la cancha de futbol #1 de la Universidad USC";
	if(map == null) {
		mostrarMapa(position.coords);
	} else {
			scrollMapAPosicion(position.coords);
	}
}

//
// Ley de los cosenos para calcular la distiacia
//
function calcularDistancia(coordenadasInciales, coordenadasFinales) {
	var latInicialRad = gradosARadianes(coordenadasInciales.latitude);
	var longIncialRads = gradosARadianes(coordenadasInciales.longitude);
	var latFinalRads = gradosARadianes(coordenadasFinales.latitude);
	var longFinalRads = gradosARadianes(coordenadasFinales.longitude);

	var radio = 6371;
	// radio de la tierra en km
	var distancia = Math.acos(Math.sin(latInicialRad) * Math.sin(latFinalRads) + Math.cos(latInicialRad) * Math.cos(latFinalRads) * Math.cos(longIncialRads - longFinalRads)) * radio;

	return distancia;
}

function gradosARadianes(grados) {
	radianes = (grados * Math.PI) / 180;
	return radianes;
}

function mostrarMapa(coords){
	var mapDiv = document.getElementById("map");
	var map = L.map('map').setView([51.505, -0.09], 13);

	L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);
	
	L.marker([51.5, -0.09]).addTo(map)
		.bindPopup("Estas aqui: " + coords.latitude + ", " + coords.longitude).openPopup();
	
	var popup = L.popup();
	
	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("hiciste clic en el mapa " + e.latlng.toString())
			.openOn(map);
	}
	
	map.on('click', onMapClick);
}

function mostrarError(error) {
	var tiposDeError = {
		0 : "Unknown error",
		1 : "Permission denied",
		2 : "Position is not available",
		3 : "Request timeout"
	};
	var mensajeError = tiposDeError[error.code];
	if(error.code == 0 || error.code == 2) {
		mensajeError = mensajeError + " " + error.message;
	}
	var div = document.getElementById("localizacion");
	div.innerHTML = mensajeError;
}


function mostrarLocalizacion(position) {
	var latitud = position.coords.latitude;
	var longitud = position.coords.longitude;

	var div = document.getElementById("localizacion");
	div.innerHTML = "Tu estas en, Latitud: " + latitud + ", Longitud: " + longitud;
	div.innerHTML += " (con una precision" + position.coords.accuracy + " metros)";
	var km = calcularDistancia(position.coords, uscCordenadas);
	var distancia = document.getElementById("distancia");
	distancia.innerHTML = "Tu estas a " + km + " km de la cancha de futbol #1 de la Universidad USC";
	if(map == null) {
		mostrarMapa(position.coords);
		prevCoords = position.coords;
	} else {
		var metros = calcularDistancia(position.coords, prevCoords) * 1000;
		if (metros > 20) {
			scrollMapAPosicion(position.coords);
			prevCoords = position.coords;
		}
		
	}
}

function seguirLocalizacion() {
	seguirId = navigator.geolocation.watchPosition(mostrarLocalizacion, mostrarError);
}

function limpiarVista() {
	if(seguirId) {
		navigator.geolocation.clearWatch(seguirId);
		seguirId = null;
	}
}

