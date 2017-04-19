(function() {
    var app = angular.module("docMaker");

    var DocifyService = function() {
        var documentHtml = '';

        /**
         * The starting point of the service,
         * only this function will be exposed.
         * @param docObject
         * @returns {string}
         */
        this.process = function(docObject) {
            console.log('Creating document');

            buildBase();
            buildHeader(docObject.documentTitle);
            buildGeneralInfo(docObject.documentRelationImage, docObject.documentIntro);
            buildTables(docObject.tables);
            buildQueries(docObject.queries);

            buildJSLibraries();
            documentHtml += '</body></html>';

            return documentHtml;
        };

        /**
         * Add to the variable(s) to the documentHtml.
         * @param html, either a single variable or an array
         */
        addToDocument = function (html) {
            if(html.constructor === Array){
                for(i = 0; i < html.length; i++) {
                    documentHtml += html[i];
                }
            } else {
                documentHtml += html;
            }
        };

        /**
         * Create the first tags and the head.
         */
        buildBase = function() {
            var html = '<html>';
            html += '<head>';
            html += getStyleLibraries();
            html += getStyles();
            html += '</head>';
            html += '<body>';
            addToDocument(html);
        };

        /**
         * Add JS libraries, either third-party or own
         */
        buildJSLibraries = function() {
            var libs = '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js"></script>';
            libs += '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/components/prism-sql.min.js"></script>';
            addToDocument(libs);
        };

        /**
         * Return the style libraries used.
         * @returns {string}
         */
        getStyleLibraries = function() {
            var libs = '';
            libs += '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css">';
            return libs;
        };

        /**
         * Get the CSS used for the document.
         * @returns {string}
         */
        getStyles = function() {
            var style = '<style>';
            style += '* { font-family: "Arial"; font-size: 10pt; }';
            style += 'table { border-collapse: collapse; }';
            style += '.column-name { text-decoration: underline; }';
            style += ':not(pre)>code[class*=language-], pre[class*=language-] { background: none; }';
            style += '.language-css .token.string, .style .token.string, .token.entity, .token.operator, .token.url { background: none; }';
            style += '</style>';
            return style;
        };

        /**
         * Create the header of the page.
         * @param documentTitle
         */
        buildHeader = function(documentTitle) {
            addToDocument('<h1>' + documentTitle.toUpperCase() +'</h1>');
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
            var tablesHtml = '';
            angular.forEach(tables, function(table, key) {
                tablesHtml += '<h3>' + table.Name +'</h3>';
                tablesHtml += '<table border="1">';
                tablesHtml += '<tr>';
                tablesHtml += '<td rowspan="' + getAmountOfColumns(table) +'"><img src="' + table.Image + '"/></td>';

                angular.forEach(table.Columns, function(column, key) {
                    tablesHtml += buildColumn(column, key === 0);
                }, null);

                tablesHtml += getPresetColumns(table);

                tablesHtml += '</table>';
            }, null);

            addToDocument([header, tablesHtml]);
        };

        /**
         * Create the columns of each table.
         * @param column
         * @param isFirstColumn
         * @returns {string}
         */
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

        /**
         * Get the preset tables.
         * @param table
         * @returns {string}
         */
        getPresetColumns = function(table) {
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
            if(table.HasHistoryTable){
                columnHtml += getHistoryTableText(table.Name);
            }

            return columnHtml;
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
            var queryHtml = '';
            angular.forEach(queries, function(query, key) {
                queryHtml += '<h3>' + query.Title +'</h3>';
                queryHtml += '<table border="1">';
                queryHtml += '<tr>';
                queryHtml += '<td><pre><code class="language-sql">' + processSQL(query.Body) + '</code></pre></td>';
                queryHtml += '</table>';
            }, null);

            addToDocument([header, queryHtml]);
        };

        /**
         * Makes sure all the SQL keywords are capitalized
         * @param sql
         * @returns {string}
         */
        processSQL = function(sql) {
            sql = sql.replace(/\band\b/ig, 'AND');
            sql = sql.replace(/\bas\b/ig, 'AS');
            sql = sql.replace(/\bany\b/ig, 'ANY');
            sql = sql.replace(/\ball\b/ig, 'ALL');
            sql = sql.replace(/\bbetween\b/ig, 'BETWEEN');
            sql = sql.replace(/\bcount\b/ig, 'COUNT');
            sql = sql.replace(/\bdatetime\b/ig, 'DATETIME');
            sql = sql.replace(/\bdeclare\b/ig, 'DECLARE');
            sql = sql.replace(/\bdelete\b/ig, 'DELETE');
            sql = sql.replace(/\bdistinct\b/ig, 'DISTINCT');
            sql = sql.replace(/\bexists\b/ig, 'EXISTS');
            sql = sql.replace(/\bfrom\b/ig, 'FROM');
            sql = sql.replace(/\bfull\b/ig, 'FULL');
            sql = sql.replace(/\bgetdate\b/ig, 'GETDATE');
            sql = sql.replace(/\bgroup by\b/ig, 'GROUP BY');
            sql = sql.replace(/\bhaving\b/ig, 'HAVING');
            sql = sql.replace(/\binto\b/ig, 'INTO');
            sql = sql.replace(/\bint\b/ig, 'INT');
            sql = sql.replace(/\bin\b/ig, 'IN');
            sql = sql.replace(/\binner join\b/ig, 'INNER JOIN');
            sql = sql.replace(/\bjoin\b/ig, 'JOIN');
            sql = sql.replace(/\bleft join\b/ig, 'LEFT JOIN');
            sql = sql.replace(/\bmin\b/ig, 'MIN');
            sql = sql.replace(/\bmax\b/ig, 'MAX');
            sql = sql.replace(/\bnot\b/ig, 'NOT');
            sql = sql.replace(/\bnull\b/ig, 'NULL');
            sql = sql.replace(/\bon\b/ig, 'ON');
            sql = sql.replace(/\bor\b/ig, 'OR');
            sql = sql.replace(/\bouter\b/ig, 'OUTER');
            sql = sql.replace(/\bupdate\b/ig, 'UPDATE');
            sql = sql.replace(/\border by\b/ig, 'ORDER BY');
            sql = sql.replace(/\bselect\b/ig, 'SELECT');
            sql = sql.replace(/\btop\b/ig, 'TOP');
            sql = sql.replace(/\bright join\b/ig, 'RIGHT JOIN');
            sql = sql.replace(/\bunion\b/ig, 'UNION');
            sql = sql.replace(/\bwhere\b/ig, 'WHERE');

            return sql;
        };

    };
    app.service('docify', DocifyService);
}());