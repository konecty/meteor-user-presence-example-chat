/**
* Templates
*/
Meteor.subscribe('users');

Meteor.startup(function() {
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY'
	});
});

UI.body.events({
	'click .statusDefault': function(e) {
		var status = e.target.innerHTML;
		if (status != Meteor.user().statusDefault) {
			Meteor.call('setUserDefaultStatus', status);
		}
	}
});

Template.registerHelper('getUserStatusDefault', function() {
	var user = Meteor.user();
	return user && user.statusDefault;
});

Template.registerHelper('getUserStatus', function(userId) {
	if (userId) {
		var user = Meteor.users.findOne({_id: userId});
	} else {
		var user = Meteor.user();
	}
	return user && user.status;
});


Template.messages.helpers({
	messages: function() {
		return Messages.find({}, { sort: { time: 1}});
	},

	getUserName: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		return user && user.username;
	},

	getUserStatusDefault: function() {
		var user = Meteor.user();
		return user && user.statusDefault;
	}
})

Template.input.events = {
	'keydown input#message' : function (event) {
		if (event.which == 13) { // 13 is the enter key event
			if (Meteor.user()) {
				var userId = Meteor.user()._id;
			} else {
				var userId = '';
			}
			var message = document.getElementById('message');

			if (message.value != '') {
				Messages.insert({
					userId: userId,
					name: name,
					message: message.value,
					time: Date.now()
				});

				document.getElementById('message').value = '';
				message.value = '';
			}
		}
	}
}
