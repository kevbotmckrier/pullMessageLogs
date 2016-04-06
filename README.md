##Pull Twilio Message Logs

###Installation


Clone repo into a local directory and use `npm install` to install dependencies.

###Pulling complete message logs

Call with 
```
node pullMessageLogs.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)]
```

It will generate a .csv file called MessageLog for [AccountSid] from [StartDate] to [EndDate] containing all of your SMS and MMS usage for the specified time period.

This will include the From number, the To number, inbound/outbound, the number of segments, the price, the date, the country of the receiving number, the country of the sending number, and the Message SID.

Currently unable to determine the country of short codes used as short codes have overlapping format between countries such as US and Canada.

###Pulling message logs filtered on error codes

Call with 
```
node pullMessageLogsFilteredOnErrorWithCarrierLookup.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)] [Error Code]
```

It will generate a .csv file called MessageLog for [AccountSid] from [StartDate] to [EndDate] containing all of your SMS and MMS usage for the specified time period that have the error code you specified when calling the script.

It will also perform a carrier lookup on the numbers with that error code so RUNNING THIS SCRIPT WILL COST YOU MONEY. $0.005 per number at list rates.

This will include the From number, the To number, inbound/outbound, the number of segments, the price, the date, carrer type, carrier name, error code, and the Message SID.