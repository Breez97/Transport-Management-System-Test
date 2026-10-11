/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9205783918304299, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8100334448160535, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9988839285714286, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.6506696428571429, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.34080717488789236, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.6822222222222222, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9879356568364611, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.75, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.9831838565022422, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9993311036789297, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9963161419959813, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9922973878097789, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9993297587131368, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.998876404494382, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11653, 0, 0.0, 246.9878142967478, 2, 4357, 103.0, 625.6000000000004, 959.5999999999985, 1688.57999999998, 38.797810568932455, 5916.253074257455, 17.538373464718067], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1495, 0, 0.0, 445.98729096989945, 25, 1366, 440.0, 700.0, 789.2, 933.1199999999999, 4.994304154793363, 50.71153631539782, 2.0478774102946136], "isController": false}, {"data": ["[POST] Expenses", 448, 0, 0.0, 89.0089285714286, 6, 502, 94.0, 197.0, 246.84999999999968, 401.2399999999998, 1.499993303601323, 1.0561476288052285, 0.946284838014116], "isController": false}, {"data": ["[GET] Expense Summary", 448, 0, 0.0, 764.4062500000001, 36, 1657, 752.5, 1282.1, 1366.3499999999983, 1525.7299999999998, 1.4970159926753146, 0.6607922155168381, 0.6286297625492043], "isController": false}, {"data": ["[GET] Fuel Analytics", 446, 0, 0.0, 1404.4439461883412, 325, 4357, 1322.5, 2133.3, 2516.65, 3391.8099999999977, 1.4939771950745648, 14.809809830897526, 0.6244357807538221], "isController": false}, {"data": ["[GET] Expenses", 450, 0, 0.0, 614.5711111111109, 31, 1397, 605.5, 999.0, 1097.45, 1205.92, 1.5019374993741927, 10.32613973066923, 0.6023232209133115], "isController": false}, {"data": ["[GET] Bookings", 1492, 0, 0.0, 173.3357908847183, 9, 1101, 170.0, 302.0, 392.0, 628.4899999999996, 5.004662520712997, 40.043019562880296, 2.061868887779164], "isController": false}, {"data": ["[POST] Login", 10, 0, 0.0, 412.59999999999997, 55, 765, 482.5, 756.5, 765.0, 765.0, 0.40723244828147903, 0.32789370469539014, 0.09822892063039583], "isController": false}, {"data": ["[GET] Trip Report CSV", 446, 0, 0.0, 257.8587443946188, 40, 838, 258.5, 401.6, 468.65, 610.2999999999997, 1.505968158565616, 4764.871488325371, 0.6632730854620048], "isController": false}, {"data": ["[GET] Vehicles", 1495, 0, 0.0, 62.26354515050162, 2, 527, 43.0, 125.0, 195.20000000000005, 388.1999999999998, 4.999264322307085, 30.462301063973865, 2.0504795071962656], "isController": false}, {"data": ["[GET] Location History", 1493, 0, 0.0, 98.30609511051573, 6, 669, 95.0, 194.0, 255.0, 476.0, 5.0026470805047545, 1055.8395703248034, 2.4768965525546003], "isController": false}, {"data": ["[POST] GPS Location", 1493, 0, 0.0, 121.49832551908914, 7, 760, 101.0, 241.20000000000027, 321.5999999999999, 573.2999999999997, 5.0025967933790145, 3.2016603771214127, 2.7489099750372765], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1492, 0, 0.0, 60.54758713136729, 2, 571, 27.0, 124.0, 195.3499999999999, 357.27999999999975, 5.005535612440031, 9.294003663149596, 2.1557043018418494], "isController": false}, {"data": ["[GET] Invoice PDF", 445, 0, 0.0, 82.67865168539319, 6, 517, 75.0, 172.40000000000003, 225.39999999999998, 420.48000000000025, 1.506263687536599, 9.212474386112927, 0.6369259538118626], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11653, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
