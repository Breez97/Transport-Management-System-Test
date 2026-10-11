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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8500307044477585, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6048663468128855, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9707207207207207, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.3871331828442438, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.11312217194570136, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.44308035714285715, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.954514128187457, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.8125, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.9375, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9876627827278959, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9831383344803855, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9686854783207157, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9879393521709167, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9886363636363636, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11399, 0, 0.0, 402.64479340293013, 2, 6145, 196.0, 1098.0, 1597.0, 2593.0, 37.93571661530475, 5818.758739864201, 17.14385202878209], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1459, 0, 0.0, 747.5311857436599, 21, 1941, 746.0, 1194.0, 1303.0, 1592.4, 4.879533384168774, 49.54295265489759, 2.000802821617771], "isController": false}, {"data": ["[POST] Expenses", 444, 0, 0.0, 189.22972972972983, 7, 967, 194.0, 366.0, 551.0, 848.4000000000001, 1.4876365342089393, 1.0474472081685988, 0.9384894541982176], "isController": false}, {"data": ["[GET] Expense Summary", 443, 0, 0.0, 1187.3972911963872, 52, 2500, 1295.0, 1899.6, 2002.6, 2197.0, 1.483500659705711, 0.654826463073224, 0.6229543785873591], "isController": false}, {"data": ["[GET] Fuel Analytics", 442, 0, 0.0, 2201.013574660634, 273, 6145, 1972.5, 3598.5999999999995, 4367.099999999999, 5417.73, 1.4796663051192436, 14.667693091012868, 0.6184542759678089], "isController": false}, {"data": ["[GET] Expenses", 448, 0, 0.0, 1137.3058035714278, 31, 3206, 1163.5, 1799.0, 1996.2999999999997, 2302.51, 1.4962710120870641, 10.286364181467949, 0.6000485380046158], "isController": false}, {"data": ["[GET] Bookings", 1451, 0, 0.0, 262.7760165403173, 8, 2141, 201.0, 494.79999999999995, 683.3999999999999, 1021.3200000000002, 4.880198033122116, 39.043410450384094, 2.0106038572399134], "isController": false}, {"data": ["[POST] Login", 16, 0, 0.0, 489.0000000000001, 61, 1337, 359.0, 1114.4000000000003, 1337.0, 1337.0, 0.5815855475991422, 0.46827859765184837, 0.14028479517283995], "isController": false}, {"data": ["[GET] Trip Report CSV", 440, 0, 0.0, 332.6772727272724, 40, 1398, 305.0, 538.5000000000002, 639.0, 894.7099999999982, 1.4900757568060905, 4714.5880533176205, 0.6562735999214324], "isController": false}, {"data": ["[GET] Vehicles", 1459, 0, 0.0, 103.48183687457158, 3, 894, 97.0, 200.0, 338.0, 689.8000000000002, 4.8877066973976895, 29.780981787513735, 2.004723450104521], "isController": false}, {"data": ["[GET] Location History", 1453, 0, 0.0, 145.47487955953218, 6, 1293, 102.0, 288.60000000000014, 409.89999999999986, 774.9200000000001, 4.870951629070161, 1028.050265709699, 2.411691871033762], "isController": false}, {"data": ["[POST] GPS Location", 1453, 0, 0.0, 214.5753613214043, 8, 1081, 198.0, 400.0, 539.0, 825.300000000002, 4.871359890570415, 3.117663519951454, 2.6768002637675425], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1451, 0, 0.0, 99.85733976567889, 2, 2200, 94.0, 198.79999999999995, 314.9999999999993, 666.8800000000001, 4.885192916301933, 9.07053028836442, 2.103877027430813], "isController": false}, {"data": ["[GET] Invoice PDF", 440, 0, 0.0, 118.60909090909095, 7, 913, 82.0, 244.4000000000002, 335.0, 724.1499999999978, 1.4920362564810326, 9.125462764370175, 0.6309098623596553], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11399, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
