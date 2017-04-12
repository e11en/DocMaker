(function() {
  var app = angular.module("docMaker");

  var CreateController = function($scope, docify) {

    $scope.addTable = function() {
        $scope.document.tables.push({
            Name : '',
            Image : {},
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

    $scope.createDocument = function() {
        console.log('Creating document');

        docify.process($scope.document);
    };

    $scope.document = {};
    $scope.document.tables = [];
    $scope.document.queries = [];
    $scope.document.documentRelationImage = {};

    // TODO: Remove this dummy data
    $scope.document.documentName = "test.doc";
    $scope.document.documentTitle = "Organization";
    $scope.document.documentIntro = "Dit is een organization die dingen doet.";
    $scope.document.tables = [
        {
            Name: 'tbl_Organization',
            Image : {},
            Columns: [
                {
                    Name: 'OrganizationId',
                    IsMainIdentifier: true,
                    Body: ''
                },
                {
                    Name: 'Test',
                    IsMainIdentifier: false,
                    Body: 'Dit is een andere kolom'
                }
            ],
            HasUserNameModifiedColumn : true,
            HasTransStartDateColumn : true
        }
        ];
    $scope.document.queries = [
        {
            Title : 'Toon alle organizations',
            Body : 'SELECT * FROM Organization'
        }
    ];

  };
  app.controller("CreateController", CreateController);

}());