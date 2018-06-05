'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');
const randomQuotes = require('random-quotes');


// The function that AWS Lambda will call
exports.handler = slack.handler.bind(slack);


// Slash Command handler
slack.on('/greet', (msg, bot) => {
  let message = {
    text: "How would you like to greet the channel?",
    attachments: [{
      fallback: 'actions',
      callback_id: "greetings_click",
      actions: [
        { type: "button", name: "Wave", text: ":wave:", value: ":wave:" },
        { type: "button", name: "Hello", text: "Hello", value: "Hello" },
        { type: "button", name: "Howdy", text: "Howdy", value: "Howdy" },
        { type: "button", name: "Hiya", text: "Hiya", value: "Hiya" }
      ]
    }]
  };

  // ephemeral reply
  bot.replyPrivate(message); 
});


// Interactive Message handler
slack.on('greetings_click', (msg, bot) => {
  let message = { 
    // selected button value
    text: msg.actions[0].value 
  };  

  // public reply
  bot.reply(message);
});


// Reaction Added event handler
slack.on('reaction_added', (msg, bot) => {
  bot.reply({ 
    text: ':wave:' 
  });
});


// Slash random quote event handler
slack.on('/quote', (msg, bot) => {
  const quote = randomQuotes.default();
  let message = {
    text: '_' + quote.body + '_' + ' - ' + quote.author
  };
  bot.reply(message);
});

// Message and help event handler
slack.on('message', (msg, bot) => {

  const message = msg.event.text.toLowerCase();

  if (message.includes('hello')) {
    bot.reply({
        text: 'Welcome to the team!'
    });
  }

  if (message.includes('help')) {
    bot.reply({
        text: 'If you need help, feel free to message the @channel.'
    });
  }

});