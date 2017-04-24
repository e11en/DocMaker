(function() {
  var app = angular.module("docMaker");

  var CreateController = function($scope, $http, FileSaver, Blob, docify, markdownify) {

    $scope.addTable = function() {
        $scope.document.tables.push({
            Name : '',
            Image : '',
            Columns : [
                {
                    Name : '',
                    IsMainIdentifier : true,
                    Body : ''
                }
            ],
            HasUserNameModifiedColumn : true,
            HasTransStartDateColumn : true
        });
    };

    $scope.removeTable = function(index) {
        $scope.document.tables.splice(index, 1);
    };

    $scope.addColumn = function(table) {
        table.Columns.push({
            Name : '',
            Columns : [
                {
                    Name: '',
                    IsMainIdentifier: false,
                    Body: ''
                }
            ]
        });
    };

    $scope.removeColumn = function(table, index) {
        table.Columns.splice(index, 1);
    };

    $scope.addQuery = function() {
        $scope.document.queries.push({
            Title : '',
            Body : ''
        });
    };

    $scope.removeQuery = function(index) {
        $scope.document.queries.splice(index, 1);
    };

    $scope.downloadDocument = function(type) {
        // TODO: Do validation

        switch(type) {
            case 'word' :
                downloadWordDocument();
                break;
            case 'markdown':
                downloadMarkDownDocument();
                break;
        }
    };

    downloadMarkDownDocument =  function() {
        $scope.document.output = markdownify.process($scope.document);
        saveFile($scope.document.output, getMdFileName($scope.document.documentTitle));
    };

    downloadWordDocument = function() {
        $scope.document.output = docify.process($scope.document);

        $http.post("http://localhost:57982/api/document/generate",
            { Html : $scope.document.output })
            .then(function success(response) {
                window.open(response.data);
            }, function error(response) {
                console.log("ERROR! " + response.statusText);
            });
    };

      /**
       * Concat the name with dashes and add the .md extension.
       * @param fileName
       * @returns {string}
       */
    getMdFileName = function(fileName) {
        return fileName.toLowerCase().replace(/\s+/g,"-") + '.md';
    };

    saveFile = function(content, outputFile) {
        var blob = new Blob([content], {type: 'text/plain'});
        FileSaver.saveAs(blob, outputFile);
    };

      /***
       * Puts the base64 string in the correct variable
       * and makes sure the $scope is updated.
       * @param file
       * @param table (optional)
       */
    $scope.processImage = function(file, table) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            var uri = event.target.result;
            $scope.$apply(function(){
                if(!table) {
                    $scope.document.documentRelationImage = uri;
                } else {
                    table.Image = uri;
                }
            });
        };
        fileReader.readAsDataURL(file.file);
    };

      /***
       * Calls the cancel on $flow and set the variable to empty.
       * @param flow
       * @param table (optional)
       */
    $scope.removeImage = function(flow, table) {
        flow.cancel();
        if(!table) {
            $scope.document.documentRelationImage = '';
        } else {
            table.Image = '';
        }
    };

    $scope.document = {};
    $scope.document.tables = [];
    $scope.document.queries = [];
    $scope.document.documentRelationImage = '';
  };
  app.controller("CreateController", CreateController);

}());