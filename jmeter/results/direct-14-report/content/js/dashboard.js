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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.827918576435697, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6435897435897436, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.571969696969697, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.0019083969465648854, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.6283018867924528, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.8806818181818182, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.7065637065637066, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.961025641025641, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9228395061728395, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9162384378211716, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9550619834710744, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9575289575289575, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7418, 0, 0.0, 541.8463197627389, 3, 8899, 292.0, 994.1000000000004, 1291.0499999999993, 5928.479999999996, 24.69398828883111, 3518.470557295845, 11.156512257113087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 975, 0, 0.0, 691.4410256410248, 73, 2201, 606.0, 1101.0, 1200.1999999999998, 1395.72, 3.2685435369999127, 33.19790331836787, 1.3402338014334658], "isController": false}, {"data": ["[POST] Expenses", 264, 0, 0.0, 214.14772727272737, 6, 1099, 184.0, 442.0, 630.0, 949.3500000000018, 0.8865665025623115, 0.6259644349146007, 0.5592987897023957], "isController": false}, {"data": ["[GET] Expense Summary", 264, 0, 0.0, 846.7500000000005, 98, 1998, 754.5, 1415.0, 1597.5, 1835.0500000000056, 0.8855553841096478, 0.3926192816267384, 0.37186407731166854], "isController": false}, {"data": ["[GET] Fuel Analytics", 262, 0, 0.0, 5075.8473282442765, 1420, 8899, 5014.0, 7405.6, 7849.4, 8419.570000000002, 0.8785018525659296, 8.710380184669807, 0.3671863211896659], "isController": false}, {"data": ["[GET] Expenses", 265, 0, 0.0, 719.8679245283018, 97, 1503, 702.0, 1099.0, 1199.4, 1391.34, 0.8882870139142619, 6.1040892994516085, 0.35602187364871435], "isController": false}, {"data": ["[GET] Bookings", 968, 0, 0.0, 380.3677685950409, 19, 2131, 297.0, 817.6000000000001, 984.3999999999996, 1107.1699999999996, 3.265008752786894, 26.112214095654977, 1.3451421558417687], "isController": false}, {"data": ["[POST] Login", 14, 0, 0.0, 666.1428571428571, 309, 1605, 539.0, 1605.0, 1605.0, 1605.0, 0.5309868770386104, 0.4285748572972768, 0.12807984241068043], "isController": false}, {"data": ["[GET] Trip Report CSV", 259, 0, 0.0, 578.5289575289572, 128, 1475, 517.0, 921.0, 1022.0, 1316.8, 0.8853913840137287, 2801.3731511792967, 0.38995265057635903], "isController": false}, {"data": ["[GET] Vehicles", 975, 0, 0.0, 191.25948717948725, 4, 1197, 100.0, 402.0, 706.5999999999991, 965.1200000000003, 3.2715595776164927, 19.923460317030898, 1.3418506080067645], "isController": false}, {"data": ["[GET] Location History", 972, 0, 0.0, 278.02263374485574, 7, 2718, 195.0, 699.1000000000001, 846.1499999999992, 1251.089999999997, 3.2640341716170065, 688.8737744130951, 1.6160794189549046], "isController": false}, {"data": ["[POST] GPS Location", 973, 0, 0.0, 325.4850976361769, 10, 1294, 215.0, 722.8000000000001, 903.3, 1132.6999999999996, 3.265210241954428, 2.094128315966979, 1.794218529774489], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 968, 0, 0.0, 194.68491735537208, 3, 1208, 99.0, 488.20000000000005, 721.9499999999996, 993.31, 3.265107869989341, 6.067469497129538, 1.4061646197903315], "isController": false}, {"data": ["[GET] Invoice PDF", 259, 0, 0.0, 213.5830115830116, 11, 963, 173.0, 482.0, 706.0, 853.799999999999, 0.8858880429057128, 5.419921540974887, 0.37459914314274767], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7418, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
