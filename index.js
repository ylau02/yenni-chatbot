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


//init
var Glassdoor = require('node-glassdoor').initGlassdoor({
    partnerId: 208235,
    partnerKey: "cZU1Vm4x2ls"
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
/*app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
		console.log("test1");
		// Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
			console.log("test2");
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
				//var senderId = event.sender.id;
				//var payload = event.postback.payload;
				//sendMessage(senderId, {text: "hi back"});
				//console.log("dskfskndskfnds");
        if (event.postback) {
          processPostback(event);
					console.log("test");
        } else if (event.message) {
					processMessage(event);
				}
				}
      });
    })
    res.sendStatus(200);
		console.log("test3");
  }
	console.log('test4');
});*/


// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
	console.log("hi");
  if (req.body.object == "page") {
		console.log("hey");
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
			console.log("hiho");
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
				console.log("watsup");
        if (event.postback) {
					console.log("bye");
          processPostback(event);
        } else if (event.message) {
					console.log("hihi");
          processMessage(event);
        }
      });
    });
		console.log("byebye");
    res.sendStatus(200);
  }
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


function sendURL(recipientId){
	request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      	message: {
			      attachment: {
			        type: "template",
			        payload: {
			          template_type: "generic",
			          elements: [{
			            title: "Deloitte",
			            subtitle: "Dedicated professionals in independent firms throughout the world collaborate to provide audit, consulting, financial advisory, risk advisory, tax",
			            item_url: "https://www2.deloitte.com/au/en/careers/students.html?icid=top_students",
			            image_url: "https://www2.deloitte.com/au/en.html",
			            buttons: [{
			              type: "web_url",
			              url: "https://www2.deloitte.com/au/en/careers/students.html?icid=top_students",
			              title: "Check it out"
			            }/*, {
			              type: "postback",
			              title: "Call Postback",
			              payload: "Payload for first bubble",
			            }]*/,
			          }, {
			            title: "Commonwealth Bank",
			            subtitle: "Start at the forefront",
			            item_url: "https://www.commbank.com.au/about-us/careers/graduate-recruitment-program.html",
			            image_url: "https://www.commbank.com.au/etc/designs/commbank/branding/images/cba-logo.png",
			            buttons: [{
			              type: "web_url",
			              url: "https://www.commbank.com.au/about-us/careers/graduate-recruitment-program.html",
			              title: "Check it out"
			            }/*, {
			              type: "postback",
			              title: "Call Postback",
			              payload: "Payload for second bubble",
			            }*/]
			          }]
			        }
			      }
			    }
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

/*function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}*/

function processMessage(event) {
	console.log("here");
	console.log(event.message);
	event.message.is_echo = false;
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
			if(formattedMsg.includes("yenni")){
				sendMessage(senderId, {text: "How can I help?"});
			} else if (formattedMsg.includes("uni") || formattedMsg.includes("think")) {
				sendMessage(senderId, {text: "How did you do on your exams?"});
			} else if (formattedMsg.includes("maths")) {
				//sendMessage(senderId, {text: "Ok cool. Let me have a look."});
				sendMessage(senderId, {text: "Here are some options based on your grades: Data Analyst, Statistician, Accountant"});
				sendMessage(senderId, {text: "Here are some options based on your interests: Photographer, Graphic Designer, Comic Book Artist, Traveller, Accountant"});
			} else if (formattedMsg.includes("accountant")) {
				sendMessage(senderId, {text: "An accountant is a professional person who performs accounting functions such as audits or financial statement analysis."});
				//sendMessage(senderId, {text: "Accountants are given certifications by national professional associations, after meeting state-specific requirements, although non-qualified persons can still work under other accountants, or independently."});
				sendMessage(senderId, {text: "The benefits of being an Accountant are: potential for flexible working, travel, utilises your strengths in maths."});
				sendMessage(senderId, {text: "The transferable skills you will gain from being an Accountant are: time management, project management, communication skills. You currently have skills in: commnication, mathematics and tax legislation"});

				//sendMessage(senderId, {text: "So what do you think?"});
			} else if (formattedMsg.includes("companies")) {
				//sendMessage(senderId, {text: "Happy to help."});
				sendURL(senderId);
			}
      }
    } else if (message.attachments) {
      sendMessage(senderId, {text: "Sorry, I don't understand your request."});
    }
  }
