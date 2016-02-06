$(function() {

  ////////////////////////////////////////////
  //
  // Syracuse Map
  //
  ////////////////////////////////////////////

    // Init the map
    var map = L.map('map', {
                scrollWheelZoom: false
              }).setView( new L.LatLng(43.0476822,-76.1486941), 14 );
    L.mapbox.accessToken = 'pk.eyJ1IjoiY2hyaXN2b2xsIiwiYSI6InlkMXlCUjgifQ.eT64_GtCp4jLBjrJlSlvTQ';
    L.mapbox.tileLayer('chrisvoll.k1g49ab3', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(map);


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

    var status = {
      'completed'            : 'Completed',
      'under-construction'   : 'Under Construction',
      'planned'              : 'Planned',
      'unclear'              : 'Unclear',
      'canceled'             : 'Canceled',
      'proposed'             : 'Proposed'
    };


  ////////////////////////////////////////////
  //
  // Horizontal Bar Graphs
  // Initial setup, no data yet
  //
  ////////////////////////////////////////////

  var margin = { top: 30, right: 0, bottom: 10, left: 5 },
      width  = $('#money').parent().width() - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range( [0, width] );

  var y = d3.scale.ordinal()
      .rangeRoundBands( [0, height], .2);

  var tall_y = d3.scale.ordinal()
      .rangeRoundBands( [0, height * 2], .2);

  var formatMillions = d3.format('.2s');

  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(5)
      .tickFormat( function(d) {
        return formatMillions(d).replace('M', 'm').replace('G', 'b').replace('.0', '');
      })
      .orient('top');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('right');

  var tall_yAxis = d3.svg.axis()
      .scale(tall_y)
      .orient('right');

  // Add charts to DOM
  var charts = {
    money: d3.select('#money').append('svg')
              .attr( 'width',  width  + margin.left + margin.right  )
              .attr( 'height', height + margin.top  + margin.bottom )
            .append('g')
              .attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' ),
    average: d3.select('#average').append('svg')
              .attr( 'width',  width  + margin.left + margin.right  )
              .attr( 'height', height + margin.top  + margin.bottom )
            .append('g')
              .attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' ),
    neighborhoods: d3.select('#neighborhoods').append('svg')
              .attr( 'width',  width      + margin.left + margin.right  )
              .attr( 'height', height * 2 + margin.top  + margin.bottom )
            .append('g')
              .attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' )
  };

  // Tooltips
  var tips = {
    money: d3.tip().attr( 'class', 'd3-tip' ).html( function(d) {
              return '$' + formatMoney( d.total );
            }),
    average: d3.tip().attr( 'class', 'd3-tip' ).html( function(d) {
              return '$' + formatMoney( d.average ) + ' - ' + d.count + ' projects';
            }),
    neighborhoods: d3.tip().attr( 'class', 'd3-tip' ).html( function(d) {
              return '$' + formatMoney( d.total );
            })
  };
  charts.money.call( tips.money );
  charts.average.call( tips.average );
  charts.neighborhoods.call( tips.neighborhoods );

  // Create the data variables outside of the tabletop callback scope
  // so we can use them when resizing the window
  var d3Data    = [],
      tableData = [],
      neighborhoodsData = {},
      neighborhoodsSorted = [],
      $details = $('.map-details');


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

      var detailsTemplate = Handlebars.compile( $('#details-template').html() );

      for (i in data) {
        var point = data[i];
        if ( point.status == 'canceled' ) continue;

        point.typeData      = types[point.type];
        point.statusLabel   = status[point.status];
        point.formattedCost = formatMoney( point.cost );

        // Reformat for Datatables: [ [ a,b,c ], ... ]
        tableData.push([
          point.details ? '<a href="' + point.details + '">' + point.name + '</a>' : point.name,
          point.location.replace(', Syracuse, NY', ''),
          point.typeData.label,
          point.cost ? '$' + point.cost : ''
        ]);

        // Plot the points on the map, if we have an address
        if ( point.lat && point.lon ) {
          var marker = L.marker( [point.lat, point.lon], {
            icon: L.mapbox.marker.icon( point.typeData )
          });
          marker.point = point;

          marker.on('click', function() {
            $details.html( detailsTemplate( this.point ) );
          });

          marker.addTo(map);
          data[i].marker = marker;
        }

        if ( point.cost ) {

          // Types
          types[point.type].total += +point.cost.replace(/,/g, '');
          types[point.type].count ++;

          // Neighborhoods
          if ( point.neighborhood ) {
            if ( !neighborhoodsData[ point.neighborhood ] ) {
              neighborhoodsData[ point.neighborhood ] = {
                name: point.neighborhood,
                total: 0,
                count: 0
              };
            }
            neighborhoodsData[point.neighborhood].total += +point.cost.replace(/,/g, '');
            neighborhoodsData[point.neighborhood].count ++;
          }
        }
      }

      // Reformat Types for D3:
      for ( i in types ) {
        d3Data.push({
          slug    : i,
          label   : types[i].label,
          total   : types[i].total,
          count   : types[i].count,
          average : Math.round( types[i].total / types[i].count ),
          color   : types[i]['marker-color']
        });
      }

      // Reformat Neighborhoods for D3:
      for ( i in neighborhoodsData ) {
        neighborhoodsSorted.push( neighborhoodsData[i] );
      }


      ////////////////////////////////////////////
      //
      // Data table
      //
      ////////////////////////////////////////////

      $('.datatable').dataTable({
        data: tableData,
        columns   : [
          { title : 'Name' },
          { title : 'Location' },
          { title : 'Type' },
          { title : 'Cost' }
        ],
        order     : [[ 3, 'desc' ]],
        paging    : false,
        searching : false
      });
      $('.project-count').html( tableData.length );


      ////////////////////////////////////////////
      //
      // Money Breakdown Graph
      //
      ////////////////////////////////////////////

      d3Data.sort( function(a, b) { return b.total - a.total; });
      x.domain( [0, d3.max(d3Data, function(d) { return d.total; })] )
      y.domain( d3Data.map( function(d) { return d.label; }) );

      charts.money.selectAll( '.bar' )
          .data( d3Data )
        .enter().append('rect')
          .attr( 'class', function(d) { return 'bar bar-' + d.slug; } )
          .attr( 'x', x(0) )
          .attr( 'y',     function(d) { return y( d.label ); } )
          .attr( 'width', function(d) { return x( d.total ); } )
          .attr( 'height', y.rangeBand() )
          .style( 'fill', function(d) { return d.color; } )
          .on( 'mouseover', function(d) {
            tips.money.show(d);
            d3.select(this).transition(200).style( 'opacity', .7 );
          })
          .on( 'mouseout', function(d) {
            tips.money.hide(d);
            d3.select(this).transition(200).style( 'opacity', 1 );
          });
      charts.money.append( 'g' )
          .attr( 'class', 'x axis' )
          .call( xAxis );
      charts.money.append( 'g' )
          .attr( 'class', 'y axis' )
          .call( yAxis );



      ////////////////////////////////////////////
      //
      // Average Cost Graph
      //
      ////////////////////////////////////////////

      d3Data.sort( function(a, b) { return b.average - a.average; });
      x.domain( [0, d3.max(d3Data, function(d) { return d.average; })] );
      y.domain( d3Data.map( function(d) { return d.label; }) );

      charts.average.selectAll( '.bar' )
          .data( d3Data )
        .enter().append('rect')
          .attr( 'class', function(d) { return 'bar bar-' + d.slug; } )
          .attr( 'x', x(0) )
          .attr( 'y',     function(d) { return y( d.label   ); } )
          .attr( 'width', function(d) { return x( d.average ); } )
          .attr( 'height', y.rangeBand() )
          .style( 'fill', function(d) { return d.color; } )
          .on( 'mouseover', function(d) {
            tips.average.show(d);
            d3.select(this).transition(200).style( 'opacity', .7 );
          })
          .on( 'mouseout', function(d) {
            tips.average.hide(d);
            d3.select(this).transition(200).style( 'opacity', 1 );
          });
      charts.average.append( 'g' )
          .attr( 'class', 'x axis' )
          .call( xAxis );
      charts.average.append( 'g' )
          .attr( 'class', 'y axis' )
          .call( yAxis );


      ////////////////////////////////////////////
      //
      // Neighborhoods Graph
      //
      ////////////////////////////////////////////

      neighborhoodsSorted.sort( function(a, b) { return b.total - a.total; });
      x.domain( [0, d3.max(neighborhoodsSorted, function(d) { return d.total; })] );
      tall_y.domain( neighborhoodsSorted.map( function(d) { return d.name; }) );

      charts.neighborhoods.selectAll( '.bar' )
          .data( neighborhoodsSorted )
        .enter().append('rect')
          .attr( 'class', function(d) { return 'bar bar-neighborhood'; } )
          .attr( 'x', x(0) )
          .attr( 'y',     function(d) { return tall_y( d.name ); } )
          .attr( 'width', function(d) { return x( d.total ); } )
          .attr( 'height', tall_y.rangeBand() )
          .on( 'mouseover', function(d) {
            tips.neighborhoods.show(d);
            d3.select(this).transition(200).style( 'opacity', .7 );
          })
          .on( 'mouseout', function(d) {
            tips.neighborhoods.hide(d);
            d3.select(this).transition(200).style( 'opacity', 1 );
          });
      charts.neighborhoods.append( 'g' )
          .attr( 'class', 'x axis' )
          .call( xAxis );
      charts.neighborhoods.append( 'g' )
          .attr( 'class', 'y axis' )
          .call( tall_yAxis );
    }
  });


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


  ////////////////////////////////////////////
  //
  // Resize Charts
  // Makes charts responsive, resizing on
  // window resize
  //
  ////////////////////////////////////////////

    function resizeCharts() {
      width = $('#money').parent().width() - margin.left - margin.right;
      x.range( [0, width] );

      d3.select( charts.money.node().parentNode )
        .style( 'width', ( width + margin.left + margin.right) + 'px' );

      x.domain( [0, d3.max(d3Data, function(d) { return d.total; })] );
      charts.money.selectAll( '.bar' )
        .attr( 'width', function(d) { return x( d.total ) });
      charts.money.select('.x.axis')
        .call( xAxis );


      d3.select( charts.average.node().parentNode )
        .style( 'width', ( width + margin.left + margin.right ) + 'px' );

      x.domain( [0, d3.max(d3Data, function(d) { return d.average; })] );
      charts.average.selectAll( '.bar' )
        .attr( 'width', function(d) { return x( d.average ) });
      charts.average.select('.x.axis')
        .call( xAxis );


      d3.select( charts.neighborhoods.node().parentNode )
        .style( 'width', ( width + margin.left + margin.right ) + 'px' );

      x.domain( [0, d3.max(neighborhoodsSorted, function(d) { return d.total; })] );
      charts.neighborhoods.selectAll( '.bar' )
        .attr( 'width', function(d) { return x( d.total ) });
      charts.neighborhoods.select('.x.axis')
        .call( xAxis );
    }

    $(window).on('resize', $.throttle( 250, resizeCharts ) );

});


/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

