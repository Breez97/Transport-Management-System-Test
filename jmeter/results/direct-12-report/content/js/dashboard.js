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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.874453536599036, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7061328790459966, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9841269841269841, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.626984126984127, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.00641025641025641, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.6746031746031746, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9371794871794872, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.75, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.8612903225806452, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9842419080068143, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9718189581554227, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9688832054560955, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9580645161290322, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8921, 0, 0.0, 386.3900907969959, 2, 6500, 195.0, 794.0, 1083.0, 4181.920000000009, 29.716558462107308, 4220.016002062563, 13.428696451859244], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1174, 0, 0.0, 580.211243611583, 32, 1518, 517.0, 910.0, 1011.75, 1150.0, 3.934461391003019, 39.961382991246325, 1.6132693763426265], "isController": false}, {"data": ["[POST] Expenses", 315, 0, 0.0, 140.7428571428573, 7, 907, 100.0, 301.80000000000007, 394.2, 791.119999999997, 1.0566569387138975, 0.7460575846583476, 0.6666019359464627], "isController": false}, {"data": ["[GET] Expense Summary", 315, 0, 0.0, 756.9238095238095, 111, 1911, 694.0, 1317.2, 1512.1999999999994, 1881.719999999998, 1.055619414013934, 0.46801876363508405, 0.4432776836191325], "isController": false}, {"data": ["[GET] Fuel Analytics", 312, 0, 0.0, 3405.105769230771, 1032, 6500, 3284.5, 4913.8, 5427.65, 6166.960000000001, 1.0473031942747426, 10.384052081515097, 0.43774000698202126], "isController": false}, {"data": ["[GET] Expenses", 315, 0, 0.0, 618.6380952380953, 99, 1407, 604.0, 987.2, 1068.0, 1296.04, 1.0557255515747068, 7.254889302777062, 0.4232262868121445], "isController": false}, {"data": ["[GET] Bookings", 1170, 0, 0.0, 289.42991452991447, 12, 1191, 208.0, 591.7000000000003, 758.900000000001, 946.4299999999976, 3.939473524717671, 31.50938615868502, 1.6230106132194588], "isController": false}, {"data": ["[POST] Login", 12, 0, 0.0, 641.9166666666667, 295, 1380, 544.0, 1380.0, 1380.0, 1380.0, 0.4684755026351747, 0.3781201200468476, 0.11300141518641421], "isController": false}, {"data": ["[GET] Trip Report CSV", 310, 0, 0.0, 409.28064516129035, 121, 1025, 399.0, 638.5000000000002, 751.0499999999995, 912.78, 1.051118254194301, 3325.7319973747476, 0.46294368422034154], "isController": false}, {"data": ["[GET] Vehicles", 1174, 0, 0.0, 104.94207836456553, 2, 865, 93.0, 239.0, 346.5, 661.75, 3.9346723731704945, 23.96104247033076, 1.6138304655582107], "isController": false}, {"data": ["[GET] Location History", 1171, 0, 0.0, 167.1161400512384, 7, 929, 102.0, 362.79999999999995, 530.9999999999973, 798.7999999999997, 3.932195649399929, 829.8877792948156, 1.9468976506306288], "isController": false}, {"data": ["[POST] GPS Location", 1173, 0, 0.0, 207.3597612958226, 8, 993, 177.0, 399.60000000000014, 588.3999999999996, 861.8199999999999, 3.9363604941088823, 2.524605005897829, 2.162993964163347], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1170, 0, 0.0, 117.13333333333348, 2, 924, 93.0, 284.9000000000001, 388.2500000000002, 739.3499999999995, 3.9340558097934455, 7.310215694276789, 1.6942564571473724], "isController": false}, {"data": ["[GET] Invoice PDF", 310, 0, 0.0, 172.26451612903236, 5, 794, 88.0, 442.4000000000026, 585.8, 735.4799999999996, 1.0519778881034874, 6.436067263381329, 0.4448304937000099], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8921, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
