//Uses SPservices to query lists based on the view
function getListData(lists, view) {
  var viewType = view;
  $(document).ready(function() {
    //Event listener to show/hide table columns with text over 60 characters
    $("#table-container").on("click", ".tableLongTextColumn", function() {
      var id = $(this).data("id");
      toggleColumnText(id);
      toggleColumnText(id + "ellipsis");
    });
    createTabs(lastDigitURL);

    // Use code for easy way to view list data during development
    //     var traineePromise = $().SPServices.SPGetListItemsJson({
    //       webURL: "[insert URL]",
    //       listName: "[insert list Name]",
    //       // viewName: "{298DE02C-4291-8475-DE73-1B5ESE25450B}",
    //       CAMLQuery: "<Query><Where><Eq><FieldRef Name='Group_x0020_Assignment' /><Value Type='Text'><![CDATA[" + group + "]]></Value></Eq></Where></Query>"
    //     });

    //     $.when(traineePromise).done(function() {
    //       thisTraineeUser = this.data;
    //       console.log(thisTraineeUser);
    //     });

    //Gets list data in JSON for FIN Obs, IT Obs, NFR and CAP SharePoint lists
    var queryLists = lists.forEach(function(option) {
      var obj = $().SPServices.SPGetListItemsJson({
        webURL: "[insert URL]",
        listName: option.listName,
        viewName: option.viewName,
        CAMLQuery: option.queryFilter,
        CAMLQueryOptions:
          "<QueryOptions><ExpandUserField>True</ExpandUserField></QueryOptions>"
      });
      var listName = option.listName;
      var adminOrGroup = option.adminOrGroup;
      $.when(obj).done(function() {
        var tempItem = {
          list: listName,
          data: this.data,
          filter: adminOrGroup
        };
        // Switch statement sets off unique functions for each table
        // If statement checks if Admin tables should be created from each list or tables only showing filtered list data
        switch (tempItem.list) {
          case lists[0].listName:
            if (tempItem.filter == "Admin Support") {
              finItem = this.data;
              createTableFINobs(finItem);
            } else {
              finItem = this.data;
              createGroupTableFINobs(finItem);
            }
            break;
          case lists[1].listName:
            if (tempItem.filter == "Admin Support") {
              itItem = this.data;
              createTableITobs(itItem);
            } else {
              itItem = this.data;
              createGroupTableITobs(itItem);
            }
            break;
          case lists[2].listName:
            if (tempItem.filter == "Admin Support") {
              nfrItem = this.data;
              createTableNFR(nfrItem);
            } else {
              nfrItem = this.data;
              createGroupTableNFR(nfrItem);
            }
            break;
          case lists[3].listName:
            if (tempItem.filter == "Admin Support") {
              capItem = this.data;
              createTableCAP(capItem);
            } else {
              capItem = this.data;
              createGroupTableCAP(capItem);
            }
            break;
          default:
            alert("Please, Refresh the Page.");
        }
      });
    });
  });
}

//Sends specific nfr info to sessionStorage for populating new CAP
function saveLocSessionNFR(index) {
  sessionStorage.setItem("titleNFR" + index, nfrItem[index].Title);
  sessionStorage.setItem(
    "titleValueNFR" + index,
    nfrItem[index].UniqueId["lookupId"]
  );
  sessionStorage.setItem(
    "spwStakeholderNFR" + index,
    nfrItem[index].SPW_x0020_Stakeholder
  );
  sessionStorage.setItem(
    "finOrItNFR" + index,
    nfrItem[index].Financial_x002F_IT
  );
  sessionStorage.setItem(
    "busProcessNFR" + index,
    nfrItem[index].Business_x0020_Process
  );
  sessionStorage.setItem("systemNFR" + index, nfrItem[index].System);
  sessionStorage.setItem("subjectNFR" + index, nfrItem[index].Subject);
  sessionStorage.setItem("backgroundNFR" + index, nfrItem[index].background);
  sessionStorage.setItem("conditionNFR" + index, nfrItem[index].Condition);
  sessionStorage.setItem("criteriaNFR" + index, nfrItem[index].Criteria);
  sessionStorage.setItem("causeNFR" + index, nfrItem[index].Cause);
  sessionStorage.setItem("effectNFR" + index, nfrItem[index].Effect);
  sessionStorage.setItem(
    "recommendationNFR" + index,
    nfrItem[index].Recommendation
  );
}

