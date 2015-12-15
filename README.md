##Pull Twilio Message Logs

###Installation


Clone repo into a local directory and use `npm insall` to install dependencies.

###Use

Call with 
```
node pullMessageLogs.js [Account SID] [Account Auth Token] [Start Date (YYYY-MM-DD)] [End Date (YYYY-MM-DD)]
```

It will generate a .csv file called MessageLog for [AccountSid] from [StartDate] to [EndDate] containing all of your SMS and MMS usage for the specified time period.

This will include the From number, the To number, inbound/outbound, the number of segments, the price, the date, the country of the receiving number, the country of the sending number, and the Message SID.

Currently unable to determine the country of short codes used as short codes have overlapping format between countries such as US and Canada.
