(function() {
  
  var app = angular.module("githubViewer", ["ngRoute"]);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/create.html",
        controller: "CreateController"
      })
      .otherwise({redirectTo:"/"});
      
  });
  
}());