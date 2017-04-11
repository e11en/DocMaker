(function() {
  var app = angular.module("githubViewer");

  var CreateController = function($scope, $interval, $location) {

    $scope.createDocument = function() {
      $location.path("/");
    };

    $scope.documentName = "test.doc";
    $scope.documentTitle = "Organization";
    $scope.documentIntro = "Dit is een organization die dingen doet.";
    $scope.tables = [
        {
            Name : 'tbl_Organization',
            Columns : [
                {
                    Name : 'OrganizationId',
                    IsMainIdentifier : true,
                    Body : ''
                },
                {
                    Name : 'Test',
                    IsMainIdentifier : false,
                    Body : 'Dit is een andere kolom'
                }
            ]
        },
        {
            Name : 'tbl_Test',
            Columns : [
                {
                    Name : 'TestId',
                    IsMainIdentifier : true,
                    Body : ''
                }
            ]
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