//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////           Call script with: node pullMessageLogs.js SID Auth StartDate(YYYY-MM-DD) EndDate(YYYY-MM-DD)               ////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(!(process.argv[2]&&process.argv[3]&&process.argv[4]&&process.argv[5]&&process.argv[6])) {

	console.log("Please pass in the following variables: SID, Auth, Start Date, End Date, Error Code");
	process.exit(1);

}

//Modules
var request = require('request');
var fs = require('fs');
var async = require('async');
var moment = require('moment');

var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

//Twilio account variables
var sid = process.argv[2];
var auth = process.argv[3];

//Start and end date. If you try to do more than 100 days at once it might run into the synchronous API call limit
var startDate = moment(process.argv[4], 'YYYY-MM-DD');
var endDate = moment(process.argv[5], 'YYYY-MM-DD');

//Error code to filter one
var errorCode = process.argv[6];

//Output
var stream = fs.createWriteStream('Message log for ' + sid + ': '+ startDate.format('YYYY-MM-DD') + ' to ' + endDate.format('YYYY-MM-DD') + '.csv');

//Initial variables
var baseUrl = 'https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json?PageSize=1000&Page=0';

var auth = {
	user: sid,
	pass: auth
}

var parameters = {}

stream.write('From,To,Direction,Num Segments,Price,Date,Number Type,Error Code,Carrier,SID\n');

//Start pulling logs for each day in the time period selected
for (var m = startDate; m.isBefore(endDate); m.add(1, 'days')) {
  pullMessages(baseUrl + '&DateSent=' + m.format('YYYY-MM-DD'));
  console.log(m.format('YYYY-MM-DD'));
}

//Pulls 1000 messages and then recurses if there's a nextpageuri
//Uses a ported version of google's libphonenumber to assign country values
function pullMessages(uri) {

	parameters = {
		url: uri,
		auth: auth,
	}

	request.get(parameters, function(error, httpResponse, body){

		async.forEachOf(JSON.parse(body).messages, function(item,key){

			if(item.error_code==errorCode){
				
				request.get({auth: auth, uri: 'https://lookups.twilio.com/v1/PhoneNumbers/' + item.to + '?Type=carrier&CountryCode=US'}, function(error, httpResponse, body){

  					stream.write(item.from+','+item.to+','+item.direction+','+item.num_segments+','+item.price+','+item.date_created+','+JSON.parse(body).carrier.type+','+JSON.parse(body).carrier.name+','+item.error_code+','+item.sid+'\n');

				});
				

			}
			

		});

		console.log(JSON.parse(body).next_page_uri);

		// Recurse!
		if(JSON.parse(body).next_page_uri){
			pullMessages('https://api.twilio.com' + JSON.parse(body).next_page_uri);
		}

	});

}