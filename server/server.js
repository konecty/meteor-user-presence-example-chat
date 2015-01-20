Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {status: 1}});
});

Meteor.startup(function() {
	InstanceStatus.registerInstance('Teste');
	InstanceStatus.activeLogs();
});
