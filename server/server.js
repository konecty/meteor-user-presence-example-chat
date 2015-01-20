Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {status: 1, statusDefault: 1, statusConnection: 1, username: 1}});
});

Meteor.publish('messages', function() {
	return Messages.find({}, {limit: 100, sort: {time: -1}});
});

Meteor.startup(function() {
	Messages.allow({
		update: false,
		remove: false,
		insert: function(userId, doc) {
			doc.userId = userId;
			doc.time = new Date();
			return true;
		}
	});

	InstanceStatus.registerInstance('Test');
	InstanceStatus.activeLogs();

	UserPresenceMonitor.start();

	UserPresence.activeLogs();
	UserPresence.start();
});
