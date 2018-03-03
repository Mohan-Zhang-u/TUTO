/**
 * This file contains functions that are used in more than two javascipt files.
 */

'use strict';


function isLoggedIn() {
	$.get('is-logged-in', function(data) {
		if (data) {
			document.getElementById('container').appendChild(addMsgs(data[0], data[1]));
		} else {
			document.getElementById('container').appendChild(addForms());
		}
	});
}

function addNotifications(num) {
	var new_li = document.createElement('li');
	var new_a = document.createElement('a');
	new_a.setAttribute('href', 'notifications');
	new_a.appendChild(document.createTextNode('Notifications(' + num + ')'));
	new_li.appendChild(new_a);
	return new_li;
}

function addForms() {
	var new_ul = document.createElement('ul');
	new_ul.setAttribute('class', 'nav navbar-nav navbar-right');
	
	var new_li1 = document.createElement('li');
	var new_a1 = document.createElement('a');
	new_a1.setAttribute('href', 'signUp');
	var new_span1 = document.createElement('span');
	new_span1.setAttribute('class', 'glyphicon glyphicon-user');
	new_span1.appendChild(document.createTextNode('SignUp'));
	new_a1.appendChild(new_span1);
	new_li1.appendChild(new_a1);
	new_ul.appendChild(new_li1);
	
	var new_li2 = document.createElement('li');
	var new_a2 = document.createElement('a');
	new_a2.setAttribute('href', 'logIn');
	var new_span2 = document.createElement('span');
	new_span2.setAttribute('class', 'glyphicon glyphicon-user');
	new_span2.appendChild(document.createTextNode('LogIn'));
	new_a2.appendChild(new_span2);
	new_li2.appendChild(new_a2);
	new_ul.appendChild(new_li2);
	
	return new_ul;
}

function addMsgs(name, num) {
	var new_ul = document.createElement('ul');
	new_ul.setAttribute('class', 'nav navbar-nav navbar-right');
	
	new_ul.appendChild(addNotifications(num));
	
	var new_li2 = document.createElement('li');
	var new_span = document.createElement('span');
	new_span.setAttribute('class', 'navbar-text');
	new_span.appendChild(document.createTextNode('Welcome ' + name + '!'));
	new_li2.appendChild(new_span);
	new_ul.appendChild(new_li2);
	
	var new_li1 = document.createElement('li');
	var new_a = document.createElement('a');
	new_a.setAttribute('href', 'javascript:logOut()');
	var new_span = document.createElement('span');
	new_span.setAttribute('class', 'glyphicon glyphicon-off');
	new_span.appendChild(document.createTextNode('LogOut'));
	new_a.appendChild(new_span);
	new_li1.appendChild(new_a);
	new_ul.appendChild(new_li1);
	
	return new_ul;
}

function logOut() {
	$.get('/log-out', function(res) {
		if (res) {
			alert('Successfully logged out!');
			window.location.href = 'index';
		}
	});
}

function search() {
	var toSearch = $('#search').val();
	$.post('/open-search', {search: toSearch}, function(res) {
		window.location.href = 'posts-search';
	});
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

function savePostingsBuffer(postings) {
	postingBuffer = [];
	for (let i = 0; i < postings.length; i++) {
		postingBuffer.push(postings[i]);
	}
	bufferSize = postings.length;
}

function populatePostings(num) {
	for (let i = num * 20; i < (num + 1) * 20; i++) {
		if (postingBuffer.length == i) {
			break;
		}
		let posting = postingBuffer[i];
		create_posting(posting.postingNum, posting.subject, posting.title, posting.poster, posting.date);
	}
}

function addPagination(num) {
	var new_li = document.createElement('li');
	new_li.setAttribute('name', 'pages');
	var new_a = document.createElement('a');
	new_a.setAttribute('href', 'javascript:openPage(' + (num % 10) + ')');
	new_a.appendChild(document.createTextNode('' + (num % 10 + 1)));
	new_li.appendChild(new_a);
	document.getElementById('pages').appendChild(new_li);
}

function addPrev() {
	var new_li = document.createElement('li');
	new_li.setAttribute('class', 'previous');
	var new_a = document.createElement('a');
	new_a.setAttribute('href', 'javascript:prev()');
	new_li.appendChild(new_a);
	document.getElementById('pages').appendChild(new_li);
}

function addNext() {
	var new_li = document.createElement('li');
	new_li.setAttribute('class', 'next');
	var new_a = document.createElement('a');
	new_a.setAttribute('href', 'javascript:next()');
	new_li.appendChild(new_a);
	document.getElementById('pages').appendChild(new_li);
}

function openPage(num) {
	clearPostings();
	
	document.getElementsByClassName('active')[1].setAttribute('class', '');
	var pages = document.getElementsByName('pages');
	pages[num].setAttribute('class', 'active');
	
	populatePostings(num);
}

function create_posting(postNum, subject, title, poster, date) {
	var new_tr = document.createElement('tr');
	
	var new_td1 = document.createElement('td');
	new_td1.appendChild(document.createTextNode(postNum));
	new_tr.appendChild(new_td1);
	
	var new_td2 = document.createElement('td');
	new_td2.appendChild(document.createTextNode(subject));
	new_tr.appendChild(new_td2);
	
	var new_td3 = document.createElement('td');
	new_td3.setAttribute('class', 'title');
	new_td3.appendChild(document.createTextNode(title));
	new_td3.setAttribute('onClick', 'openPosting(' + postNum + ')');
	new_tr.appendChild(new_td3);
	
	var new_td4 = document.createElement('td');
	new_td4.appendChild(document.createTextNode(poster));
	new_tr.appendChild(new_td4);
	
	var new_td5 = document.createElement('td');
	new_td5.appendChild(document.createTextNode(date));
	new_tr.appendChild(new_td5);
	
	document.getElementById('table-body').appendChild(new_tr);
}

function clearPostings() {
	var table_body = document.getElementById('table-body');
	while (table_body.firstChild) {
		table_body.removeChild(table_body.firstChild);
	}
}

function clearPagination() {
	var pages = document.getElementById('pages');
	while (pages.firstChild) {
		pages.removeChild(pages.firstChild);
	}
}

function sort() {
	var toSend = {};
	
	if (document.getElementsByName('position')[0].checked) {
		toSend.position = 'Tutor';
	} else if (document.getElementsByName('position')[1].checked) {
		toSend.position = 'Student';
	}
	
	if (document.getElementById('sel').value != 'All subjects') {
		toSend.subject = document.getElementById('sel').value;
	}
	
	if (document.getElementById('title').value) {
		toSend.title = {
			'$regex': '.*' + document.getElementById('title').value + '.*',
			'$options': 'i'
		};
	}
	
	$.get('/get-postings-sort', toSend, function(data) {
		var postings = JSON.parse(data);
		
		if (!postings) {
			alert('No posts found');
			window.location.href = 'posts';
			return;
		}
		
		savePostingsBuffer(postings);
		
		clearPostings();
		clearPagination();
		
		for (let i = 0; i < Math.ceil(bufferSize / 20); i++) {
			addPagination(i);
		}
		document.getElementsByName('pages')[0].setAttribute('class', 'active');
		if (bufferSize == 200) {
			addNext();
		}
		populatePostings(0);
	});
}

function updateInfo(accountName, name, phone, email) {
	document.getElementById('accountName').appendChild(document.createTextNode(accountName));
	document.getElementById('name').appendChild(document.createTextNode(name));
	document.getElementById('phone').appendChild(document.createTextNode(phone));
	document.getElementById('email').appendChild(document.createTextNode(email));
}