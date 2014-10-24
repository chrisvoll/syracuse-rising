$(function() {


  // Dropcap
  var dropcaps = document.querySelectorAll(".dropcap");
  window.Dropcap.layout(dropcaps, 3);


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
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
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
    }
  };


  ////////////////////////////////////////////
  //
  // Money Charts
  //
  ////////////////////////////////////////////

  var margin = { top: 30, right: 0, bottom: 10, left: 5 },
      width  = $('#money').parent().width() - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
  var x = d3.scale.linear()
      .range( [0, width] );
  var y = d3.scale.ordinal()
      .rangeRoundBands( [0, height], .2);
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

  var money = d3.select('#money').append('svg')
      .attr( 'width',  width  + margin.left + margin.right  )
      .attr( 'height', height + margin.top  + margin.bottom )
    .append('g')
      .attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' );
  var average = d3.select('#average').append('svg')
      .attr( 'width',  width  + margin.left + margin.right  )
      .attr( 'height', height + margin.top  + margin.bottom )
    .append('g')
      .attr( 'transform', 'translate(' + margin.left + ', ' + margin.top + ')' );

  var moneyTip = d3.tip().attr( 'class', 'd3-tip' ).html( function(d) {
    return '$' + formatMoney( d.total );
  });
  var averageTip = d3.tip().attr( 'class', 'd3-tip' ).html( function(d) {
    return '$' + formatMoney( d.average );
  })
  money.call( moneyTip );
  average.call( averageTip );

  var t = [];


  ////////////////////////////////////////////
  //
  // Get the data
  //
  ////////////////////////////////////////////

  // Grab the data, plot the points
  Tabletop.init({
    key: '19JnF3xjfnGSLN0Gzoh-Gw2pNfbQVJYGq7XzZMYfMK-Q',
    callback: function(data, tabletop) {

      // Format data for datatables
      var table = [];
      for (i in data) {
        var point = data[i];
        table.push([
          point.name,
          point.location.replace(', Syracuse, NY', ''),
          types[point.type].label,
          point.cost ? '$' + point.cost : ''
        ]);
      }

      $('.datatable').dataTable({
        data: table,
        columns: [
          { title: 'Name' },
          { title: 'Location' },
          { title: 'Type' },
          { title: 'Cost' }
        ],
        order: [[ 3, 'desc' ]],
        paging: false,
        searching: false
      });

      // Plot the points
      for (i in data) {
        var point = data[i];
        var marker = L.marker( [point.lat, point.lon], {
          icon: L.mapbox.marker.icon( types[point.type] )
        });
        marker.bindPopup( '<strong>' + point.name + '</strong>, ' + types[point.type].label + ( point.cost ? ', $' + formatMoney(point.cost) : '' ) );
        marker.addTo(map);

        if (point.cost) {
          types[point.type].total += +point.cost.replace(/,/g, '');

          // only count the location if it has a cost
          types[point.type].count++;
        }
      }

      // Reformat the data in a way that D3 can understand
      for ( i in types ) {
        t.push({
          slug: i,
          label: types[i].label,
          total: types[i].total,
          count: types[i].count,
          average: Math.round( types[i].total / types[i].count ),
          color: types[i]['marker-color']
        });
      }

      t.sort( function(a, b) {
        return b.total - a.total;
      });
      x.domain( [0, d3.max(t, function(d) { return d.total; })] )
      y.domain( t.map( function(d) { return d.label; }) );

      money.selectAll( '.bar' )
          .data( t )
        .enter().append('rect')
          .attr( 'class', function(d) { return 'bar bar-' + d.slug; } )
          .attr( 'x', x(0) )
          .attr( 'y', function(d) { return y(d.label); } )
          .attr( 'width', function(d) { return x( d.total ); } )
          .attr( 'height', y.rangeBand() )
          .style( 'fill', function(d) { return d.color; } )
          .on( 'mouseover', function(d) {
            moneyTip.show.call( this, d );
            d3.select(this).transition(200).style( 'opacity', .7 );
          })
          .on( 'mouseout', function(d) {
            moneyTip.hide.call( this, d );
            d3.select(this).transition(200).style( 'opacity', 1 );
          });
      money.append( 'g' )
          .attr( 'class', 'x axis' )
          .call( xAxis );
      money.append( 'g' )
          .attr( 'class', 'y axis' )
          .call( yAxis );



      // Average Cost Chart

      t.sort( function(a, b) {
        return b.average - a.average;
      });
      x.domain( [0, d3.max(t, function(d) { return d.average; })] );
      y.domain( t.map( function(d) { return d.label; }) );

      average.selectAll( '.bar' )
          .data( t )
        .enter().append('rect')
          .attr( 'class', function(d) { return 'bar bar-' + d.slug; } )
          .attr( 'x', x(0) )
          .attr( 'y', function(d) { return y(d.label); } )
          .attr( 'width', function(d) { return x( d.average ); } )
          .attr( 'height', y.rangeBand() )
          .style( 'fill', function(d) { return d.color; } )
          .on( 'mouseover', function(d) {
            averageTip.show.call( this, d );
            d3.select(this).transition(200).style( 'opacity', .7 );
          })
          .on( 'mouseout', function(d) {
            averageTip.hide.call( this, d );
            d3.select(this).transition(200).style( 'opacity', 1 );
          });
      average.append( 'g' )
          .attr( 'class', 'x axis' )
          .call( xAxis );
      average.append( 'g' )
          .attr( 'class', 'y axis' )
          .call( yAxis );
      
    },
    simpleSheet: true
  });

  function formatMoney(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function resizeCharts() {
    width = $('#money').parent().width() - margin.left - margin.right;
    x.range( [0, width] );

    d3.select( money.node().parentNode )
      .style( 'width', ( width + margin.left + margin.right) + 'px' );

    x.domain( [0, d3.max(t, function(d) { return d.total; })] );
    money.selectAll( '.bar' )
      .attr( 'width', function(d) { return x( d.total ) });
    money.select('.x.axis')
      .call( xAxis );


    d3.select( average.node().parentNode )
      .style( 'width', ( width + margin.left + margin.right ) + 'px' );

    x.domain( [0, d3.max(t, function(d) { return d.average; })] );
    average.selectAll( '.bar' )
      .attr( 'width', function(d) { return x( d.average ) });
    average.select('.x.axis')
      .call( xAxis );
  }

  $(window).on('resize', resizeCharts);














});







