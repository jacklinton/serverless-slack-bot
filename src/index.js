'use strict';

// Include the serverless-slack bot framework
const slack = require('serverless-slack');
const randomQuotes = require('random-quotes');
const axios = require('axios');


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

// Listener for slash command that allows you to send a note to yourself.
slack.on('/note', (msg, bot) => {
  let prompt = {
    text: msg.text + '\nDo you want to save this note?',
    attachments: [{
      fallback: 'actions',
      callback_id: 'note_click',
      actions: [
          { type: 'button', name: 'Yes', text: 'Yes', value: msg.text},
          { type: 'button', name: 'No', text: 'No'},
      ]
    }]
  };
  bot.replyPrivate(prompt);
});

// Callback for the /note command.
slack.on('note_click', (msg, bot) => {

  const text = msg.actions[0].value;

  if (!text) {
    return bot.replyPrivate({
        text: 'Not saving this note.'
    });
  }

  const url = 'https://hooks.slack.com/services/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';

  const message = {
    text: text
  };

  const success = {
    text: 'Note added to your personal space.'
  };

  const failure = {
    text: 'Could not add note :cry:'
  };

  axios.post(url, message)
      .then(() => bot.replyPrivate(success))
      .catch(() => bot.replyPrivate(failure))
});