
    var x=document.getElementById("demo");
    function getLocation(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
        }else{
            x.innerHTML="Geolocation is not supported by this browser.";
        }
    }
    function showPosition(position){
    	console.log(position.coords.latitude+","+position.coords.longitude)
        x.innerHTML="Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.longitude;
    }
getLocation();
