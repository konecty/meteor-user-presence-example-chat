Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {status: 1, statusDefault: 1, statusConnection: 1}});
});

Meteor.startup(function() {
	InstanceStatus.registerInstance('Test');
	InstanceStatus.activeLogs();

	UserPresenceMonitor.start();
});
