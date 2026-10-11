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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8739470517448856, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6509933774834437, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9988425925925926, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.44328703703703703, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.1423611111111111, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.5196304849884527, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9733865602129075, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.9461358313817331, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9937086092715232, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9913678618857902, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9853917662682603, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9950099800399201, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9929577464788732, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11634, 0, 0.0, 345.4883960804543, 3, 5801, 147.0, 902.5, 1396.0, 2299.4999999999964, 38.693841712453604, 5719.132712280447, 17.48737329774868], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1510, 0, 0.0, 635.5139072847684, 24, 2100, 606.0, 999.0, 1096.45, 1300.89, 5.049998327815123, 51.273630062539716, 2.0706809032306612], "isController": false}, {"data": ["[POST] Expenses", 432, 0, 0.0, 130.07870370370358, 7, 653, 103.0, 238.49999999999994, 299.0, 406.0, 1.4471634591226572, 1.018950052761168, 0.9129566353449576], "isController": false}, {"data": ["[GET] Expense Summary", 432, 0, 0.0, 1112.4583333333326, 41, 2096, 1199.0, 1695.7, 1799.05, 2004.3700000000001, 1.446770887754692, 0.6386137121729695, 0.6075307438813647], "isController": false}, {"data": ["[GET] Fuel Analytics", 432, 0, 0.0, 2021.4791666666665, 274, 5801, 1854.0, 3028.0999999999995, 4435.249999999996, 5292.990000000003, 1.4427508449443607, 14.301747832534032, 0.6030247672228383], "isController": false}, {"data": ["[GET] Expenses", 433, 0, 0.0, 963.4896073902992, 36, 2198, 955.0, 1518.8000000000004, 1697.6, 2064.359999999997, 1.4465591602607146, 9.944608116725297, 0.580095696737057], "isController": false}, {"data": ["[GET] Bookings", 1503, 0, 0.0, 222.07052561543605, 9, 1280, 199.0, 395.0, 503.0, 931.6400000000012, 5.046486094462967, 40.374934867634664, 2.079094352166161], "isController": false}, {"data": ["[POST] Login", 14, 0, 0.0, 365.42857142857144, 58, 959, 309.0, 880.0, 959.0, 959.0, 0.5334349399885693, 0.4295088945513431, 0.12867034196989902], "isController": false}, {"data": ["[GET] Trip Report CSV", 427, 0, 0.0, 322.2318501170961, 39, 1077, 306.0, 504.0, 582.7999999999997, 841.1599999999999, 1.441530250191585, 4560.990449651095, 0.6348927176136766], "isController": false}, {"data": ["[GET] Vehicles", 1510, 0, 0.0, 88.25033112582781, 3, 978, 96.0, 194.0, 246.80000000000018, 547.0200000000018, 5.0523808089832, 30.784890417080724, 2.0722655661845155], "isController": false}, {"data": ["[GET] Location History", 1506, 0, 0.0, 127.28021248339964, 6, 989, 101.0, 238.29999999999995, 315.0, 650.5100000000004, 5.044905014421192, 1064.7681142416814, 2.497819181944868], "isController": false}, {"data": ["[POST] GPS Location", 1506, 0, 0.0, 175.35524568393086, 7, 1005, 179.5, 309.5999999999999, 403.0, 688.0200000000009, 5.046358814206204, 3.2296036715108585, 2.7729312096433705], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1503, 0, 0.0, 82.01596806387212, 3, 886, 93.0, 148.60000000000014, 209.79999999999995, 518.880000000001, 5.050454137642516, 9.377260292442465, 2.1750490963870606], "isController": false}, {"data": ["[GET] Invoice PDF", 426, 0, 0.0, 102.72769953051645, 6, 669, 81.0, 206.80000000000007, 300.4499999999997, 537.9200000000001, 1.443568664394006, 8.829024847764503, 0.6104152653150436], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11634, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
