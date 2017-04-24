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
         * Return the style libraries used.
         * @returns {string}
         */
        getStyleLibraries = function() {
            var libs = '';
            // Prism css
            libs += "<style>code[class*=language-],pre[class*=language-]{color:#000;background:0 0;text-shadow:0 1px #fff;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{text-shadow:none;background:#b3d4fc}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#708090}.token.punctuation{color:#999}.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#905}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#690}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url{color:#a67f59;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function{color:#DD4A68}.token.important,.token.regex,.token.variable{color:#e90}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}</style>";
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
                queryHtml += '<table border="1"><tr>';
                queryHtml += '<td><pre><code class="language-sql">' + processSQL(query.Body) + '</code></pre></td>';
                queryHtml += '</tr></table>';
            }, null);

            addToDocument([header, queryHtml]);
        };

        /**
         * Makes sure all the SQL keywords are capitalized
         * @param sql
         * @returns {string}
         */
        processSQL = function(sql) {
            sql = replaceWordsInString(sql, [
                'AND',
                'AS',
                'ANY',
                'ALL',
                'BETWEEN',
                'COUNT',
                'DATETIME',
                'DECLARE',
                'DELETE',
                'DISTINCT',
                'EXISTS',
                'FROM',
                'FULL',
                'GETDATE',
                'GROUP BY',
                'HAVING',
                'INTO',
                'INT',
                'IN',
                'INNER JOIN',
                'JOIN',
                'LEFT JOIN',
                'MIN',
                'MAX',
                'NOT',
                'NULL',
                'ON',
                'OR',
                'OUTER',
                'UPDATE',
                'ORDER BY',
                'SELECT',
                'TOP',
                'RIGHT JOIN',
                'UNION',
                'WHERE'
            ]);

            // Define the variables
            sql = styleSqlWord(sql, '@([a-zA-Z]+)', 'variable');
            // Define the operators
            sql = styleSqlWord(sql, '( \= )|( \+ )|( \- )|( \< )|( \> )', 'operator');
            // Define the numbers
            sql = styleSqlWord(sql, '[0-9][0-9]*', 'number');
            // Define the comments
            //sql = styleSqlWord(sql, '\/\*(.*?)\*\/', 'comment'); // Turned off because it slows down the process too much
            console.log(sql);

            return sql;
        };

        /**
         * Replace the given words in the string.
         * @param string
         * @param words
         * @returns {*}
         */
        replaceWordsInString = function(string, words) {
            angular.forEach(words, function(word) {
                string = replaceSqlWord(string, word);
            }, null);

            return string;
        };

        /**
         * Replace a word in a string including the sql wrapper.
         * @param string
         * @param word
         * @returns {*|void|XML}
         */
        replaceSqlWord = function(string, word) {
            var regExp = new RegExp('\\b' + word + '\\b', 'gi');
            return string.replace(regExp, wrapSql(word));
        };

        /**
         * Style certain words with a certain class name.
         * @param string
         * @param regexp
         * @param type
         * @returns {*}
         */
        styleSqlWord = function(string, regexp, type) {
            // Get all words that match the regexp
            var matches = string.match(new RegExp(regexp, 'gi'));
            console.log(matches);
            angular.forEach(matches, function(word) {
                console.log(word);

                // Escape the word so it will not interfere with the regexp
                var wordEscaped = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

                // Replace the word with the span
                string = string.replace(new RegExp(wordEscaped, 'gi'), wrapSql(word, type));
            }, null);

            return string;
        };

        /**
         * Get the wrapper for SQL keywords.
         * @param word
         * @param type of sql variable
         * @returns {string}
         */
        wrapSql = function(word, type) {
            type = typeof type !== 'undefined' ? type : 'keyword';
            return '<span class="token ' + type + '">' + word + '</span>';
        };

    };
    app.service('docify', DocifyService);
}());