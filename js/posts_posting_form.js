'use strict';

var index = 0;

$(document).ready(function() {
	$.get('is-logged-in', function(data) {
		if (data) {
			document.getElementById('container').appendChild(addMsgs(data[0], data[1]));
		} else {
			alert('Please log in.');
			window.location.href = 'logIn';
		}
	});
});

function submit() {
	var data = {};
	if (document.getElementById('tutor').checked) {
		data.position = 'Tutor';
	} else {
		data.position = 'Student';
	}
	data.subject = $('#sel').val();
	data.title = $('#title').val();
	data.academicBackground = $('#academic').val();
	data.pay = $('#pay').val();
	data.description = $('#description').val();
	data.schedule = getSchedule();
	
	$.post('/submit-posting-form', data, function(res) {
		if (res) {
			alert('Successfully posted');
			window.location.href = 'posts';
		}
	});
}








function getSchedule() {
	var schedule = [];
	for (let i = 0; i < index; i++) {
		schedule = schedule.concat(getDays(i));
	}
	return schedule;
}

function getDays(index) {
	var days = [];
	var checkboxes = document.getElementsByName('day' + index);
	var times = getTime(index);
	
	for (let i = 0; i < 7; i++) {
		if (checkboxes[i].checked) {
			let new_day = {day: checkboxes[i].value}
			new_day.start = times.start;
			new_day.end = times.end;
			days.push(new_day);
		}
	}
	return days;
}

function getTime(index) {
	var starts = document.getElementsByClassName('start');
	var ends = document.getElementsByClassName('end');
	return {start: starts[index].value, end: ends[index].value}
}

/** 
 * Add more space for schedule.
 */
function addMore() {	
	var new_div = document.createElement('div');
	new_div.appendChild(create_checkbox('Sun'));
	new_div.appendChild(create_checkbox('Mon'));
	new_div.appendChild(create_checkbox('Tue'));
	new_div.appendChild(create_checkbox('Wed'));
	new_div.appendChild(create_checkbox('Thur'));
	new_div.appendChild(create_checkbox('Fri'));
	new_div.appendChild(create_checkbox('Sat'));
	index++;
	
	new_div.appendChild(create_time('start'));
	var span = document.createElement('span');
	span.appendChild(document.createTextNode('to'));
	new_div.appendChild(span);
	new_div.appendChild(create_time('end'));
	
	var schedule = document.getElementById('schedule');
	schedule.insertBefore(new_div, document.getElementById('add-btn'));
}

function create_checkbox(day) {
	var new_label = document.createElement('label');
	new_label.setAttribute('class', 'check-box-inline');
	
	var new_input = document.createElement('input');
	new_input.setAttribute('type', 'checkbox');
	new_input.setAttribute('name', 'day' + index);
	new_input.setAttribute('value', day);
	
	new_label.appendChild(new_input);
	new_label.appendChild(document.createTextNode(day));
	return new_label;
}

function create_time(className) {
	var new_time = document.createElement('input');
	new_time.setAttribute('type', 'time');
	new_time.setAttribute('class', className);
	return new_time;
}
