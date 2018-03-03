'use strict';

$(document).ready(function() {
	isLoggedIn();
	get_notifications();
});

function get_notifications() {
	$.get('/get-notifications', function(data) {
		var notifications = JSON.parse(data);
		for (let i = notifications.length - 1; i >= 0; i--) {
			addNotification(notifications[i].to, notifications[i].content, notifications[i].postingNum, notifications[i].notificationNum, notifications[i].by);
		}
	});
}

function addNotification(num, content, postingNum, notificationNum, by) {
	var new_li = document.createElement('li');
	new_li.setAttribute('class', 'list-group-item');
	new_li.setAttribute('name', notificationNum);
	
	var new_a0 = document.createElement('a');
	new_a0.appendChild(document.createTextNode(by));
	new_a0.setAttribute('name', by);
	new_a0.setAttribute('href', 'javascript:openProfile("' + by + '")');
	new_li.appendChild(new_a0);
	
	var new_span = document.createElement('span');
	new_span.appendChild(document.createTextNode(content));
	new_li.appendChild(new_span);
	
	var new_a1 = document.createElement('a');
	new_a1.appendChild(document.createTextNode(postingNum));
	new_a1.setAttribute('href', 'javascript:openPosting(' + postingNum + ')');
	new_li.appendChild(new_a1);
	
	var new_a2 = document.createElement('a');
	new_a2.appendChild(document.createTextNode('delete'));
	new_a2.setAttribute('class', 'float-right');
	new_a2.setAttribute('href', 'javascript:deleteNotification(' + notificationNum + ')');
	new_li.appendChild(new_a2);
	
	document.getElementById('notifications').appendChild(new_li);
}

function openPosting(postNum) {
	$.post('/open-posting', {
		postingNum: postNum
	}, function(res) {
		if (res) {
			window.location.href = 'posting';
		}
	});
}

function deleteNotification(num) {
	$.post('/delete-notification', {notificationNum: num}, function(res) {
		removeNotification(num);
		window.location.href = 'notifications';
	});
}

function removeNotification(num) {
	document.getElementById('notifications').removeChild(document.getElementsByName(num)[0]);
}

function openProfile(by) {
	$.post('/open-profile', {
		other: by
	}, function(res) {
		window.location.href = 'profile-other';
	});
}