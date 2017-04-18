(function() {
    var app = angular.module("docMaker");

    var DocifyService = function() {
        var documentHtml = '';

        this.process = function(docObject) {
            console.log('Creating document');

            buildBase();
            buildHeader(docObject.documentTitle);
            buildGeneralInfo(docObject.documentRelationImage, docObject.documentIntro);
            buildTables(docObject.tables);

            documentHtml += '</body></html>';

            return documentHtml;
        };

        addToDocument = function (html) {
            if(html.constructor === Array){
                for(i = 0; i < html.length; i++) {
                    documentHtml += html[i];
                }
            } else {
                documentHtml += html;
            }
        };

        buildBase = function() {
            var html = '<html>';
            html += '<head>';
            html += '</head>';
            html += '<body>';
            addToDocument(html);
        };

        buildHeader = function(documentTitle) {
            addToDocument('<h1>' + documentTitle.toUpperCase() +'</h1>');
        };

        buildGeneralInfo = function(relationImage, documentIntro){
            var header = '<h2>Algemeen</h2>';
            var image = '<img src="' + relationImage +'"/>';
            var intro = '<p>' + documentIntro +'</p>';
            addToDocument([header, image, intro]);
        };

        buildTables = function(tables) {
            var header = '<h2>Tabellen uitleg</h2>';
            var tablesHtml = '';
            angular.forEach(tables, function(table, key) {
                tablesHtml += '<h3>' + table.Name +'</h3>';
                tablesHtml += '<table border="1">';
                tablesHtml += '<tr>';
                tablesHtml += '<td rowspan="' + getAmountOfColumns(table) +'"><img src="' + table.Image + '"/></td>';

                angular.forEach(table.Columns, function(column, key) {
                    tablesHtml += buildColumn(column, key === 0);
                }, null);

                tablesHtml += buildPresetColumns(table);

                if(table.HasHistoryTable){
                    tablesHtml += buildHistoryTableText(table.Name);
                }

                tablesHtml += '</table>';
            }, null);

            addToDocument([header, tablesHtml]);
        };

        buildColumn = function(column, isFirstColumn) {
            var columnHtml = isFirstColumn ? '' : '<tr>';
            columnHtml += '<td>';
            columnHtml += '<p class="column-name">' + column.Name + '</p>';
            columnHtml += '<p class="column-body">';
            if(column.IsMainIdentifier) {
                columnHtml += 'De main identifier van de tabel.';
            }
            else {
                columnHtml += column.Body;
            }
            columnHtml += '</p></td></tr>';
            return columnHtml;
        };

        buildPresetColumns = function(table) {
            var columnHtml = '';
            if(table.HasUserCommentColumn)
                columnHtml += '<tr><td><p class="column-name">UserComment</p><p class="column-body">Hierin staan eventuele opmerkingen.</p></td></tr>';
            if(table.HasUserNameModifiedColumn)
                columnHtml += '<tr><td><p class="column-name">UserNameModified</p><p class="column-body">De user die dit record voor het laatst heeft gewijzigd.</p></td></tr>';
            if(table.HasValidStartDateColumn)
                columnHtml += '<tr><td><p class="column-name">ValidStartDate</p><p class="column-body">Begin datum waarop het record valide is.</p></td></tr>';
            if(table.HasValidEndDateColumn)
                columnHtml += '<tr><td><p class="column-name">ValidEndDate</p><p class="column-body">Eind datum waarop het record invalide is.</p></td></tr>';
            if(table.HasTransStartDateColumn)
                columnHtml += '<tr><td><p class="column-name">TransStartDate</p><p class="column-body">De datum wanneer het record voor het laatst is gewijzigd.</p></td></tr>';

            return columnHtml;
        };

        buildHistoryTableText = function(tableName) {
            return '<tr><td colspan="2">Deze tabel heeft een archive tabel (' + tableName + '_archive) waarin de history wordt opgeslagen. ' +
                'Zodra er een update of delete plaats vindt wordt de trigger trgio_' + tableName + '_ud uitgevoerd.</td></tr>';
        };

        getAmountOfColumns = function(table) {
            var amountOfColomns = table.Columns.length;

            if(table.HasUserCommentColumn)
                amountOfColomns++;
            if(table.HasUserNameModifiedColumn)
                amountOfColomns++;
            if(table.HasValidStartDateColumn)
                amountOfColomns++;
            if(table.HasValidEndDateColumn)
                amountOfColomns++;
            if(table.HasTransStartDateColumn)
                amountOfColomns++;

            return amountOfColomns + 1;
        };


    };
    app.service('docify', DocifyService);
}());