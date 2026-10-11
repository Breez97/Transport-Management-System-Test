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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8910947497589622, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6918044077134986, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9900442477876106, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.5630530973451328, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.26, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.6084070796460177, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9740843123704216, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.875, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.9619686800894854, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9979338842975206, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9958592132505176, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9913733609385783, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9965493443754313, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9988789237668162, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11409, 0, 0.0, 302.4733981944098, 2, 4214, 109.0, 801.0, 1198.5, 1914.7999999999993, 37.91612523720426, 5881.458019778515, 17.13991634707096], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1452, 0, 0.0, 570.0117079889803, 24, 1608, 591.0, 897.0, 998.3499999999999, 1231.47, 4.856544628701777, 49.311464284161374, 1.9913737904628435], "isController": false}, {"data": ["[POST] Expenses", 452, 0, 0.0, 124.49336283185845, 7, 750, 101.0, 239.7, 308.39999999999986, 616.389999999999, 1.5163205743231911, 1.0676436856318563, 0.9565850498171694], "isController": false}, {"data": ["[GET] Expense Summary", 452, 0, 0.0, 907.5442477876106, 62, 1980, 899.5, 1494.4, 1596.35, 1747.6899999999991, 1.5132999648459078, 0.667980062607764, 0.6354677586755277], "isController": false}, {"data": ["[GET] Fuel Analytics", 450, 0, 0.0, 1611.5444444444438, 340, 4214, 1482.5, 2387.5000000000005, 2905.9, 3659.7400000000002, 1.5033625208382748, 14.902733488903515, 0.6283585536316227], "isController": false}, {"data": ["[GET] Expenses", 452, 0, 0.0, 787.5309734513281, 33, 1692, 800.0, 1294.7, 1395.0, 1546.1199999999972, 1.5150804132281268, 10.416380790908846, 0.6075961893800237], "isController": false}, {"data": ["[GET] Bookings", 1447, 0, 0.0, 207.63648928818233, 8, 1000, 195.0, 398.0, 501.5999999999999, 748.5199999999995, 4.8575955741160985, 38.86418061434988, 2.0012902463710707], "isController": false}, {"data": ["[POST] Login", 12, 0, 0.0, 405.25, 78, 1035, 284.5, 1030.5, 1035.0, 1035.0, 0.46701692936368944, 0.3760307209573847, 0.1126495913601868], "isController": false}, {"data": ["[GET] Trip Report CSV", 447, 0, 0.0, 295.5011185682325, 41, 810, 291.0, 479.2, 532.8, 700.5999999999995, 1.5127466673886336, 4786.318637284298, 0.6662585419846425], "isController": false}, {"data": ["[GET] Vehicles", 1452, 0, 0.0, 71.85537190082643, 3, 589, 89.0, 138.0, 199.0, 381.47, 4.861032065402977, 29.620652178006843, 1.9937826830754397], "isController": false}, {"data": ["[GET] Location History", 1449, 0, 0.0, 114.84057971014501, 6, 824, 99.0, 204.0, 300.5, 469.5, 4.861665648926675, 1026.0931106796434, 2.407094222661938], "isController": false}, {"data": ["[POST] GPS Location", 1449, 0, 0.0, 146.63699102829548, 7, 761, 104.0, 298.0, 367.5, 563.0, 4.860817583479259, 3.1107835657233527, 2.671003170517749], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1449, 0, 0.0, 76.44444444444449, 2, 687, 79.0, 170.0, 242.5, 440.0, 4.855930669776607, 9.01621298358233, 2.0912748294643393], "isController": false}, {"data": ["[GET] Invoice PDF", 446, 0, 0.0, 99.18609865470852, 6, 770, 80.0, 185.3, 254.29999999999995, 424.8299999999997, 1.5184477786743202, 9.286993971319722, 0.6420780157870905], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11409, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
