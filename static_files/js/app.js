// to filter the data
//      1) add the tags to the selectedTagArr 
//      2) call the refreshTable() function 
//for csv reading


// main variables
var fetchedData = new Array();
var selectedTagArr = []; // contained the selected tags
var tagArray = [];

// convert data to object
function populateData(allText) {
    document.getElementById("loading").style.display = 'none'
    document.getElementById("category").style.opacity = 1;
    // console.log(data);
    // console.log(JSON.parse(data));
    // events = JSON.parse(data)['data'];

    // load data from the csv file
    var allTextLines = allText.split(/\r\n|\n/);
    // console.log(allTextLines);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        // console.log(data.length);

        // break if a null line gets
        if (data == null) break;

        if (data.length == headers.length) {

            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr[headers[j]] = data[j].replace(/['"]+/g, '');
            }
            lines.push(tarr);
        }
    }
    // console.log(lines);

    lines.forEach((event) => {
        // getting the tags
        var tags = event['tags'].split(',');

        // filling the data array
        fetchedData.push({
            'date': event['date'],
            'time': event['time'],
            'description': event['description'],
            'type': "Research Talk",
            'details': event["additional_info"],
            'link_text': event["registration"] ? "registration" : "live stream",
            'link': event['link'],
            'visible': true,
            'tags': tags,
        });

        // console.log(tags);
    });

    // sorting the data array
    fetchedData.sort((a, b) => {
        if (a.date < b.date) {
            return -1;
        } else if (a.date > b.date) {
            return 1;
        } else {
            if (a.time < b.time) {
                return -1;
            } else {
                return 1;
            }
        }
    });

    // varible to count the index
    var index = 0;

    fetchedData.forEach((data) => {
        // console.log(data.tags);
        // adding tags
        data.tags.forEach((tag) => {
            // console.log('tag: ' + tag);
            if (tag in tagArray) {
                tagArray[tag].push(index);
            } else {
                tagArray[tag] = [index]
            }
        });

        index++;
    });

    // console.log(fetchedData);
    // console.log(tagArray);

    // filling the html table
    fillTable();
}

