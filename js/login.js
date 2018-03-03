'use strict';


$(document).ready(function() {	
	isLoggedIn();
});




function logIn() {
	var toSend = {};
	toSend.accountName = $('#accountName').val();
	toSend.password = $('#password').val();
	$.get('log-in', toSend, function(res) {
		if (res) {
			window.location.href = 'index';
		} else {
			alert('Wrong log in information!');
		}
	});
}