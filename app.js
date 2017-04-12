(function() {
  
  var app = angular.module("docMaker", ["ngRoute", "flow"]);
  
  app.config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/create.html",
        controller: "CreateController"
      })
      .otherwise({redirectTo:"/"});
      
  });
  
}());