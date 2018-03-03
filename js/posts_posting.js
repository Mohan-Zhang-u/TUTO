'use strict';

$(document).ready(function() {
	isLoggedIn();
	getPosting();
});







function showInterest() {
	var postedBy = $('#poster').text();
	$.post('/show-interest', {
		poster: postedBy,
		content: ' showed interest in your posting #',
		postingNum: $('#postingNum').text()
	}, function(res) {
		if (res === 'same') {
			alert('This is your posting...');
		} else if (res) {
			alert('Notification has been sent to ' + postedBy);
			openProfile();
		} else {
			alert('Please log in');
			window.location.href = 'login';
		}
	});
}

function openProfile() {
	$.post('/open-profile', {other: $('#poster').html()}, function(res) {
		window.location.href = 'profile-other';
	});
}

function getPosting() {
	$.get('/get-posting', function(res) {
		$('#postingNum').html(res.postingNum);
		$('#position').html(res.position);
		$('#title').html(res.title);
		$('#subject').html(res.subject);
		$('#academic').html(res.academicBackground);
		$('#pay').html(res.pay);
		$('#description').html(res.description);
		$('#poster').html(res.poster);
		
		let schedule = res.schedule;
		for (let i = 0; i < schedule.length; i++) {
			populate_schedule(schedule[i]);
		}
	});
}

function populate_schedule(schedule) {	
	let new_div = document.createElement('div');
						
	let new_span = document.createElement('span');
	new_span.appendChild(document.createTextNode(schedule.day + ' ' + schedule.start + ' to ' + schedule.end));
	new_div.appendChild(new_span);
							
	document.getElementById('schedule').appendChild(new_div);
}