(function() {
    var app = angular.module("docMaker");

    var DocifyService = function() {
        this.process = function(docObject) {
            console.log( docObject );
        };
    };
    app.service('docify', DocifyService);
}());