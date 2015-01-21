/**
* Templates
*/
Meteor.subscribe('users');
Meteor.subscribe('messages');

Meteor.startup(function() {
	var notification = new Audio("http://freesound.org/data/previews/235/235911_2391840-lq.mp3");

	var startup = false;
	Messages.find().observe({
		added: function(record) {
			if (startup === true && record.userId !== Meteor.userId()) {
				notification.play();
			}
		}
	});

	setTimeout(function() {
		startup = true;
	}, 1000);

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
	if (userId === Meteor.userId()) {
		return 'me';
	};

	var user = Meteor.users.findOne({_id: userId});
	return user && user.username;
});

Template.registerHelper('getClassForSelfUser', function(userId) {
	return userId === Meteor.userId() ? 'self-user' : '';
});

Template.registerHelper('preMD', new Package.templating.Template('preMD', function() {
	var self = this;
	var text = "";
	if(self.templateContentBlock) {
		text = Package.blaze.Blaze._toText(self.templateContentBlock, Package.htmljs.HTML.TEXTMODE.STRING);
	}

	text = text.replace(/#/g, '\\#');
	return text;
}));

Template.registerHelper('postMD', new Package.templating.Template('postMD', function() {
	var self = this;
	var text = "";
	if(self.templateContentBlock) {
		text = Package.blaze.Blaze._toText(self.templateContentBlock, Package.htmljs.HTML.TEXTMODE.STRING);
	}

	text = text.replace(/(@[^\s]+)/g, '<span class="user-reference">$1</span>');
	return HTML.Raw(text);
}));

Template.messages.helpers({
	messages: function() {
		return Messages.find({}, {sort: {time: 1}});
	}
});

Template.message.rendered = function() {
	var messages = $('.messages');
	messages.scrollTop($('.messages > table').height());
};

Template.users.helpers({
	users: function() {
		return Meteor.users.find({}, {sort: {username: 1}});
	}
});

Template.input.events = {
	'keydown #input' : function (event) {
		if (event.which == 13 && event.shiftKey == false) { // 13 is the enter key event
			if (Meteor.user()) {
				var userId = Meteor.user()._id;
			} else {
				var userId = '';
			}
			var input = $('#input');

			if (input.val() != '') {
				var message = input.val();

				Messages.insert({
					userId: userId,
					message: message,
					time: new Date()
				});

				event.preventDefault();
				input.val('');
			}
		}
	}
}
