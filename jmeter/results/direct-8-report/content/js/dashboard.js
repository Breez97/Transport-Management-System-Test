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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9369386958219446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9022366522366523, 500, 1500, "[GET] Trips"], "isController": false}, {"data": [0.9953416149068323, 500, 1500, "[POST] Expenses"], "isController": false}, {"data": [0.7111801242236024, 500, 1500, "[GET] Expense Summary"], "isController": false}, {"data": [0.09937888198757763, 500, 1500, "[GET] Fuel Analytics"], "isController": false}, {"data": [0.8385093167701864, 500, 1500, "[GET] Expenses"], "isController": false}, {"data": [0.9848375451263538, 500, 1500, "[GET] Bookings"], "isController": false}, {"data": [0.75, 500, 1500, "[POST] Login"], "isController": false}, {"data": [0.9622641509433962, 500, 1500, "[GET] Trip Report CSV"], "isController": false}, {"data": [0.9985569985569985, 500, 1500, "[GET] Vehicles"], "isController": false}, {"data": [0.9924187725631769, 500, 1500, "[GET] Location History"], "isController": false}, {"data": [0.9844765342960289, 500, 1500, "[POST] GPS Location"], "isController": false}, {"data": [0.9981949458483754, 500, 1500, "[GET] Lorry Receipts PDF"], "isController": false}, {"data": [0.9921383647798742, 500, 1500, "[GET] Invoice PDF"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10244, 0, 0.0, 225.45441233893092, 2, 4435, 96.0, 501.5, 763.0, 2454.0, 34.036954217572024, 4463.074332978159, 15.380858563812644], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["[GET] Trips", 1386, 0, 0.0, 382.02525252525277, 55, 1088, 371.0, 604.5999999999999, 715.8499999999988, 918.4299999999987, 4.651287661670839, 47.24198682722446, 1.9071844629037993], "isController": false}, {"data": ["[POST] Expenses", 322, 0, 0.0, 58.26708074534161, 5, 644, 26.5, 103.0, 194.0, 517.6299999999978, 1.0858275894627514, 0.766367159574504, 0.6850045144462279], "isController": false}, {"data": ["[GET] Expense Summary", 322, 0, 0.0, 643.9347826086953, 69, 1581, 610.5, 1104.1, 1194.85, 1471.079999999998, 1.083081062899428, 0.4800988847544568, 0.4548094307097208], "isController": false}, {"data": ["[GET] Fuel Analytics", 322, 0, 0.0, 2114.2173913043484, 617, 4435, 2147.0, 2910.7, 3303.5999999999985, 4089.5999999999985, 1.0779216866461572, 10.687351215632876, 0.45053757996538596], "isController": false}, {"data": ["[GET] Expenses", 322, 0, 0.0, 402.56211180124217, 71, 1203, 373.5, 696.0, 757.0, 892.3299999999995, 1.0852347409928886, 7.457638297917159, 0.43506746381146577], "isController": false}, {"data": ["[GET] Bookings", 1385, 0, 0.0, 170.15306859205788, 10, 778, 108.0, 318.4000000000001, 395.0, 651.0, 4.667133941689469, 37.32664301121966, 1.922820089357924], "isController": false}, {"data": ["[POST] Login", 8, 0, 0.0, 677.5000000000001, 209, 1673, 409.0, 1673.0, 1673.0, 1673.0, 0.3501247319357521, 0.282595791938378, 0.08445391483215896], "isController": false}, {"data": ["[GET] Trip Report CSV", 318, 0, 0.0, 279.1761006289306, 62, 806, 261.0, 443.0, 548.0, 739.9800000000001, 1.0893955225158871, 3446.840953044441, 0.4798021295455714], "isController": false}, {"data": ["[GET] Vehicles", 1386, 0, 0.0, 39.33838383838386, 2, 667, 5.0, 95.0, 149.64999999999986, 272.1299999999999, 4.6488538864552655, 28.309827501232654, 1.9067564768664178], "isController": false}, {"data": ["[GET] Location History", 1385, 0, 0.0, 93.17689530685925, 5, 691, 88.0, 223.4000000000001, 290.4000000000001, 570.400000000001, 4.657105869298407, 982.8829588226517, 2.3058131598967706], "isController": false}, {"data": ["[POST] GPS Location", 1385, 0, 0.0, 106.40000000000005, 5, 765, 93.0, 233.4000000000001, 319.4000000000001, 640.5600000000004, 4.652725287645922, 2.984119766733854, 2.5566565360712183], "isController": false}, {"data": ["[GET] Lorry Receipts PDF", 1385, 0, 0.0, 39.041155234657076, 2, 648, 5.0, 95.0, 142.70000000000005, 294.0, 4.660428086397943, 8.659818297984744, 2.007078892677239], "isController": false}, {"data": ["[GET] Invoice PDF", 318, 0, 0.0, 90.21069182389935, 5, 630, 76.0, 176.10000000000002, 227.0, 575.1500000000001, 1.0901088051996133, 6.669159878125493, 0.4609542115736646], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10244, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
