/*cadena con la clave entre la que introduciremos el nombre de la ciudad para
solicitar a la API de Google las coordenadas en base al nombre de la ciudad*/
var cadenaMaps1 = "https://maps.googleapis.com/maps/api/geocode/json?address="
var cadenaMaps2 = "&key=AIzaSyC0e1Yqjh7yocgjWo6ClXm5q7h726L9AtE"
var numMapa = 0;

/*función para autocompletar*/
$(function() {
  $.widget("custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function(ul, items) {
      var that = this,
        currentCategory = "";
      $.each(items, function(index, item) {
        if (item.category != currentCategory) {
          ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
          currentCategory = item.category;

        }
        that._renderItemData(ul, item);
      });
    }
  });

  var xhr;
  $("input").catcomplete({
    delay: 0,
    source: function(request, response) {
      var regex = new RegExp(request.term, 'i');
      if (xhr) {
        xhr.abort();
      }
      xhr = $.ajax({
        url: "data.json",
        dataType: "json",
        cache: false,
        success: function(data) {
          response($.map(data.list, function(item) {
            if (regex.test(item.provincia)) {
              return {
                label: item.provincia,
                category: item.category,
                ciudades: item.ciudades,
              };

            }
          }));
        }
      });
    },
    minlength: 0
  });
});





//leemos el Json y seleccionamos las ciudades de la provincia elegida
$(document).ready(function() {
  $("#provincia").keyup(function(event){
    if(event.keyCode == 13){
        $("#provincia").click();
    }
  });
  $('#submit').click(function() {
    var prov = $('#provincia').val();
    var ciudadesElegidas;
    $("#mapas").empty();
    $.getJSON('data.json', function(data) {
      for (var i = 0; i < (data.list.length); i++) {
        if (data.list[i].provincia == prov) {
          if (data.list[i].ciudades) {
            ciudadesElegidas = data.list[i].ciudades
            recogeCiudades(ciudadesElegidas);
            break;
          }
        }
      }
    });
  });
});

var recogeCiudades = function(ciudades) {
  //vamos a llamar a dibujar mapa una vez por ciudad
  for (var i = 0; i < ciudades.length; i++) {
    obtenCoordenadas(ciudades[i]);



  }


}

var obtenCoordenadas = function(ciudad) {
  var peticion = cadenaMaps1 + ciudad + cadenaMaps2;

  //con la dirección, leemos el json que manda GoogleApi
  $.getJSON(peticion, function(json) {

    var latitude = json.results[0].geometry.location.lat;

    var longitude = json.results[0].geometry.location.lng;
    pintaMapa(latitude, longitude);

  });

};


var pintaMapa = function(latitud, longitud) {

  numMapa++;
  var identificador = 'map' + numMapa;
  jQuery('<div/>', {
    id: identificador,
    class: 'mapa'
  }).appendTo('#mapas');


  var mapProp = {
    center: new google.maps.LatLng(latitud, longitud),
    zoom: 15,
  };
  var map = new google.maps.Map(document.getElementById(identificador), mapProp);
}







