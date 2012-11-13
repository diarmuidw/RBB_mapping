 
 
	// data file with markers (could also be a PHP file for dynamic markers)
	var newDate = new Date;				
	var markerFile = 'markers.json?time=' + newDate.getTime();	
 
	// set default map properties
	var defaultLatlng = new google.maps.LatLng(51.65,-9.00);
	
	// zoom level of the map		
	var defaultZoom = 11;
	
	// variable for map
	var map;
	
	// variable for marker info window
	var infowindow	
 
	// List with all marker to check if exist
	var markerList = {};

	var imagegreen = new google.maps.MarkerImage(
	  'images/mm_20_green.png',
		new google.maps.Size(20,20),
		new google.maps.Point(0,0),
		new google.maps.Point(0,10)
	);
	var imagered = new google.maps.MarkerImage(
	  'images/mm_20_red.png',
		new google.maps.Size(20,20),
		new google.maps.Point(0,0),
		new google.maps.Point(0,10)
	);
	
	var imageorange = new google.maps.MarkerImage(
	  'images/mm_20_orange.png',
		new google.maps.Size(20,20),
		new google.maps.Point(0,0),
		new google.maps.Point(0,10)
	);

	var imageblue = new google.maps.MarkerImage(
		'images/mm_20_blue.png',
		new google.maps.Size(20,20),
		new google.maps.Point(0,0),
		new google.maps.Point(0,10)
		);
	
	var imageyellow = new google.maps.MarkerImage(
		  'images/mm_20_yellow.png',
		new google.maps.Size(20,20),
		new google.maps.Point(0,0),
		new google.maps.Point(0,10)
		);
	 
	// set error handler for jQuery AJAX requests
	$.ajaxSetup({"error":function(XMLHttpRequest,textStatus, errorThrown) {   
		alert(textStatus);
		alert(errorThrown);
		alert(XMLHttpRequest.responseText);
	}});

	// option for google map object
	var myOptions = {
		zoom: defaultZoom,
		center: defaultLatlng,
		mapTypeId: google.maps.MapTypeId.HYBRID
	}


	/**
	 * Load Map
	 */
	function loadMap(){
		//alert('loadmap')
		// create new map make sure a DIV with id myMap exist on page
		map = new google.maps.Map(document.getElementById("myMap"), myOptions);

		// create new info window for marker detail pop-up
		infowindow = new google.maps.InfoWindow();
		
		// load markers
		loadMarkers();
	}
 
 
	/**
	 * Load markers via ajax request from server
	 */
	function loadMarkers(){
 		//alert('loadmarkers')
 		// load marker jSon data	
 		//alert(markerFile)	
		$.getJSON(markerFile, function(data) {
			//alert('after getjson')
			// loop all the markers
			$.each(data.markers, function(i,item){
				//alert('after each')
				// add marker to map
				loadMarker(item);	

			});
		});	
	}

	/**
	 * Load marker to map
	 */
	function loadMarker(markerData){
		
		// create new marker location
		//console.log(markerData['lat'] + ', ' +  markerData['long'])
		var myLatlng = new google.maps.LatLng(markerData['lat'],-1 * markerData['long']);
		img = imagegreen;
		if (markerData['data1'] == "0")
		{
			//do nothing
			
		}else
		{

		/*
		 * [17:43:07] Micheal Twomey: Customer ID, name,Lat, Long,Code A, Code B

			if code A = 0 dont Show
			if Code A = 1 show colour as base colour (i.e as now)
			if code B = 2 - show as colour blue
			if code B = 3 - show as colour yellow
			
			
			if code B = 1 - show as base colour
			if code B = 2 - show as colour light blue
			if code B = 3 - show as colour yellow


		 */
		
		if (markerData['data2'] == "1")
		{
			img = imagegreen;
			
		}
		if (markerData['data2'] == "2")
		{
			img = imageblue;
			
		}
		if (markerData['data2'] == "3")
		{
			img = imageyellow;
			
		}

		
		// create new marker				
		var marker = new google.maps.Marker({
		    id: markerData['id'],
		    map: map, 
		    title: markerData['name'] ,
		    position: myLatlng,
		    icon: img,
			//shadow: shadow

		});

		// add marker to list used later to get content and additional marker information
		markerList[marker.id] = marker;

		// add event listener when marker is clicked
		// currently the marker data contain a dataurl field this can of course be done different
		google.maps.event.addListener(marker, 'click', function() {
			
			// show marker when clicked
			showMarker(marker.id, marker.title);

		});

		// add event when marker window is closed to reset map location
		google.maps.event.addListener(infowindow,'closeclick', function() { 
			map.setCenter(defaultLatlng);
			map.setZoom(defaultZoom);
		}); 	
		}//end of data1==0
	}	
	
	/**
	 * Show marker info window
	 */
	function showMarker(markerId, markerTitle){
		
		// get marker information from marker list
		var marker = markerList[markerId];
		
		// check if marker was found
		if( marker ){
			// get marker detail information from server
			//$.get( 'data/' + marker.id + '.html' , function(data) {
			$.get( '/static/data/test.html' , function(data) {
				// show marker window
				infowindow.setContent("<h2>" + markerTitle + "</h2><p><a target ='_blank' href='http://192.168.1.141/customers/"+ markerId +"'>Click here</a></p>");
				infowindow.open(map,marker);
			});	
		}else{
			alert('Error marker not found: ' + markerId);
		}
	}	
	 
	/**
	 * Adds new marker to list
	 */
	function newMarker(){
 
		// get new city name
		var markerAddress = $('#newMarker').val();
 
		// create new geocoder for dynamic map lookup
		var geocoder = new google.maps.Geocoder();
		
		geocoder.geocode( { 'address': markerAddress}, function(results, status) {
		
			// check response status
			if (status == google.maps.GeocoderStatus.OK) {
				
				// Fire Google Goal 
				_gaq.push(['_trackPageview', '/tracking/marker-submit']);			

				// set new maker id via timestamp
				var newDate = new Date;				
				var markerId = newDate.getTime();
				
				// get name of creator
				var markerCreator = prompt("Please enter your name","");
				
				// create new marker data object
				var markerData = {
					'id': markerId,
					'lat': results[0].geometry.location.lat(),
					'long': results[0].geometry.location.lng(),
					'creator': markerCreator,
					'name': markerAddress,
				};
 
				// save new marker request to server
				$.ajax({
					type: 'POST',			
					url: "data.php",
					data: {
						marker: markerData
					},
					dataType: 'json',
					async: false,
					success: function(result){
						// add marker to map
						loadMarker(result);
												
						// show marker detail
						showMarker(result['id']);
					}
				});
				
			}else if( status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
				alert("Marker not found:" + status);
			}
		});
	}
 