//Creates HTML NFR table from array of nested objects for Admin table
//Admin table view has more columns with workflow and internal comments
var nfrDataTable;
function createTableNFR(list) {
  // Creates an array with every row of data
  var nfrTable = [];
  list.map(function(part, i) {
    var title =
      "<a id='nfrID" +
      i +
      "' style='color:#438ac2' href='../_layouts/15/listform.aspx?PageType=4&ListId=%7B67B09481%2DF377%2D40A6%2DA5D5%2D666F12029821%7D&ID=" +
      list[i].UniqueId["lookupId"] +
      "&Source=https%3A%2F%2Finfo%2Ehealth%2Emil%2Fbus%2Ffi%2Fnfr%2FPages%2Ftracker%2Easpx?" +
      i +
      "' onclick='saveLocSessionNFR(" +
      i +
      ");'>" +
      list[i].Title +
      "</a>";
    // Creates an array with the selected columns from the JSON
    var tableArr = [
      title,
      list[i].FY,
      list[i].NewRepeat,
      list[i].SPW_x0020_Stakeholder,
      list[i].Financial_x002F_IT,
      list[i].Business_x0020_Process,
      list[i].System,
      shortenText(list[i].background, i + "nfrBackgroundID"),
      list[i].NFR_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      addSpaceGroup(list[i].Group_x0020_Assignment),
      list[i].Current_x0020_Status,
      list[i].Level_x0020_of_x0020_Response,
      shortenText(list[i].Subject, i + "nfrSubjectID"),
      shortenText(list[i].Condition, i + "nfrConditionID"),
      shortenText(list[i].Criteria, i + "nfrCriteriaID"),
      shortenText(list[i].Cause, i + "nfrCauseID"),
      shortenText(list[i].Effect, i + "nfrEffectID"),
      shortenText(list[i].Recommendation, i + "nfrRecommendationID"),
      dateFormat(list[i].Date_x0020_Received),
      dateFormat(list[i].DateCommDueAuditor),
      dateFormat(list[i].DateCommDueSPW),
      dateFormat(list[i].DateCommSubAuditor),
      dateFormat(list[i].DateSigDueSPW),
      dateFormat(list[i].DateSigned),
      shortenText(list[i].CommentsSubmitted, i + "nfrCommentsID"),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor),
      findNestedValue(list[i].FINobservation, 0),
      findNestedValue(list[i].ITobservation, 1),
      findNestedValue(list[i].CAPnumber, 3),
      findPastNFR(list[i].pastNFR)
    ];

    var tableRow = tableArr.map(removeUndefined);
    nfrTable.push(tableRow);
  });
  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 11, and removes paging
  nfrDataTable = $("#nfrTable").DataTable({
    data: nfrTable,
    paging: false,
    order: [[11, "asc"]],
    columns: [
      { title: "NFR" },
      { title: "FY" },
      { title: "New/Repeat" },
      { title: "SPW Stakeholder" },
      { title: "Financial/IT" },
      { title: "Business Process" },
      { title: "System" },
      { title: "Background" },
      { title: "NFR Status" },
      { title: "Concur/Non-Concur" },
      { title: "Group Assignment" },
      { title: "Current Status" },
      { title: "Level of Response for CAP" },
      { title: "Subject" },
      { title: "Condition" },
      { title: "Criteria" },
      { title: "Cause" },
      { title: "Effect" },
      { title: "Recommendation" },
      { title: "Date Received" },
      { title: "Date Comments Due to Auditor" },
      { title: "Date Comments Due to SPW" },
      { title: "Date Comments Submitted to Author" },
      { title: "Date Signature Due to SPW" },
      { title: "Date Signature Due to Auditor" },
      { title: "Comments Submitted" },
      { title: "Last Updated" },
      { title: "Last Updated By" },
      { title: "FIN Observation" },
      { title: "IT Observation" },
      { title: "CAP" },
      { title: "Previous NFR" }
    ]
  });
}

