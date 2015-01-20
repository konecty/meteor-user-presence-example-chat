/**
* Templates
*/
Meteor.subscribe('users');

Meteor.startup(function() {
	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY'
	});
});

Template.messages.helpers({
	messages: function() {
		return Messages.find({}, { sort: { time: 1}});
	},

	getUserStatus: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		return user && user.status;
	},

	getUserName: function(userId) {
		var user = Meteor.users.findOne({_id: userId});
		return user && user.username;
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
