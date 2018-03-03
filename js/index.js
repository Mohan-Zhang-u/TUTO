'use strict';

// HARD CODE RECOMMAND IMGS NOW
$(document).ready(function() {	
	isLoggedIn();
});

var url = "cam1.php"; //url to load image from
var refreshInterval = 1000; //in ms
var drawDate = true; //draw date string
var img = document.getElementById('bottomimg');
// hard coded here, gonna change once finished rating system in phase5
var rate = 0;
var imgs= [];
imgs[0]="recommandimg/1.jpg";
imgs[1]="recommandimg/22e87454-48a4-4f3f-a7c5-5e9e5598deab.jpg";
imgs[2]="recommandimg/pexels-photo-46710.jpeg";
imgs[3]="recommandimg/img_67920257.jpg";


setInterval(refresh,refreshInterval);

function refresh()
{	
	if (rate > 2) // this is for 4 imgs
	{
		rate = 0;
	}

	else
	{
		rate = rate + 1;
	}
	img.setAttribute('src', imgs[rate]);
}
// HARD CODE RECOMMAND IMGS END