//Creates HTML NFR table from array of nested objects for group table
//Group table contains limited number of columns
function createGroupTableNFR(list) {
  var nfrTable = [];
  list.map(function(part, i) {
    var title =
      "<a id='nfrID" +
      i +
      "' style='color:#438ac2' href='../_layouts/15/listform.aspx?PageType=4&ListId=%7B67B09481%2DF377%2D40A6%2DA5D5%2D666F12029821%7D&ID=" +
      list[i].UniqueId["lookupId"] +
      "&Source=https%3A%2F%2Finfo%2Ehealth%2Emil%2Fbus%2Ffi%2Fnfr%2FPages%2Ftracker%2Easpx?" +
      i +
      "' onclick='saveLocSessionNFR(" +
      i +
      ");'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].FY,
      list[i].SPW_x0020_Stakeholder,
      list[i].Financial_x002F_IT,
      list[i].Business_x0020_Process,
      list[i].System,
      shortenText(list[i].background, i + "nfrBackgroundID"),
      list[i].NFR_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      addSpaceGroup(list[i].Group_x0020_Assignment),
      list[i].Current_x0020_Status,
      dateFormat(list[i].DateCommDueSPW),
      dateFormat(list[i].DateSigDueSPW),
      shortenText(list[i].CommentsSubmitted, i + "nfrCommentsID"),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor),
      findNestedValue(list[i].FINobservation, 0),
      findNestedValue(list[i].ITobservation, 1),
      findNestedValue(list[i].CAPnumber, 3),
      findPastNFR(list[i].pastNFR)
    ];

    var tableRow = tableArr.map(removeUndefined);
    nfrTable.push(tableRow);
  });
  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 11, and removes paging
  nfrDataTable = $("#nfrTable").DataTable({
    data: nfrTable,
    paging: false,
    order: [[11, "asc"]],
    columns: [
      { title: "NFR" },
      { title: "FY" },
      { title: "SPW Stakeholder" },
      { title: "Financial/IT" },
      { title: "Business Process" },
      { title: "System" },
      { title: "Background" },
      { title: "NFR Status" },
      { title: "Concur/Non-Concur" },
      { title: "Group Assignment" },
      { title: "Current Status" },
      { title: "Date Comments Due to SPW" },
      { title: "Date Signature Due to SPW" },
      { title: "Comments Submitted" },
      { title: "Last Updated" },
      { title: "Last Updated By" },
      { title: "FIN Observation" },
      { title: "IT Observation" },
      { title: "CAP" },
      { title: "Previous NFR" }
    ]
  });
}

// Creates HTML FIN Observation table from array of nested objects for Admin table
//Admin table view has more columns with workflow and internal comments
var finObsDataTable;
function createTableFINobs(list) {
  var finObsTable = [];

  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/FINobservation/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x010030BED14E2318BB4CB0DD307EA8AAEF4F'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].Group_x0020_Assignment,
      shortenText(list[i].Observation),
      list[i].Business_x0020_Process,
      list[i].SPW_x0020_Stakeholder,
      findEmailValue(list[i].SPWtlePOC),
      findEmailValue(list[i].SPWpoc),
      list[i].KearneyPOC,
      dateFormat(list[i].DateRecd),
      list[i].Observation_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      list[i].NFR_x0020_Status,
      shortenText(list[i].KearneyNotes, i + "finKearneyNotesID"),
      shortenText(list[i].SPWnotes, i + "finSPWNotesID"),
      list[i].DateClosed,
      findNestedValue(list[i].NFRNumber, 2),
      findNestedValue(list[i].CAPnumber, 3),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor)
    ];

    var tableRow = tableArr.map(removeUndefined);
    finObsTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 9, and removes paging
  finObsDataTable = $("#finObsTable").DataTable({
    data: finObsTable,
    paging: false,
    order: [[9, "asc"]],
    columns: [
      { title: "FIN Observation" },
      { title: "Group Assignment" },
      { title: "Observation" },
      { title: "Business Process" },
      { title: "SPW Stakeholder" },
      { title: "DHA/SMA POC" },
      { title: "SPW POC" },
      { title: "Kearney POC" },
      { title: "Date Rec'd" },
      { title: "Observation Status" },
      { title: "Concur/Non-Concur" },
      { title: "NFR Status" },
      { title: "Kearney Notes" },
      { title: "SPW Notes/Comments for Kearney" },
      { title: "Date Closed" },
      { title: "NFR" },
      { title: "CAP" },
      { title: "Last Updated" },
      { title: "Last Updated By" }
    ]
  });
}

