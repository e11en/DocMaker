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

    // TODO: Remove this dummy data
    $scope.document.documentTitle = "Organization Contract Relatie";
    $scope.document.documentIntro = "Een organization kan meerdere contracten hebben voor verschillende adressen en verschillende types zoals elektriciteit of gas. Een contract kan het ContractType van ‘Customer’ hebben, dit betekend dat het om een Hoofdaansluiting gaat. Een ‘Period’ contract is een sub-aansluiting en is ook niet direct gekoppeld aan een organization.";
    $scope.document.tables = [
        {
            Name: 'itbl_Organization_Contract',
            Image : '',
            Columns: [
                {
                    Name: 'OrganiztionContractId',
                    IsMainIdentifier: true,
                    Body: ''
                },
                {
                    Name: 'OrganizationId',
                    IsMainIdentifier: false,
                    Body: 'Identifier over welke organization het gaat en is gekoppeld met tbl_Organization.'
                },
                {
                    Name: 'ContractId',
                    IsMainIdentifier: false,
                    Body: 'Identifier over welk contract het gaat en is gekoppeld met tbl_Contract.'
                }
            ],
            HasUserNameModifiedColumn : true,
            HasValidStartDate : true,
            HasValidEndDate : true,
            HasTransStartDateColumn : true,
            HasHistoryTable : true
        },
        {
            Name: 'tbl_Contract',
            Image : '',
            Columns: [
                {
                    Name: 'ContractId',
                    IsMainIdentifier: true,
                    Body: ''
                },
                {
                    Name: 'ContractType',
                    IsMainIdentifier: false,
                    Body: 'Dit kan de waarden ‘Customer’ of ‘Period’ bevatten en geeft aan of het een hoofd- of sub aansluiting is.'
                },
                {
                    Name: 'ContractReference',
                    IsMainIdentifier: false,
                    Body: 'Deze waarden wordt automatisch geset zodra er een nieuw contract wordt ingevoerd.'
                },
                {
                    Name: 'ProductId',
                    IsMainIdentifier: false,
                    Body: 'Identifier over welk product het gaat en is gekoppeld met tbl_Product.'
                },
                {
                    Name: 'StartDate',
                    IsMainIdentifier: false,
                    Body: 'De start datum van het contract.'
                },
                {
                    Name: 'EndDate',
                    IsMainIdentifier: false,
                    Body: 'De eind datum van het contract.'
                }
            ],
            HasUserCommentColumn : true,
            HasUserNameModifiedColumn : true,
            HasTransStartDateColumn : true,
            HasHistoryTable : true
        }
    ];
    $scope.document.queries = [
        {
            Title : 'Alle contracten van een organization',
            Body : '/* Show all valid contracts of an organization */ \r\nDECLARE @Viewdata DATETIME = GETDATE() \r\nDECLARE @ViewOrganizationId INT = 25397 \r\nSELECT	org.OrganizationId, \r\norg.Name,\r\nc.ContractType,\r\nc.ContractReference,\r\np.Description,\r\nioc.ValidStartDate,\r\nioc.ValidEndDate\r\nFROM tbl_Organization org\r\nJOIN itbl_Organization_Contract ioc ON ioc.OrganizationId = org.OrganizationId\r\nJOIN tbl_Contract c ON ioc.ContractId = c.ContractId\r\nJOIN mtbl_Product p ON p.ProductId = c.ProductId\r\nWHERE org.OrganizationId = @ViewOrganizationId\r\nAND ioc.ValidEndDate > @Viewdata'
        }
    ];

  };
  app.controller("CreateController", CreateController);

}());