'use strict';

var app = angular.module('routerApp', ['ui.router', 'formly', 'formlyBootstrap']);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/html/home.html',
    controller: 'homeCtrl'
  })
  //protected state
  .state('profile',{
    url: '/profile',
    templateUrl: 'html/profile.html',
    controller: 'profileCtrl',
    controllerAs: 'vm',
    resolve: {
        profile: function(Auth) {
          return Auth.getProfile();
        }
      }
  })
  .state('register', {
    url: '/register',
    templateUrl: '/html/authForm.html',
    controller: 'authFormCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: '/html/authForm.html',
    controller: 'authFormCtrl'
  })

  .state('list', {
    url: '/list',
    templateUrl: '/html/list.html',
    controller: 'listCtrl'
  })
  .state('detail', {
    url: '/detail/:id',
    templateUrl: '/html/detail.html',
    controller: 'detailCtrl',
    resolve: {
      listObj:
      function(Stuff, $stateParams) {
        //make call to Stuff service to get obj by id
        //return Stuff.getById($stateParams.id)
        return 'listObj';
      }
    }
  })


  $urlRouterProvider.otherwise('/');
})

app.filter('titlecase', function() {
  return function(input) {
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  }
});