// Creates HTML FIN Observation table from array of nested objects for groupss
// Groups see less table columns
var finObsDataTable;
function createGroupTableFINobs(list) {
  var finObsTable = [];

  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/FINobservation/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x010030BED14E2318BB4CB0DD307EA8AAEF4F'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].Group_x0020_Assignment,
      list[i].Observation,
      list[i].Business_x0020_Process,
      list[i].SPW_x0020_Stakeholder,
      findEmailValue(list[i].SPWtlePOC),
      findEmailValue(list[i].SPWpoc),
      list[i].KearneyPOC,
      dateFormat(list[i].DateRecd),
      list[i].Observation_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      list[i].NFR_x0020_Status,
      shortenText(list[i].KearneyNotes, i + "finKearneyNotesID"),
      shortenText(list[i].SPWnotes, i + "finSPWNotesID"),
      list[i].DateClosed,
      findNestedValue(list[i].NFRNumber, 2),
      findNestedValue(list[i].CAPnumber, 3),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor)
    ];

    var tableRow = tableArr.map(removeUndefined);
    finObsTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 9, and removes paging
  finObsDataTable = $("#finObsTable").DataTable({
    data: finObsTable,
    paging: false,
    order: [[9, "asc"]],
    columns: [
      { title: "FIN Observation" },
      { title: "Group Assignment" },
      { title: "Observation" },
      { title: "Business Process" },
      { title: "SPW Stakeholder" },
      { title: "DHA/SMA POC" },
      { title: "SPW POC" },
      { title: "Kearney POC" },
      { title: "Date Rec'd" },
      { title: "Observation Status" },
      { title: "Concur/Non-Concur" },
      { title: "NFR Status" },
      { title: "Kearney Notes" },
      { title: "SPW Notes/Comments for Kearney" },
      { title: "Date Closed" },
      { title: "NFR" },
      { title: "CAP" },
      { title: "Last Updated" },
      { title: "Last Updated By" }
    ]
  });
}

// Creates HTML IT Observation table from array of nested objects for Admin table
//Admin table view has more columns with workflow and internal comments
var itObsDataTable;
function createTableITobs(list) {
  var itObsTable = [];
  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/ITobservation/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x01003D881E528CD65B42A0B8F3707895A9B8'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].Group_x0020_Assignment,
      shortenText(list[i].Observation, i + "itObservationID"),
      list[i].Criteria,
      // shortenText(list[i].Criteria, i + "itCriteriaID"),
      list[i].System,
      findEmailValue(list[i].SPWtlePOC),
      findEmailValue(list[i].SPWpoc),
      list[i].KearneyPOC,
      list[i].PBC,
      dateFormat(list[i].DateRecd),
      list[i].Observation_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      dateFormat(list[i].DateClosed),
      list[i].NFR_x0020_Status,
      shortenText(list[i].KearneyNotes, i + "itKearneyNotesID"),
      shortenText(list[i].SPWnotes, i + "itSPWNotesID"),
      list[i].SPW_x0020_Stakeholder,
      findNestedValue(list[i].NFRNumber, 2),
      findNestedValue(list[i].CAPnumber, 3),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor)
    ];

    var tableRow = tableArr.map(removeUndefined);
    itObsTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 10, and removes paging
  itObsDataTable = $("#itObsTable").DataTable({
    data: itObsTable,
    paging: false,
    order: [[10, "asc"]],
    columns: [
      { title: "IT Observation" },
      { title: "Group Assignment" },
      { title: "Observation" },
      { title: "Criteria" },
      { title: "System" },
      { title: "DHA/SMA POC" },
      { title: "SPW POC" },
      { title: "Kearney POC" },
      { title: "PBC" },
      { title: "Date Rec'd" },
      { title: "Observation Status" },
      { title: "Concur/Non-Concur" },
      { title: "Date Closed" },
      { title: "NFR Status" },
      { title: "Kearney Notes" },
      { title: "SPW Notes/Comments for Kearney" },
      { title: "SPW Stakeholder" },
      { title: "NFR" },
      { title: "CAP" },
      { title: "Last Updated" },
      { title: "Last Updated By" }
    ]
  });
}

