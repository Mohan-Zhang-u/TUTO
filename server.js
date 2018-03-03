'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var clients = require('./data').clients;
var postings = require('./data').postings;
var notifications = require('./data').notifications;

var app = express();

var cur_postNum = 0;
var cur_notficationNum = 0;

app.use(session({
	secret: 'super_secret',
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(__dirname + '/'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));








app.get('/', function(req, res) {
	res.render('html/index');
});

app.get('/TUTOinfo', function(req, res) {
	res.render('html/TUTOinfo');
});

app.get('/posts', function(req, res) {
	req.session.index = 0;
	res.render('html/posts');
});

app.get('/profile', function(req, res) {
	res.render('html/profile');
});

app.get('/profile-other', function(req, res) {
	res.render('html/profile_other');
});

app.get('/index', function(req, res) {
	res.render('html/index');
});

app.get('/contact', function(req, res) {
	res.render('html/contact');
});

app.get('/logIn', function(req, res) {
	res.render('html/login');
});

app.get('/signUp', function(req, res) {
	res.render('html/signup');
});

app.get('/posting', function(req, res) {
	res.render('html/posts_posting');
});

app.get('/posts-search', function(req, res) {
	res.render('html/posts_search');
});

app.get('/posting-form', function(req, res) {
	res.render('html/posts_posting_form');
});

app.get('/notifications', function(req, res) {
	res.render('html/notifications');
});








app.get('/is-logged-in', function(req, res) {
	if (req.session.name) {
		notifications.find({to: req.session.name}, function(err, allNotifications) {
			if (err) res.send(false);

			var toSend = []
			toSend.push(req.session.name);
			toSend.push(allNotifications.length);
			res.send(toSend);
		});
	} else {
		res.send(false);
	}
});

function findPostings(query, res) {
	postings.find(query, function(err, allPostings) {
		if (err) res.send(false);
		
		if (allPostings.length == 0) {
			res.send(false);
			return;
		}
		
		var toSend = [];
		var max = (allPostings.length > 200) ? 200 : allPostings.length;
		for (let i = 0; i < max; i++) {
			toSend.push(allPostings[i]);
		}
		res.send(JSON.stringify(toSend));
	});
}

app.get('/init-posts', function(req, res) {
	findPostings({}, res);
});

app.get('/init-posts-search', function(req, res) {	
	var query = {};
	query.title = {
		'$regex': '.*' + req.session.search + '.*',
		'$options': 'i'
	};
	findPostings(query, res);
});

app.get('/get-profile-postings', function(req, res) {
	var query = {};
	query.poster = req.session.name;
	findPostings(query, res);
});

app.get('/get-profile-postings-other', function(req, res) {	
	var query = {};
	query.poster = req.session.other;
	findPostings(query, res);
});

app.get('/get-postings-sort', function(req, res) {
	findPostings(req.query, res);
});

function getClient(query, res) {
	clients.find(query, function(err, clients) {
		if (err) res.send(false);
		
		if (clients) {
			res.send(clients[0]);
		} else {
			res.send(false);
		}
	});
}

app.get('/get-profile', function(req, res) {
	var query = {};
	query.name = req.session.name;
	getClient(query, res);
});

app.get('/get-profile-other', function(req, res) {
	var query = {};
	query.name = req.session.other;
	getClient(query, res);
});

function getMorePostings(query, index, res) {
	postings.find(query, function(err, allPostings) {
		if (err) res.send(false);
		
		if (!allPostings) {
			res.send(false);
			return;
		}
		
		var max = (postings.length - index > 200) ? 200 : postings.length;
		var toSend = [];
		for (let i = index; i < max; i++) {
			toSend.push(postings[i]);
		}
		res.send(JSON.stringify(toSend));
	});
}

app.get('/get-more-postings-profile', function(req, res) {
	req.session.index = req.query.index;
	
	var query = {};
	query.poster = req.query.name;
	getMorePostings(query, req.query.index, res);
});

app.get('/get-more-postings-profile-other', function(req, res) {
	req.session.index = req.query.index;
	
	var query = {};
	query.poster = req.query.other;
	getMorePostings(query, req.session.index, res);
});

app.get('/get-more-postings-search', function(req, res) {
	req.session.search_index = req.query.index;
	
	var query = {};
	query.title = {
		'$regex': '.*' + req.session.search + '.*',
		'$options': 'i'
	};
	getMorePostings(query, req.session.search_index, res);
});

app.get('/get-more-postings', function(req, res) {
	req.session.index = req.query.index;
	
	getMorePostings({}, req.session.index, res);
});

app.get('/log-in', function(req, res) {
	clients.find(req.query, function(err, client) {
		if (err) res.send(false);
		
		if (client.length > 0) {
			req.session.name = client[0].name;
			res.send(req.session.name);
		} else {
			res.send(false);
		}
	});
});

app.get('/get-posting', function(req, res) {
	postings.find({postingNum: req.session.posting}, function(err, posting) {
		if (err) res.send(false);
		
		res.send(posting[0]);
	});
});

app.get('/log-out', function(req, res) {
	req.session.name = undefined;
	res.send(true);
});

app.get('/get-notifications', function(req, res) {
	notifications.find({to: req.session.name}, function(err, allNotifications) {
		if (err) res.send(false);
		
		var toSend = [];
		for (let i = 0; i < allNotifications.length; i++) {
			toSend.push(allNotifications[i]);
		}
		res.send(JSON.stringify(toSend));
	});
});













app.post('/sign-up', function(req, res) {
	var info = req.body;
	clients.find({accountName: info.accountName}, function(err, exists) {
		if (err) res.send(false);
		
		if (exists.length != 0) {
			res.send(false);
		} else {
			new clients(info).save(function(err, newClient) {
				if (err) throw err;
				
				res.send(true);
			});
		}
	});
});

app.post('/open-posting', function(req, res) {
	req.session.posting = req.body.postingNum;
	res.send(true);
});

app.post('/open-profile', function(req, res) {	
	req.session.other = req.body.other;
	res.send(true);
});

app.post('/submit-posting-form', function(req, res) {
	cur_postNum++;
	var postingInfo = req.body;
	postingInfo.postingNum = cur_postNum;
	postingInfo.poster = req.session.name;
	var d = new Date();
	postingInfo.date = d.getFullYear() + '-';
	if (d.getMonth() + 1 < 10) {
		postingInfo.date += '0' + (d.getMonth() + 1) + '-';
	} else {
		postingInfo.date += (d.getMonth() + 1) + '-';
	}
	if (d.getDate() < 10) {
		postingInfo.date += '0' + d.getDate();
	} else {
		postingInfo.date += d.getDate();
	}
	
	new postings(postingInfo).save(function(err, newPosting) {
		if (err) res.send(false);
		
		res.send(true);
	});
});

app.post('/open-search', function(req, res) {
	req.session.search = req.body.search;
	req.session.search_index = 0;
	res.send(true);
});

app.post('/show-interest', function(req, res) {
	if (req.session.name) {
		cur_notficationNum++;
		var new_notification = {};
		new_notification.notificationNum = cur_notficationNum;
		new_notification.to = req.body.poster;
		new_notification.by = req.session.name;
		new_notification.content = req.body.content;
		new_notification.postingNum = req.body.postingNum;
		
		if (req.session.name === req.body.poster) {
			res.send('same');
		} else {
			new notifications(new_notification).save(function(err, newNotification) {
				if (err) res.send(false);
			
				res.send(true);
			});
		}
	} else {
		res.send(false);
	}
});

app.post('/delete-notification', function(req, res) {
	notifications.remove(req.body, function(err, not) {
		if (err) res.send(false);
		
		res.send(true);
	});
});






var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Running on localhost:%s', server.address().port);
});