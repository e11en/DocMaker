(function() {

    var app = angular.module("docMaker", ["ngRoute", "flow", "ngFileSaver"]);

    app.config(function($routeProvider, $compileProvider) {
        $routeProvider
          .when("/", {
            templateUrl: "views/create.html",
            controller: "CreateController"
          })
          .otherwise({redirectTo:"/"});

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
    });

}());