// Creates HTML IT Observation table from array of nested objects for Group table
var itObsDataTable;
function createGroupTableITobs(list) {
  var itObsTable = [];
  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/ITobservation/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x01003D881E528CD65B42A0B8F3707895A9B8'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].Group_x0020_Assignment,
      shortenText(list[i].Observation, i + "itObservationID"),
      list[i].Criteria,
      list[i].System,
      findEmailValue(list[i].SPWtlePOC),
      findEmailValue(list[i].SPWpoc),
      list[i].KearneyPOC,
      list[i].PBC,
      dateFormat(list[i].DateRecd),
      list[i].Observation_x0020_Status,
      list[i].Concur_x002F_Non_x002d_Concur,
      dateFormat(list[i].DateClosed),
      list[i].NFR_x0020_Status,
      shortenText(list[i].KearneyNotes, i + "itKearneyNotesID"),
      shortenText(list[i].SPWnotes, i + "itSPWNotesID"),
      list[i].SPW_x0020_Stakeholder,
      findNestedValue(list[i].NFRNumber, 2),
      findNestedValue(list[i].CAPnumber, 3),
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor)
    ];

    var tableRow = tableArr.map(removeUndefined);
    itObsTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 10, and removes paging
  itObsDataTable = $("#itObsTable").DataTable({
    data: itObsTable,
    paging: false,
    order: [[10, "asc"]],
    columns: [
      { title: "IT Observation" },
      { title: "Group Assignment" },
      { title: "Observation" },
      { title: "Criteria" },
      { title: "System" },
      { title: "DHA/SMA POC" },
      { title: "SPW POC" },
      { title: "Kearney POC" },
      { title: "PBC" },
      { title: "Date Rec'd" },
      { title: "Observation Status" },
      { title: "Concur/Non-Concur" },
      { title: "Date Closed" },
      { title: "NFR Status" },
      { title: "Kearney Notes" },
      { title: "SPW Notes/Comments for Kearney" },
      { title: "SPW Stakeholder" },
      { title: "NFR" },
      { title: "CAP" },
      { title: "Last Updated" },
      { title: "Last Updated By" }
    ]
  });
}

function saveLocSession(num) {
  sessionStorage.setItem("capValue", num);
}

//Creates HTML CAP table from array of nested objects for Admin table
//Admin table view has more columns with workflow and internal comments
var capDataTable;
function createTableCAP(list) {
  var capTable = [];
  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/cap/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x01004107FF5BA79F4742B2F19D2CE27AE2A1' onclick='saveLocSession(" +
      list[i].UniqueId["lookupId"] +
      ");'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].FY,
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor),
      list[i].Level_x0020_of_x0020_Response,
      list[i].SPW_x0020_Stakeholder,
      list[i].Group_x0020_Assignment,
      list[i].Financial_x002F_IT,
      list[i].Business_x0020_Process,
      list[i].System,
      list[i].Priority_x0020_Rating,
      list[i].SPWLikelihoodOfDef,
      list[i].SPWMagnitudeOfDef,
      list[i].groupPriorityRating,
      list[i].groupLikelihoodOfDef,
      list[i].groupMagnitudeOfDef,
      list[i].CAP_x0020_Status,
      findNestedSingleValue(list[i].NFRNumber, 2),
      shortenText(list[i].NFR_x0020_Subject, i + "capSubjectID"),
      shortenText(list[i].Background, i + "capBackgroundID"),
      shortenText(list[i].Condition, i + "capConditionID"),
      shortenText(list[i].Cause, i + "capCauseID"),
      shortenText(list[i].Effect, i + "capEffectID"),
      shortenText(list[i].Criteria, i + "capCriteriaID"),
      shortenText(list[i].Recommendation, i + "capRecommendationID"),
      modifyPercentComplete(list[i].Percent_x0020_Complete),
      list[i].groupApproval,
      list[i].businessProcessApproval,
      list[i].SPWApproval
    ];
    var tableRow = tableArr.map(removeUndefined);
    capTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 14, and removes paging
  capDataTable = $("#capTable").DataTable({
    data: capTable,
    paging: false,
    order: [[14, "asc"]],
    columns: [
      { title: "CAP" },
      { title: "FY" },
      { title: "Last Updated" },
      { title: "Last Updated By" },
      { title: "Level of Response" },
      { title: "SPW Stakeholder" },
      { title: "CAP Development Owner" },
      { title: "Financial/IT" },
      { title: "Business Process" },
      { title: "System" },
      { title: "SPW Priority Rating" },
      { title: "SPW Likelihood of Deficiency" },
      { title: "SPW Magnitude of Deficiency" },
      { title: "Group Priority Rating" },
      { title: "Group Likelihood of Deficiency" },
      { title: "Group Magnitude of Deficiency" },
      { title: "Status" },
      { title: "NFR" },
      { title: "NFR Subject" },
      { title: "Background" },
      { title: "Condition" },
      { title: "Cause" },
      { title: "Effect" },
      { title: "Criteria (Regulatory Guidance)" },
      { title: "Recommendation" },
      { title: "Perercent Complete" },
      { title: "Group Approval" },
      { title: "Business Process Approval" },
      { title: "SPW Approval" }
    ]
  });
}

