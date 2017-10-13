var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification


app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "team-zzzz") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
		console.log("test1");
		// Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
			console.log("test2");
      // Iterate over each messaging event
    //  entry.messaging.forEach(function(event) {
				//var senderId = event.sender.id;
				//var payload = event.postback.payload;
				//sendMessage(senderId, {text: "hi back"});
				//console.log("dskfskndskfnds");
      /*  if (event.postback) {
          processPostback(event);
					console.log("test");
        } else if (event.message){
					processMessage(event);
				}*/
			//	}
      });
    })
    res.sendStatus(200);
		console.log("test3");
  }
	console.log('test4');
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
	console.log(senderId);
  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is SP Movie Bot. I can tell you various details regarding movies. What movie would you like to know about?";
      sendMessage(senderId, {text: message});
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

function processMessage(event) {
  if (!event.message.is_echo) {
    var message = event.message;
    var senderId = event.sender.id;

    console.log("Received message from senderId: " + senderId);
    console.log("Message is: " + JSON.stringify(message));

    // You may get a text or attachment but not both
    if (message.text) {
      var formattedMsg = message.text.toLowerCase().trim();

      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding movie detail.
      // Otherwise, search for new movie.
      switch (formattedMsg) {
				case "hi": sendMessage(senderId, {text: "sdf."});

					break;
      /*  case "plot":
        case "date":
        case "runtime":
        case "director":
        case "cast":
        case "rating":
          getMovieDetail(senderId, formattedMsg);
          break;

        default:
          findMovie(senderId, formattedMsg);*/
      }
    } else if (message.attachments) {
      sendMessage(senderId, {text: "Sorry, I don't understand your request."});
    }
  }
}