// add a row to the table
function addRow(rowData, colType) {
    var table = document.getElementById("eventTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.className = colType ? 'even' : 'odd'


    var popupCode = 'document.getElementById("popup_content").innerHTML = "' + rowData["details"].replaceAll('\"', '\\"') + '"; location.href="#popup1";';
    popupCode = popupCode.replace(/(\r\n|\n|\r)/gm, "");
    // popupCode = popupCode.replace('\"', '\\"');
    // console.log(popupCode);

    let div = document.createElement("div");
    div.className = "table_tag_hold"



    rowData['tags'].forEach((tag) => {
        tag = tag.replace(/ /g, '')
        let child = document.createElement("div")
        child.className = "table_tag " + tag
        child.textContent = (tag == 'competition') ? "CM" :
                            (tag == 'workshop') ? "W" :
                            (tag == 'conference') ? "CN" :
                            (tag == 'researchtalk') ? "RT" : "null";
        div.appendChild(child)

    })

    row.insertCell(0).appendChild(div);
    row.insertCell(1).innerHTML = rowData['date'];
    row.insertCell(2).innerHTML = rowData['time'] ? rowData['time'] : "TBA";
    row.insertCell(3).innerHTML = rowData['description'];
    row.insertCell(4).innerHTML = '<a target="_blank" href=' + rowData['link'] + '>' + ((rowData['link_text'] == "Register") ? '<i class="fas fa-link" style = "font-size:20px"></i>' : '<i class="fas fa-satellite-dish" style = "font-size:20px"></i>') + '</a>'
    row.insertCell(5).innerHTML = "<button type='button' onclick='" + popupCode + "' class = 'info_button'>Additional Info</button>"
    // console.log((rowData['link_text'] == "Register" ? 1 : 2))
    // console.log(rowData);
}

// add an empty row
function addEmptyRow() {
    var table = document.getElementById("eventTable");
    var rowCount = table.rows.length;
    
    var row = table.insertRow(rowCount);
    row.insertCell().innerHTML = ''
    row.className =  'emptyRow'
}

// loop and add all the data
function fillTable() {
    let refWeekNo = 0;
    // selecting the col type (odd or even)
    let count = 0;

    // get the first week of the table
    if (fetchedData.length > 0) {
        var mydate = new Date(fetchedData[0]['date']);
        refWeekNo = mydate.getWeek();
    }

    fetchedData.forEach((tableRow) => {
        if (tableRow['visible']) {
            // check the week no
            var mydate = new Date(tableRow['date']);
            var tmpWeek = mydate.getWeek();
            // adding weekly separators
            if (refWeekNo != tmpWeek) {
                addEmptyRow();
                refWeekNo = tmpWeek;
            }
            count++;
            addRow(tableRow, count % 2);
        }
    });
}

// clear the table
function cleanTable() {
    var tableHeaderRowCount = 1;
    var table = document.getElementById('eventTable');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

// refresh table
function refreshTable() {
    // removing the visibility of all the tags
    fetchedData.forEach((event) => {
        event['visible'] = false;
    });

    // console.log('tagarray', tagArray);
    // console.log('fetchedData', fetchedData);

    // enable the visibility of the filtered tags
    selectedTagArr.forEach((tag) => {
        // console.log(tagArray[tag]);
        if (tagArray[tag]) {
            tagArray[tag].forEach((eventIndex) => {
                // console.log(eventIndex)
                fetchedData[eventIndex]['visible'] = true;
            });
        }
    });

    // clean and fill the table
    cleanTable();
    fillTable();
}

// get the week no
Date.prototype.getWeek = function (dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
        weeknum = Math.floor((daynum + day - 1) / 7) + 1;
        if (weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1, 0, 1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
};


// loading the csv file
$(document).ready(function () {
    // get the current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    // console.log("https://drawing-room-disadv.000webhostapp.com/api/getData.php?date=" + today);

    $.ajax({
        type: "GET",
        url: "data/data.csv",
        dataType: "text",
        success: function (data) {
            populateData(data);
        }
    });


});


// $(document).ready(function () {

//     $(".selLabel").click(function () {
//         $('.dropdown').toggleClass('active');
//     });

//     $(".dropdown-list li").click(function () {
//         $('.selLabel').text($(this).text());
//         $('.dropdown').removeClass('active');
//         $('.selected-item p span').text($('.selLabel').text());
//     });

// });
document.getElementById("all_tag").addEventListener('click', () => {
    selectAll();
})



// this function gets the tagname and the HTML id of the tag 
// pushes the tagName into the selected tag array and call the
// refreshTable() to execute the filtering
function toggleTag(tagName, tagId) {

    if (selectedTagArr.includes(tagName)) {
        selectedTagArr.splice(selectedTagArr.indexOf(tagName), 1)
    }else {
        selectedTagArr.push(tagName);
    }
    
    document.getElementById("all_tag").className = "tag All"
    document.getElementById(tagId).classList.toggle("active")
    
    // console.log(selectedTagArr)
    
    if(selectedTagArr.length == 0){
        selectAll();
    }else{
        refreshTable()
    }
    
}

function selectAll(){
    document.getElementById("all_tag").classList.toggle("active")
    document.getElementById("r_tag").className = "tag RTalk"
    document.getElementById("w_tag").className = "tag workshop"
    document.getElementById("cm_tag").className = "tag competition"
    document.getElementById("cn_tag").className = "tag conference"

    //TODO correct the conferece to confetrence
    selectedTagArr = ["research talk", "workshop", "conference",  "competition"]
    refreshTable();
    selectedTagArr = [];
}



document.getElementById("r_tag").addEventListener('click', () => {
    toggleTag("research talk", "r_tag")
})

document.getElementById("w_tag").addEventListener('click', () => {
    toggleTag("workshop", "w_tag")
})


document.getElementById("cn_tag").addEventListener('click', () => {
    //TODO correct the conferece to confetrence
    toggleTag("conference", "cn_tag")
})

document.getElementById("cm_tag").addEventListener('click', () => {
    toggleTag("competition", "cm_tag")
})