$(function() {
  // Setup how you want it to look
  var width = $('#national').width(),
      height = 600;

  // Helpers for coloring the individual counties
  var rateById = d3.map();
  var quantize = d3.scale.quantize()
      .domain( [0, 25] )
      .range( d3.range(9).map( function(i) {
        return 'q' + i;
      }));

  // Setup the map projection, sizing
  var projection = d3.geo.albersUsa()
      .scale( width * 1.33 )
      .translate( [width / 2, height / 2] );
  var path = d3.geo.path()
      .projection( projection );

  // Create the svg object
  var svg = d3.select( '#national' ).append( 'svg' )
      .attr( 'width', width )
      .attr( 'height', height );

  // Setup the tooltip
  var tip = d3.tip()
    .attr( 'class', 'd3-tip' )
    .html( function (d) {
      var county = rateById.get( d.id );
      return county.name + ': ' + county.percent + '%';
    });
  svg.call( tip );

  // Load in the data, and call ready() when everything's good
  queue()
    .defer( d3.json, './data/us.json' )
    .defer( d3.csv,  './data/poverty.csv', function (d) {
      rateById.set( d.id, {
        name: d.name,
        percent: +d.percent
      });
    })
    .await( ready );

  function ready( error, us ) {
    if ( error ) return console.log( error );

    // Counties
    svg.append( 'g' )
      .attr( 'class', 'counties' )
      .selectAll( 'path' )

        // Ingest all the data
        .data( topojson.feature( us, us.objects.counties ).features )
          .enter().append( 'path' )

        // Add the CSS class for color
        .attr( 'class', function (d) {
          var county = rateById.get( d.id );
          if ( !county ) return quantize(0);
          return quantize( county.percent );
        })

        // Draw the paths
        .attr( 'd', path )

        // Tooltip Hover & Effects
        .on( 'mouseover', function(d) {
          d3.select(this).transition().style( 'opacity', .5 );
          tip.show.call(this, d);
        })
        .on( 'mouseout', function(d) {
          d3.select(this).transition().style( 'opacity', 1 );
          tip.hide.call(this, d);
        });

    // State borders
    svg.append( 'path' )
      .datum( topojson.mesh( us, us.objects.states, function( a, b ) {
        return a !== b;
      }))
      .attr( 'class', 'states' )
      .attr( 'd', path );
  }

  d3.select( self.frameElement ).style( 'height', height + 'px' );
});