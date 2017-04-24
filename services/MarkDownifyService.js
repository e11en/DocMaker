(function() {
    var app = angular.module("docMaker");

    var MarkDownifyService = function() {
        var document = '';

        /**
         * The starting point of the service,
         * only this function will be exposed.
         * @param docObject
         * @returns {string}
         */
        this.process = function(docObject) {
            console.log('Creating document');

            buildBase(docObject.documentTitle);
            buildHeader(docObject.documentTitle);
            buildGeneralInfo(docObject.documentRelationImage, docObject.documentIntro);
            buildTables(docObject.tables);
            buildQueries(docObject.queries);

            return document;
        };

        /**
         * Add to the variable(s) to the document.
         * @param value, either a single variable or an array
         */
        addToDocument = function (value) {
            if(value.constructor === Array){
                for(i = 0; i < value.length; i++) {
                    document += value[i];
                }
            } else {
                document += value;
            }
        };

        /**
         * Create the markdown header.
         */
        buildBase = function(title) {
            var base = '+++\r\ndate = "' + DateTime.now() + '"\r\ntitle = ' + title + '\r\ndraft = false\r\n\r\n+++';
            addToDocument(base);
        };

        /**
         * Create the general information section.
         * @param relationImage
         * @param documentIntro
         */
        buildGeneralInfo = function(relationImage, documentIntro){
            var header = '<h2>Algemeen</h2>';
            var image = '<img src="' + relationImage +'" />';
            var intro = '<p>' + documentIntro +'</p>';
            addToDocument([header, image, intro]);
        };

        /**
         * Create the tables used for the db.
         * @param tables
         */
        buildTables = function(tables) {
            var header = '<h2>Tabellen uitleg</h2>';
            var result = '';
            angular.forEach(tables, function(table, key) {
                result += '<h3>' + table.Name +'</h3>';
                result += '<table border="1">';
                result += '<tr>';
                result += '<td rowspan="' + getAmountOfColumns(table) +'"><img src="' + table.Image + '"/></td>';

                angular.forEach(table.Columns, function(column, key) {
                    result += buildColumn(column, key === 0);
                }, null);

                result += getPresetColumns(table);

                result += '</table>';
            }, null);

            addToDocument([header, result]);
        };

        /**
         * Create the columns of each table.
         * @param column
         * @param isFirstColumn
         * @returns {string}
         */
        buildColumn = function(column, isFirstColumn) {
            var result = isFirstColumn ? '' : '<tr>';
            result += '<td>';
            result += '<p class="column-name">' + column.Name + '</p>';
            result += '<p class="column-body">';
            if(column.IsMainIdentifier) {
                result += 'De main identifier van de tabel.';
            }
            else {
                result += column.Body;
            }
            result += '</p></td></tr>';
            return result;
        };

        /**
         * Get the preset tables.
         * @param table
         * @returns {string}
         */
        getPresetColumns = function(table) {
            var result = '';
            if(table.HasUserCommentColumn)
                result += '<tr><td><p class="column-name">UserComment</p><p class="column-body">Hierin staan eventuele opmerkingen.</p></td></tr>';
            if(table.HasUserNameModifiedColumn)
                result += '<tr><td><p class="column-name">UserNameModified</p><p class="column-body">De user die dit record voor het laatst heeft gewijzigd.</p></td></tr>';
            if(table.HasValidStartDateColumn)
                result += '<tr><td><p class="column-name">ValidStartDate</p><p class="column-body">Begin datum waarop het record valide is.</p></td></tr>';
            if(table.HasValidEndDateColumn)
                result += '<tr><td><p class="column-name">ValidEndDate</p><p class="column-body">Eind datum waarop het record invalide is.</p></td></tr>';
            if(table.HasTransStartDateColumn)
                result += '<tr><td><p class="column-name">TransStartDate</p><p class="column-body">De datum wanneer het record voor het laatst is gewijzigd.</p></td></tr>';
            if(table.HasHistoryTable){
                result += getHistoryTableText(table.Name);
            }

            return result;
        };

        /**
         * Get the text that goes with the history table.
         * @param tableName
         * @returns {string}
         */
        getHistoryTableText = function(tableName) {
            return '<tr><td colspan="2">Deze tabel heeft een archive tabel (' + tableName + '_archive) waarin de history wordt opgeslagen. ' +
                'Zodra er een update of delete plaats vindt wordt de trigger trgio_' + tableName + '_ud uitgevoerd.</td></tr>';
        };

        /**
         * Get the amount of columns of the table, minus the history table.
         * This is used to calculate the rospan of the table image.
         * @param table
         * @returns {number}
         */
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
            if(table.HasHistoryTable)
                amountOfColomns--;

            return amountOfColomns + 1;
        };

        /**
         * Create the queries.
         * @param queries
         */
        buildQueries = function(queries) {
            var header = '<h2>Handige SQL query\'s</h2>';
            var result = '';
            angular.forEach(queries, function(query, key) {
                result += '<h3>' + query.Title +'</h3>';
                result += '<table border="1"><tr>';
                result += '<td><pre><code class="language-sql">' + processSQL(query.Body) + '</code></pre></td>';
                result += '</tr></table>';
            }, null);

            addToDocument([header, result]);
        };


    };
    app.service('markdownify', MarkDownifyService);
}());