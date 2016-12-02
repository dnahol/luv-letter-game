'use strict';

var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
  // hand11 = player1, 1st card, hand12 = player1, 2nd card, etc.
  position: { type: String, enum: ['hand11', 'hand12', 'hand21', 'hand22', 'hand31', 'hand32', 'hand41', 'hand42', 'deck', 'played', 'none'] },
  rank: { type: Number, required: true, min: 1, max: 8 },
  name: { type: String, required: true },
  action: { type: String, required: true },
  image: { type: String }
});





//discard card (mark as position: 'played'), place face up in played area
cardSchema.methods.discard = function(cb) {
  Card.findByIdAndUpdate(this._id, { position: 'played' }, (err, card) => {
    cb(null, card)
  });
}

// draw card, hand limit 2, updates position field accordingly
//TODO: error catch for end of deck
//TODO: only returns drawn card to route if current player (i.e. player 1)
//is the player drawing the card
cardSchema.statics.draw = function(player, cb) {
  var restr = 'hand' + player.player + '\\d';
  Card.find({'position': new RegExp(restr)}, (err, handCards) => {
    if(err) return cb(err);
    var drawNum = 0;
    if(handCards.length > 1) {
      cb(null, {error: 'Hand limit reached'});
      return;
    } else if(handCards.length < 1) {
      drawNum = 1;
    } else {
      drawNum = 2;
    }
    // TODO: error catch for end of deck
    Card.find({'position': 'deck'}, (err, cards) => {
      var index = randomInt(0,(cards.length-1));
      var cardId = cards[index]._id;
      Card.findById(cardId, (err, card) => {
        card.position = 'hand' + player.player + drawNum;
        card.save((err) => {});
        cb(null, card);
      });
    });
  });
}


// calls on deal method to deal new game
// returns only player1Hand to the front end
cardSchema.statics.dealSimple = function(cb) {
  Card.deal((err, cards) => {
    let player1Hand = cards[0][0];
    cb(null, player1Hand);
  });
}

//creates deck and deals out a new game, 2 player
cardSchema.statics.deal = function(cb) {

  //clear database of all cards
  Card.remove({}, (err) => {})

  // all the unique types of cards
  var cardTypes =
  [
    {
      position: 'none',
      rank: '1',
      name: 'guard',
      action: "guess a player's hand",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '2',
      name: 'priest',
      action: "look at another player's hand",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '3',
      name: 'baron',
      action: "compare hands and lower hand is out.",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '4',
      name: 'handmaid',
      action: "protection until next turn",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '5',
      name: 'prince',
      action: "one player discards their hand",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '6',
      name: 'king',
      action: "trade hands",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '7',
      name: 'countess',
      action: "discard if caught with king or prince",
      image: 'some url'
    },
    {
      position: 'none',
      rank: '8',
      name: 'princess',
      action: "lose if discarded",
      image: 'some url'
    }
  ];

  //make deck array of 16 according to card rank frequency
  var rank1 = cloneObj(cardTypes[0], 5);
  var rank2 = cloneObj(cardTypes[1], 2);
  var rank3 = cloneObj(cardTypes[2], 2);
  var rank4 = cloneObj(cardTypes[3], 2);
  var rank5 = cloneObj(cardTypes[4], 2);
  var rank6 = cloneObj(cardTypes[5], 1);
  var rank7 = cloneObj(cardTypes[6], 1);
  var rank8 = cloneObj(cardTypes[7], 1);

  var deck = rank1.concat(rank2, rank3, rank4, rank5, rank6, rank7, rank8);

  //random discard
  deck.splice(randomInt(0,15), 1);

  //random deal to player 1, add position hand11, and save card
  var hand1 = deck.splice(randomInt(0,14), 1)[0];
  hand1.position = 'hand11';
  saveNewCard(hand1);


  //random deal to player 2, add position hand21, and save card
  var hand2 = deck.splice(randomInt(0,13), 1)[0];
  hand2.position = 'hand21';
  saveNewCard(hand2);

  //add position deck, save all cards in starting deck
  var realDeck = deck.map(function(card) {
    card.position = 'deck';
    saveNewCard(card);
    return card;
  });


  var hands = [hand1, hand2];
  var deckAndHands = [hands, realDeck];

  cb(null, deckAndHands);
}

function randomInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function saveNewCard(cardObj) {
  var card = new Card({
    position: cardObj.position,
    rank: cardObj.rank,
    name: cardObj.name,
    action: cardObj.action,
    image: cardObj.image
  });
  card.save((err) => {});
}

function cloneObj(obj, num) {
  var result = []
  for(var i = 0; i < num; i++) {
    var newObj = Object.assign({}, obj);
    result.push(newObj);
  }
  return result;
}

var Card = mongoose.model('Card', cardSchema);

module.exports = Card;