//Creates HTML CAP table from array of nested objects for Group Table
var capDataTable;
function createGroupTableCAP(list) {
  var capTable = [];
  list.map(function(part, i) {
    var title =
      "<a style='color:#438ac2' href='../Lists/cap/DispForm.aspx?ID=" +
      list[i].UniqueId["lookupId"] +
      "&ContentTypeID=0x01004107FF5BA79F4742B2F19D2CE27AE2A1' onclick='saveLocSession(" +
      list[i].UniqueId["lookupId"] +
      ");'>" +
      list[i].Title +
      "</a>";

    var tableArr = [
      title,
      list[i].FY,
      dateModified(list[i].Modified),
      changeEditorValue(list[i].Editor),
      list[i].Level_x0020_of_x0020_Response,
      list[i].SPW_x0020_Stakeholder,
      list[i].Group_x0020_Assignment,
      list[i].Financial_x002F_IT,
      list[i].Business_x0020_Process,
      list[i].System,
      list[i].Priority_x0020_Rating,
      list[i].SPWLikelihoodOfDef,
      list[i].SPWMagnitudeOfDef,
      list[i].groupPriorityRating,
      list[i].groupLikelihoodOfDef,
      list[i].groupMagnitudeOfDef,
      list[i].CAP_x0020_Status,
      findNestedSingleValue(list[i].NFRNumber, 2),
      shortenText(list[i].NFR_x0020_Subject, i + "capSubjectID"),
      shortenText(list[i].Background, i + "capBackgroundID"),
      shortenText(list[i].Condition, i + "capConditionID"),
      shortenText(list[i].Cause, i + "capCauseID"),
      shortenText(list[i].Effect, i + "capEffectID"),
      shortenText(list[i].Criteria, i + "capCriteriaID"),
      shortenText(list[i].Recommendation, i + "capRecommendationID"),
      modifyPercentComplete(list[i].Percent_x0020_Complete),
      list[i].groupApproval,
      list[i].businessProcessApproval,
      list[i].SPWApproval
    ];
    var tableRow = tableArr.map(removeUndefined);
    capTable.push(tableRow);
  });

  //Applies datatables.js to the table, giving the table a header above each column,
  //ordering based on column 14, and removes paging
  capDataTable = $("#capTable").DataTable({
    data: capTable,
    paging: false,
    order: [[14, "asc"]],
    columns: [
      { title: "CAP" },
      { title: "FY" },
      { title: "Last Updated" },
      { title: "Last Updated By" },
      { title: "Level of Response" },
      { title: "SPW Stakeholder" },
      { title: "CAP Development Owner" },
      { title: "Financial/IT" },
      { title: "Business Process" },
      { title: "System" },
      { title: "SPW Priority Rating" },
      { title: "SPW Likelihood of Deficiency" },
      { title: "SPW Magnitude of Deficiency" },
      { title: "Group Priority Rating" },
      { title: "Group Likelihood of Deficiency" },
      { title: "Group Magnitude of Deficiency" },
      { title: "Status" },
      { title: "NFR" },
      { title: "NFR Subject" },
      { title: "Background" },
      { title: "Condition" },
      { title: "Cause" },
      { title: "Effect" },
      { title: "Criteria (Regulatory Guidance)" },
      { title: "Recommendation" },
      { title: "Percent Complete" },
      { title: "Group Approval" },
      { title: "Business Process Approval" },
      { title: "SPW Approval" }
    ]
  });
}
