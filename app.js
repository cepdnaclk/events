// convert data to object
function processData(data) {
    // console.log(data);
    // console.log(JSON.parse(data));
    data = JSON.parse(data);
    var research_talk = data['research_talk'];
    var competion = data['competition'];

    var finalArray = [];

    // adding talks to the final display array
    research_talk.forEach((talk) => {
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
            'type': "Talk",
            'details': "Dummmy Details",
            'link_text': typeTxt,
            'link': talk['link'],
        });
    });

    // adding competitions to the final display array
    competion.forEach((competion) => {

        finalArray.push({
            'date': competion['date'],
            'time': competion['time'],
            'description': competion['description'],
            'type': "Competition",
            'details': "Dummmy Details",
            'link_text': 'more info',
            'link': competion['link'],
        });
    });

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

    console.log(finalArray);

    fillTable(finalArray);
}

// add a row to the table
function addRow(rowData) {
    var table = document.getElementById("eventTable");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = rowData['type'];
    row.insertCell(1).innerHTML = rowData['date'];
    row.insertCell(2).innerHTML = rowData['time'];
    row.insertCell(3).innerHTML = rowData['description'];
    row.insertCell(4).innerHTML = '<a target="_blank" href=' + rowData['link'] + '>' + rowData['link_text'] + '</a>';
    row.insertCell(5).innerHTML = '<button type="button" onclick="">Additional Info</button>'
}

// loop and add all the data
function fillTable(tableData) {
    tableData.forEach((tableRow) => {
        addRow(tableRow);
    });
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
        success: function (data) { processData(data); }
    });
});