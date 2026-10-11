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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9140152254538356, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8257520176082171, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9956647398843931, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.6502890173410405, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.08092485549132948, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.7861271676300579, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9646799116997793, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.65, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.935672514619883, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9930300807043286, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9915503306392358, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9816446402349486, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9963262307127112, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9868035190615836, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10246, 0, 0.0, 280.83554557876244, 1, 5100, 103.0, 606.3000000000011, 897.0, 2866.0800000000236, 34.1293290385762, 4710.154551324943, 15.42366699483863], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1363, 0, 0.0, 458.1071166544382, 54, 1304, 422.0, 710.0, 807.5999999999999, 997.7199999999998, 4.569455386626883, 46.41086885235597, 1.8736210230987143], "isController": false}, {"data": ["[POST] Expenses", 346, 0, 0.0, 87.48554913294802, 5, 717, 85.0, 202.60000000000002, 244.74999999999966, 501.17999999999984, 1.1702473077547486, 0.8257796698701905, 0.7382614851655934], "isController": false}, {"data": ["[GET] Expense Summary", 346, 0, 0.0, 710.3843930635844, 57, 1615, 680.5, 1200.3, 1385.4499999999998, 1576.3099999999993, 1.1675935424653097, 0.5176635432414556, 0.49029806958992495], "isController": false}, {"data": ["[GET] Fuel Analytics", 346, 0, 0.0, 2414.66473988439, 664, 5100, 2319.5, 3610.6, 4028.2999999999993, 4826.959999999999, 1.160419629202329, 11.505605952432857, 0.48501914189316087], "isController": false}, {"data": ["[GET] Expenses", 346, 0, 0.0, 493.10115606936387, 46, 1201, 480.0, 877.6, 919.8499999999998, 1148.8999999999992, 1.1695708756570387, 8.037287465986108, 0.4689157120945798], "isController": false}, {"data": ["[GET] Bookings", 1359, 0, 0.0, 225.04782928623985, 9, 903, 197.0, 419.0, 573.0, 705.4000000000001, 4.574356005399019, 36.58692946247951, 1.8845926258705246], "isController": false}, {"data": ["[POST] Login", 10, 0, 0.0, 739.9000000000001, 317, 1477, 618.0, 1477.0, 1477.0, 1477.0, 0.4058276855647092, 0.3275552559758127, 0.09789007649851873], "isController": false}, {"data": ["[GET] Trip Report CSV", 342, 0, 0.0, 332.93274853801177, 49, 838, 311.0, 523.4, 621.8499999999999, 752.4099999999999, 1.159373124917369, 3668.249774036652, 0.5106223431032554], "isController": false}, {"data": ["[GET] Vehicles", 1363, 0, 0.0, 61.89508437270715, 1, 691, 8.0, 153.4000000000019, 235.39999999999986, 549.0799999999997, 4.570206145468689, 27.831127498440832, 1.874498614352392], "isController": false}, {"data": ["[GET] Location History", 1361, 0, 0.0, 107.54665686994852, 5, 816, 94.0, 220.0, 294.7999999999997, 591.0, 4.5736368982609426, 965.2624896297152, 2.264486237713182], "isController": false}, {"data": ["[POST] GPS Location", 1362, 0, 0.0, 139.15418502202638, 7, 813, 100.0, 299.0, 402.6999999999998, 616.1099999999997, 4.571160074507896, 2.9316605852813344, 2.5118358896477657], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1361, 0, 0.0, 61.470242468772916, 1, 655, 17.0, 142.5999999999999, 216.89999999999986, 443.0, 4.574974452751035, 8.501068346664404, 1.9702770836554753], "isController": false}, {"data": ["[GET] Invoice PDF", 341, 0, 0.0, 116.90909090909096, 5, 784, 80.0, 246.8, 331.7999999999997, 580.5799999999999, 1.1708355508249069, 7.163243279927553, 0.49508964209686], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10246, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
