// main variables
var fetchedData;
var filterArray = [1, 1, 1, 1];

// convert data to object
function processData(data) {
    // console.log(data);
    // console.log(JSON.parse(data));
    data = JSON.parse(data);
    var research_talks = data['research_talk'];
    var competitions = data['competition'];
    var conferences = data['conference'];
    var workshops = data['workshop'];

    var finalArray = [];

    // adding talks to the final display array
    if (filterArray[0]) {
        research_talks.forEach((talk) => {
            var typeTxt = '';
            if (talk['registration'] == '1') {
                typeTxt = 'Register';
            } else {
                typeTxt = 'Livestream';
            }

            finalArray.push({
                'date': talk['date'],
                'time': talk['time'],
                'description': talk['title'],
                'type': "Research Talk",
                'details': "Dummmy Details",
                'link_text': typeTxt,
                'link': talk['link'],
            });
        });
    }

    // adding competitions to the final display array
    if (filterArray[1]) {
    competitions.forEach((competition) => {
        var typeTxt = '';
        if (competition['registration'] == '1') {
            typeTxt = 'Register';
        } else {
            typeTxt = 'More Info';
        }

        finalArray.push({
            'date': competition['date'],
            'time': competition['time'],
            'description': competition['description'],
            'type': "Competition",
            'details': "Dummmy Details",
            'link_text': typeTxt,
            'link': competition['link'],
        });
    });
}

    // adding conferences to the final display array
    if (filterArray[2]) {
    conferences.forEach((conference) => {
        var typeTxt = '';
        if (conference['registration'] == '1') {
            typeTxt = 'Register';
        } else {
            typeTxt = 'Live Stream';
        }

        finalArray.push({
            'date': conference['date'],
            'time': conference['time'],
            'description': conference['topic'],
            'type': "Conference",
            'details': "Dummmy Details",
            'link_text': typeTxt,
            'link': conference['link'],
        });
    });
}

    // adding conferences to the final display array
    if (filterArray[3]) {
    workshops.forEach((workshop) => {
        var typeTxt = '';
        if (workshop['registration'] == '1') {
            typeTxt = 'Register';
        } else {
            typeTxt = 'More Info';
        }

        finalArray.push({
            'date': workshop['date'],
            'time': workshop['time'],
            'description': workshop['description'],
            'type': "Work Shop",
            'details': "Dummmy Details",
            'link_text': typeTxt,
            'link': workshop['link'],
        });
    });
}

    // sorting the final array
    finalArray.sort((a, b) => {
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

    // console.log(finalArray);

    fillTable(finalArray);
    document.getElementById("loading").style.display = 'none'
    document.getElementById("category").style.opacity = 1;
}

// add a row to the table
function addRow(rowData) {
    var table = document.getElementById("eventTable");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = ''
    row.children[0].className = 'type '+  rowData['type'].replaceAll(' ','');
    console.log(rowData['type'].replaceAll(' ',''))
    

    row.insertCell(1).innerHTML = rowData['type'];  
    row.insertCell(2).innerHTML = rowData['date'];
    row.insertCell(3).innerHTML = rowData['time'] ? rowData['time'] : "TBA";
    row.insertCell(4).innerHTML = rowData['description'];
    row.insertCell(5).innerHTML = '<a target="_blank" href=' + rowData['link'] + '>' + ((rowData['link_text']=="Register")?'<i class="fas fa-link"></i>':'<i class="fas fa-satellite-dish"></i>') + '</a>'
    row.insertCell(6).innerHTML = '<button type="button" onclick="" class = "info_button">Additional Info</button>'
    console.log((rowData['link_text']=="Register"?1:2 ))
}   

// loop and add all the data
function fillTable(tableData) {
    tableData.forEach((tableRow) => {
        addRow(tableRow);
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
    cleanTable();
    processData(fetchedData);
}
// filter button click event section
function allData() {
    filterArray = [1, 1, 1, 1];
    refreshTable(); 
    return false;
}
function researchSeminar() {
    filterArray = [1, 0, 0, 0];
    refreshTable(); 
    return false;
}
function competitions() {
    filterArray = [0, 1, 0, 0];
    refreshTable(); 
    return false;
}
function conferences() {
    filterArray = [0, 0, 1, 0];
    refreshTable(); 
    return false;
}
function workshops() {
    filterArray = [0, 0, 0, 1];
    refreshTable(); 
    return false;
}

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
        url: "https://drawing-room-disadv.000webhostapp.com/api/getData.php?date=" + today,
        dataType: "text",
        success: function (data) {
            fetchedData = data;
            processData(fetchedData);
        }
    });

   
});


$(document).ready(function() {
  
    $(".selLabel").click(function () {
      $('.dropdown').toggleClass('active');
    });
    
    $(".dropdown-list li").click(function() {
      $('.selLabel').text($(this).text());
      $('.dropdown').removeClass('active');
      $('.selected-item p span').text($('.selLabel').text());
    });
    
  });