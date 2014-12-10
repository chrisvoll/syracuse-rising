$(function() {


  ////////////////////////////////////////////
  //
  // Syracuse Map
  //
  ////////////////////////////////////////////

    // Init the map
    var $map = $('#map');
    var map = L.map('map').setView( new L.LatLng(43.0476822,-76.1486941), 17 );
    window.map = map;
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2hyaXN2b2xsIiwiYSI6InlkMXlCUjgifQ.eT64_GtCp4jLBjrJlSlvTQ';
    var tileLayer = L.mapbox.tileLayer('chrisvoll.kdgd9m4i', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>',
      //zoomTune: [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      minZoom: 0,
      maxZoom: 18,
    }).addTo(map);

    var redraw = function() {
      console.log('redrawing');
      tileLayer.redraw();
    }
    $map.on( 'redraw', $.debounce(200, redraw) );


    var types = {
      commercial: {
        'marker-color': '#9c89cc',
        'marker-symbol': 'commercial',
        label: 'Commercial',
        total: 0,
        count: 0
      },
      residential: {
        'marker-color': '#f86767',
        'marker-symbol': 'building',
        label: 'Residential',
        total: 0,
        count: 0
      },
      mixed: {
        'marker-color': '#1087BF',
        'marker-symbol': 'city',
        label: 'Mixed-use',
        total: 0,
        count: 0
      },
      infrastructure: {
        'marker-color': '#ffde00',
        'marker-symbol': 'car',
        label: 'Infrastructure',
        total: 0,
        count: 0
      },
      academic: {
        'marker-color': '#89c200',
        'marker-symbol': 'college',
        label: 'Academic',
        total: 0,
        count: 0
      },
      healthcare: {
        'marker-color': '#7ec9b1',
        'marker-symbol': 'hospital',
        label: 'Healthcare',
        total: 0,
        count: 0
      }
    };


  ////////////////////////////////////////////
  //
  // Get the data
  //
  ////////////////////////////////////////////

  Tabletop.init({
    key: '19JnF3xjfnGSLN0Gzoh-Gw2pNfbQVJYGq7XzZMYfMK-Q',
    callback: function(data, tabletop) {
      data = data.Syracuse.elements;


      ////////////////////////////////////////////
      //
      // Format the data
      //
      ////////////////////////////////////////////

      var popupTemplate = Handlebars.compile( $('#popup-template').html() );

      for (i in data) {
        var point = data[i];
        if ( point.status == 'canceled' ) continue;

        point.typeData = types[point.type];
        point.formattedCost = formatMoney( point.cost );


        // Plot the points on the map
        var marker = L.marker( [point.lat, point.lon], {
          icon: L.mapbox.marker.icon( point.typeData )
        });

        marker.bindPopup( popupTemplate( point ) );
        marker.addTo(map);

        data[i].marker = marker;
      }

    }
  });



  // Leapin' dat motion
  var hands = {};

  Leap.loop(function( frame ) {
    //console.log('test');

    frame.hands.forEach( function( hand, i ) {
      //console.log(hand.sphereCenter);
      var handObj = ( hands[ i ] || ( hands[ i ] = new Hand(i) ) );
      handObj.setTransform( hand.screenPosition(), hand.roll(), hand.pinchStrength.toPrecision(2), hand );
    });

  }).use( 'screenPosition', { scale: 0.25 } );

  var pageWidth, pageHeight,
      $x     = $('#x'),
      $y     = $('#y'),
      $z     = $('#z'),
      $pinch = $('#pinch'),
      $lat   = $('#lat'),
      $lng   = $('#lng'),
      $zoom  = $('#zoom'),
      pinching = false,
      pinchStart = 0;

  var Hand = function(i) {
    var handObj = this;
    var div = document.createElement('div');
    div.className = 'hand hand-' + i;
    var width = 100, height = 100;

    handObj.setTransform = function( pos, rotation, pinchStrength, hand ) {

      // Approximate Leap Motion ranges:
      // - left to right   •  x  •   -300 to 300   <-- left
      // - down to up      •  y  •      0 to 350   <-- zoom
      // - back to front   •  z  •   -200 to 200   <-- top
      var x = hand.sphereCenter[0].toFixed(0),
          y = hand.sphereCenter[1].toFixed(0),
          z = hand.sphereCenter[2].toFixed(0);

      

      // Make it so pulling your hand away won't send the map flying.
      // This could still use some tweaking.
      if ( hand.confidence < .25 ) return;

      // Pinch and move hand up/down to zoom out/in
      if ( pinchStrength > .85 ) {
        if ( pinching == false ) {
          // Initiate pinching
          pinching = true;
          pinchStart = y;
        } else {
          // Do the zooming
          var zoomDist = (y - pinchStart) * .001;

          if ( zoomDist > 0 ) {
            map.zoomOut( zoomDist, { animate: false } );
          } else {
            map.zoomIn( -zoomDist, { animate: false } );
          }
          // Fix for map tiles not loading when zooming
          // TODO: find a better fix
          $map.trigger('redraw');
        }
      } else {
        // End the pinching
        pinching = false;
      }

      // Visual indicator
      var left = toPixels(x, -300, 300, pageWidth);
      var top  = toPixels(z, -200, 200, pageHeight);
      div.style.transform = 'translate3d(' + left + 'px, ' + top + 'px, 0)';

      // Determine where to move the map
      // How far off center are we, as a percentage?
      var offset = {
        left: easeOffset( toPercent( left, pageWidth  ) ),
        top : easeOffset( toPercent( top , pageHeight ) )
      };

      // Move the map
      $.throttle(120, function() {
        map.panBy( [100*offset.left, 100*offset.top], { animate: false } );

        // Debug values
        $x.text( x );
        $y.text( y );
        $z.text( z );
        $pinch.text( pinchStrength );
        var center = map.getCenter();
        $lat.text( center.lat.toFixed(6) );
        $lng.text( center.lng.toFixed(6) );
        $zoom.text( map.getZoom().toFixed(2) );
      })();
    }

    document.body.appendChild( div );
  }


  //Leap.loopController.setBackground( true );


  $(window).on('resize force-resize', function() {
    pageWidth  = window.innerWidth;
    pageHeight = window.innerHeight;
  }).trigger('force-resize');


  hands[0] = new Hand(0);

});

// Returns a percentage from -1 to 1
// e.g., max of 75 and current of 100 is 0.5, since the center is 50
// or 25 returns -0.5. Thinks of it like this:
// -100% ---------- 0% ------------- 100%
//  0px            500px            1000px
function toPercent (current, max) {
  return (current - max / 2) / (max / 2);
}

// Normalize leap motion coordinates to screen pixels
// e.g., toPixels(0, -300, 300, 1000) --> 500px
function toPixels (current, min, max, screen) {
  // Current is what percentage between min and max?
  var percent = (current - min) / (max - min);
  return screen * percent;
}

function easeOffset ( offset ) {
  return offset * offset * (offset < 0 ? -1 : 1 );
}


  ////////////////////////////////////////////
  //
  // Format Money
  // Adds thousands commas (via stackoverflow)
  // 10000000 --> 10,000,000
  //
  ////////////////////////////////////////////

    function formatMoney(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

