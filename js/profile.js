'use strict';


var server_index = 0;
var postingBuffer = [];
var bufferSize = 0;

$(document).ready(function() {
	isLoggedIn();
	getProfile();
});




function getProfile() {
	$.get('get-profile', function(client) {
		if (client) {
			updateInfo(client.accountName, client.name, client.phone, client.email);
		} else {
			alert('Please log in.');
			window.location.href = 'logIn';
		}
	});
	
	$.get('get-profile-postings', function(data) {
		var postings = JSON.parse(data);
		savePostingsBuffer(postings);
		
		for (let i = 0; i < Math.ceil(bufferSize / 20); i++) {
			addPagination(i);
		}
		
		if (postings.length != 0) {
			document.getElementsByName('pages')[0].setAttribute('class', 'active');
		}
		
		if (bufferSize == 200) {
			addNext();
		}
		populatePostings(0);
	});
}

function next() {
	server_index += bufferSize;
	
	$.get('/get-more-postings-profile', {index: server_index}, function(res) {		
		var postings = JSON.parse(data);
		savePostingsBuffer(postings);
		
		clearPagination();
		clearPostings();
		
		addPrev();
		for (let i = 0; i < Math.ceil(bufferSize / 20); i++) {
			addPagination(i + server_index / 20);
		}
		document.getElementsByName('pages')[0].setAttribute('class', 'active');
		
		if (bufferSize == 200) {
			addNext();
		}
		populatePostings(Math.floor());
	});
}

function prev() {
	server_index -= 200;
	
	$.get('/get-more-postings-profile', {index: server_index}, function(res) {		
		var postings = JSON.parse(data);
		savePostingsBuffer(postings);
		
		clearPagination();
		clearPostings();
		
		if (server_index >= 200) {
			addPrev();
		}
		for (let i = 0; i < Math.ceil(bufferSize / 20); i++) {
			addPagination(i + server_index / 20);
		}
		document.getElementsByName('pages')[0].setAttribute('class', 'active');
		
		addNext();
		
		populatePostings(Math.floor());
	});
}