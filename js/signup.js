'use strict';


$(document).ready(function() {	
	isLoggedIn();
});


function signUp() {
	var toSend = {};
	toSend.accountName = $('#accountName').val();
	toSend.password = $('#password').val();
	toSend.name = $('#name').val();
	toSend.phone = $('#phone').val();
	toSend.email = $('#email').val();
	
	$.post('/sign-up', toSend, function(res) {		
		if (res) {
			alert('Account successfully created!');
			window.location.href = 'logIn';
		} else {
			alert('User with the given account name already exists!');
		}
	});
}