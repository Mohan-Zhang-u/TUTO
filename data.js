var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var Clients = new Schema(
{
	accountName: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	}
});

var Notifications = new Schema({
	notificationNum: {
		type: Number,
		required: true,
		unique: true
	},
	to: {
		type: String,
		required: true
	},
	by: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	postingNum: {
		type: Number,
		required: true
	}
});

var Postings = new Schema(
{
	postingNum: {
		type: Number,
		required: true,
		unique: true
	},
	position: {
		type: String
	},
	subject: {
		type: String,
		required: true
	},
	title: {
		type:String,
		required: true
	},
	poster: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	schedule: [{
		day: {
			type: String
		},
		start: {
			type: String
		},
		end: {
			type: String
		}
	}],
	academicBackground: {
		type: String
	},
	pay: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: true
	}
});

mongoose.connect('mongodb://kangdaewoo:team-tuto@ds147920.mlab.com:47920/data');

module.exports.clients = mongoose.model('client', Clients);
module.exports.notifications = mongoose.model('notification', Notifications);
module.exports.postings = mongoose.model('posting', Postings);