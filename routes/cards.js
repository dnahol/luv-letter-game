'use strict';

var express = require('express');
var router = express.Router();

var Card = require('../models/card');


//shouldn't have a get all cards in final
//only for developing
router.get('/', (req, res) => {
  console.log('get cards hit')
  Card.find({}, (err, cards) => {
    res.status(err ? 400 : 200).send(err || cards);
  });
});

//deals new game and returns {player1Hand}
router.post('/deal', (req, res) => {
  console.log('/deal hit');

  Card.dealSimple((err, cards) => {
    res.status(err ? 400 : 200).send(err || cards);
  });
});

//draws a card from deck
//TODO: on Card.draw model method, only shows card value if current player (i.e. player 1)
// is the player drawing the card
router.post('/draw',(req, res) => {
  Card.draw(req.body, (err, card) => {
    res.status(err ? 400 : 200).send(err || card);
  });
});

//discards a card from hand, leaves faceup in played area
// TODO: place discarded card face up in played area
router.post('/discard',(req, res) => {
  console.log('discard route hit');
  Card.discard(req.body, (err, card) => {
    res.status(err ? 400 : 200).send(err || card);
  });
});

module.exports = router;
