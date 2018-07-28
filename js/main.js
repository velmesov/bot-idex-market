'use strict'

$('button').click(function () {
	$.ajax({
		method: 'post',
		dataType: 'json',
		url: 'conf/main.json',
		data: {
			action: 'test'
		},
		done: function(response) {
			console.log(response);
		},
		fail: function() {
			console.log();
		},
		always: function() {
			console.log('Always msg');
		}
	});
});