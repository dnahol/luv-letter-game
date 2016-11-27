'use strict'

var app = angular.module('routerApp');

app.controller('profileCtrl', function($scope, Service, Auth) {
  console.log('profileCtrl!');
  console.log(Auth.currentUser);
  console.log('$scope.currentUser:', $scope.currentUser);


});

app.controller('homeCtrl', function($scope, Service) {
  console.log('homeCtrl!');

  $scope.deal = () => {
    console.log('deal!');
    console.log(Service.getSampleData());
  }


});


app.controller('listCtrl', function() {
  console.log('listCtrl!');
});

app.controller('detailCtrl', function() {
  console.log('detailCtrl!');
});

app.controller('navCtrl', function($scope, Auth, $state) {

  $scope.$watch(function() {
    return Auth.currentUser;
  }, function(newVal, oldVal) {
    console.log('oldVal: ', oldVal);
    console.log('newVal: ', newVal );
    $scope.currentUser = newVal;
  })


  // console.log('mainCtrl');
  // Auth.getProfile()
  //   .then(res => {
  //     $scope.currentUser = res.data;
  //   })
  //   .catch(res => {
  //     $scope.currentUser = null;
  //   })
  $scope.logout = () => {
    swal({
      title: "Are you sure?",
      text: "Are you sure you want to logout?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Logout",
      closeOnConfirm: false },
      function() {
        Auth.logout()
        .then(res => {
          $state.go('home');
        })
        swal("You are logged out", "Redirecting to the home page", "success");
      });
    }

  });


  app.controller('authFormCtrl', function($scope, $state, Auth) {
    console.log('authFormCtrl!');

    $scope.currentState = $state.current.name;

    $scope.submitForm = () => {
      if($scope.currentState === 'register') {

        // register user
        if($scope.user.password !== $scope.user.password2) {

          $scope.user.password = '';
          $scope.user.password2 = '';

          swal("Passwords do not match")

        } else {
          Auth.register($scope.user)
          .then(res => {
            return Auth.login($scope.user);
          })
          .then(res => {
            $state.go('home');
          })
          .catch(res => {
            alert(res.data.error);
          });

          swal("SignUp Successful", "Welcome!")
        }
      } else {
        // login user

        Auth.login($scope.user)
        .then(res => {
          $state.go('home');
        })
        .catch(res => {
          alert(res.data.error);
        })


      }
    };

  });
