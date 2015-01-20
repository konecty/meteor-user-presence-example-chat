Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {status: 1, statusDefault: 1}});
});

Meteor.startup(function() {
	InstanceStatus.registerInstance('Teste');
	InstanceStatus.activeLogs();

	Meteor.methods({
		setUserDefaultStatus: function(status) {
			var allowedStatus = ['auto', 'away', 'busy', 'offline'];
			if (allowedStatus.indexOf(status) === -1) {
				return
			}

			Meteor.users.update({_id: this.userId}, {$set: {statusDefault: status}});
		}
	})
});
