/**
* Templates
*/
Meteor.subscribe('users');
Meteor.subscribe('messages');

Meteor.startup(function() {
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	});

	UserPresence.awayTime = 60000;
	UserPresence.awayOnWindowBlur = false;
	UserPresence.start();

	var messages = $('.messages');
	messages.scrollTop(messages.height());
});

UI.body.events({
	'click .statusDefault': function(e) {
		var status = e.target.innerHTML;
		if (status != Meteor.user().statusDefault) {
			Meteor.call('UserPresence:setDefaultStatus', status);
		}
	}
});

Template.registerHelper('getUserStatusDefault', function() {
	var user = Meteor.user();
	return (user && user.statusDefault) || 'online';
});

Template.registerHelper('getUserStatus', function(userId) {
	if (userId) {
		var user = Meteor.users.findOne({_id: userId});
	} else {
		var user = Meteor.user();
	}
	return user && user.status;
});

Template.registerHelper('logged', function(userId) {
	return Meteor.userId() != null;
});

Template.registerHelper('getUserName', function(userId) {
	var user = Meteor.users.findOne({_id: userId});
	return user && user.username;
});

Template.messages.helpers({
	messages: function() {
		return Messages.find({}, {sort: {time: 1}});
	}
});

Template.message.rendered = function() {
	var messages = $('.messages');
	messages.scrollTop(messages.height());
};

Template.users.helpers({
	users: function() {
		return Meteor.users.find({}, {sort: {username: 1}});
	}
});

Template.input.events = {
	'keydown input#input' : function (event) {
		if (event.which == 13) { // 13 is the enter key event
			if (Meteor.user()) {
				var userId = Meteor.user()._id;
			} else {
				var userId = '';
			}
			var input = document.getElementById('input');

			if (input.value != '') {
				Messages.insert({
					userId: userId,
					message: input.value,
					time: Date.now()
				});

				input.value = '';
			}
		}
	}
}
