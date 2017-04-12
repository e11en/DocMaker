(function() {
  var app = angular.module("docMaker");

  var CreateController = function($scope) {

    $scope.addTable = function() {
        $scope.tables.push({
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
        $scope.tables.splice(index, 1);
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
        $scope.queries.push({
            Title : '',
            Body : ''
        });
    };

    $scope.removeQuery = function(index) {
        $scope.queries.splice(index, 1);
    };

    $scope.createDocument = function() {
        console.log('Creating document');
    };

    $scope.tables = [];
    $scope.queries = [];
    $scope.documentRelationImage = {};

    // TODO: Remove this dummy data
    $scope.documentName = "test.doc";
    $scope.documentTitle = "Organization";
    $scope.documentIntro = "Dit is een organization die dingen doet.";
    $scope.tables = [
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
    $scope.queries = [
        {
            Title : 'Toon alle organizations',
            Body : 'SELECT * FROM Organization'
        }
    ];

  };
  app.controller("CreateController", CreateController);

}());