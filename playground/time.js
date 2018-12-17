var moment = require('moment');

var date = new Date();

console.log(date.getMonth());

var someTimestamp = moment().valueOf();
console.log(someTimestamp)
var date = moment();
var createdAt = 1234;
var date = moment(createdAt);
//date.add(1,'year').add(2,'month');
console.log(date.format('h:mm A'));
