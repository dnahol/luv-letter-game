'use strict';

var app = angular.module('routerApp');

app.service('Service', function(){
  

  var sample =
  [
    {
      rank: '1',
      name: 'guard',
      action: "guess a player's hand",
      image: 'some url'
    },
    {
      rank: '2',
      name: 'priest',
      action: "look at another player's hand",
      image: 'some url'
    },
    {
      rank: '3',
      name: 'baron',
      action: "compare hands and lower hand is out.",
      image: 'some url'
    },
    {
      rank: '4',
      name: 'handmaid',
      action: "protection until next turn",
      image: 'some url'
    },
    {
      rank: '5',
      name: 'prince',
      action: "one player discards their hand",
      image: 'some url'
    },
    {
      rank: '6',
      name: 'king',
      action: "trade hands",
      image: 'some url'
    },
    {
      rank: '7',
      name: 'countess',
      action: "discard if caught with king or prince",
      image: 'some url'
    },
    {
      rank: '8',
      name: 'princess',
      action: "lose if discarded",
      image: 'some url'
    }

  ];

  this.getSampleData = () => {
    return sample;
  }

  // this.addAuction = (auction) = {
  //   // sample.push(auction);
  //   return auction;
  // }

});

app.service('Auth', function($http, $q) {


  this.register = userObj => {
    return $http.post('/api/users/register', userObj);
  };

  this.login = userObj => {
    return $http.post('/api/users/login', userObj)
      .then(res => {
        return this.getProfile();
      })
  };

  this.logout = () => {
    return $http.delete('/api/users/logout')
    .then(res => {
      this.currentUser = null;
      return $q.resolve();
    })
  }

  this.getProfile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      this.currentUser = res.data;
      return $q.resolve(res.data);
    })
    .catch(res => {
      this.currentUser = null;
      return $q.reject(res.data);
    })
  };
});
