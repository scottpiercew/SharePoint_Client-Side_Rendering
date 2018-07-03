//Creates an object from the values of the four parameters past in
function listViewQuery(listName, viewName, queryFilter, adminOrComponent) {
  this.listName = listName;
  this.viewName = viewName;
  this.queryFilter = queryFilter;
  this.adminOrComponent = adminOrComponent;
}

//Creates a CAMLQuery to filter a list by the "Group Assignment" field by comparing it to the groupAssignments array
//"Admin Support" returns every row for Admin
//"SPW Enterprise" returns rows with anyone of the seven groupAssignments in this group
function createGroupQuery(component) {
  if (component == "Admin Support") {
    return "";
  } else if (component == "SPW Enterprise") {
    return (
      "<Query><Where><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[3] +
      "]]></Value></Contains><Or><Contains> <FieldRef Name='Component_x0020_Assignment'/> <Value Type='Text'><![CDATA[" +
      groupAssignments[4] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[5] +
      "]]></Value></Contains></Or></Or><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[6] +
      "]]></Value></Contains><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[7] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[8] +
      "]]></Value></Contains></Or></Or><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[15] +
      "]]></Value></Contains><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[9] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[10] +
      "]]></Value></Contains></Or></Or></Where></Query>"
    );
  } else {
    return (
      "<Query><Where><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[14] +
      "]]></Value></Contains><Or><Contains> <FieldRef Name='Component_x0020_Assignment'/> <Value Type='Text'><![CDATA[" +
      groupAssignments[13] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[12] +
      "]]></Value></Contains></Or></Or><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[11] +
      "]]></Value></Contains><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[10] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[2] +
      "]]></Value></Contains></Or></Or><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[3] +
      "]]></Value></Contains><Or><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[4] +
      "]]></Value></Contains><Contains><FieldRef Name='Component_x0020_Assignment'/><Value Type='Text'><![CDATA[" +
      groupAssignments[5] +
      "]]></Value></Contains></Or></Or></Where></Query>"
    );
  }
}
//Creates an array of objects, with each object containing: List Title, View GUID(name), and query code for component
//The returned list is iterated over, SPServices pulls the list data and returns data in JSON
function createArrObjAll(view, group) {
  var fin = new listViewQuery(
    allTables[0].listName,
    allTables[0].viewName[view],
    createGroupQuery(group),
    group
  );
  var it = new listViewQuery(
    allTables[1].listName,
    allTables[1].viewName[view],
    createGroupQuery(group),
    group
  );
  var nfr = new listViewQuery(
    allTables[2].listName,
    allTables[2].viewName[view],
    createGroupQuery(group),
    group
  );
  var cap = new listViewQuery(
    allTables[3].listName,
    allTables[3].viewName[view],
    createGroupQuery(group),
    group
  );
  var lists = [fin, it, nfr, cap];
  return lists;
}

//Put tables into tabs
function createTabs(lastDigitURL) {
  $("#tabs").tabs({ active: lastDigitURL });
  $("#containerTable").show();
}

//Remove list items with value undefined
function removeUndefined(item) {
  if (item == undefined || null) {
    return (item = "<td>" + "" + "</td>");
  } else {
    return "<td>" + item + "</td>";
  }
}

//Toggle the visibility of text in table columns
function toggleColumnText(toggleId) {
  var text = document.getElementById(toggleId);
  if (text.style.display === "none") {
    text.style.display = "inline-block";
  } else {
    text.style.display = "none";
  }
}

//Change list items from Enhanced Rich Text to Text and truncate
function shortenText(item, id) {
  if (item == undefined || null || "") {
    return "";
  } else {
    var stringItem = $(item).text();
    if (stringItem.length > 60) {
      // var fieldId = id.toString();
      var arrText = stringItem.match(/(.*?\s){8}/g);
      if (arrText != null) {
        var firstLine = arrText.splice(0, 1).join("");
        return (
          "<div class='tableLongTextColumn' data-id='" +
          id +
          "' style='cursor:s-resize'><span>" +
          firstLine.substring(0, firstLine.length - 1) +
          "<span style='display:inline-block' id='" +
          id +
          "ellipsis'>...</span></span><span style='display:none' id='" +
          id +
          "'>" +
          arrText.join("") +
          "</span></div>"
        );
      } else {
        return "<p>" + stringItem + "</p>";
      }
    } else {
      return "<p>" + stringItem + "</p>";
    }
  }
}

//Create a space between assigned Groups
function addSpaceGroup(item) {
  if (item == undefined || null) {
    return "";
  } else {
    return item.join(", ");
  }
}

//Get only the previous nfr lookup value
function findPastNFR(item) {
  if (item != undefined) {
    return (
      "<a style='color:#438ac2' href='../_layouts/15/listform.aspx?PageType=4&ListId=%7B67B09481%2DF377%2D40A6%2DA5D5%2D666F12029821%7D&ID=" +
      item.lookupId +
      "&Source=https[insert URL].aspx" +
      "&S=993284'>" +
      item.lookupValue +
      "</a>"
    );
  } else {
    return "";
  }
}

//Change multiselect lookup column to link to related tab and filter based on results
function findNestedValue(item, num) {
  var arr = [];
  if (item != undefined) {
    item.forEach(function(element) {
      arr.push(element.lookupValue);
    });
  } else {
    arr.push("");
  }
  var linkedItem =
    "<a onclick='return moveTab(this)' name='" +
    arr.join("|") +
    "' title='" +
    num +
    "' style='color:#438ac2; border:none'>" +
    arr.join(", ") +
    "</a>";
  return linkedItem;
}

//Change single lookup column to link to related tab and filter based on results
function findNestedSingleValue(item, num) {
  if (item != undefined) {
    var linkedItem =
      "<a onclick='return moveTab(this)' name='" +
      item["lookupValue"] +
      "' title='" +
      num +
      "' style='color:#438ac2; border:none'>" +
      item["lookupValue"] +
      "</a>";
    return linkedItem;
  }
}

//Change tab and set filter parameters based on user selection
function moveTab(name) {
  $("#tabs").tabs({ active: name.title });
  switch (parseInt(name.title)) {
    case 0:
      var table = finObsDataTable;
      break;
    case 1:
      var table = itObsDataTable;
      break;
    case 2:
      var table = nfrDataTable;
      break;
    case 3:
      var table = capDataTable;
      break;
    default:
      alert("Please, Refresh the Page.");
  }
  table
    .column(0)
    .search(name.name, true, false, false)
    .draw();
  return false;
}

//Set the table filter parameters back to blank
function clearFilter(table) {
  switch (parseInt(table.name)) {
    case 0:
      var table = finObsDataTable;
      break;
    case 1:
      var table = itObsDataTable;
      break;
    case 2:
      var table = nfrDataTable;
      break;
    case 3:
      var table = capDataTable;
      break;
    default:
      alert("Please, Refresh the Page.");
  }
  table
    .column(0)
    .search("", true, false, false)
    .draw();
}

//Change people/group SharePoint column to name and email with mailto link
function findEmailValue(item) {
  var arr = [];
  if (item != undefined || null) {
    item.forEach(function(element) {
      var name = element.userName;
      var arrName = name.split(".");
      var fullName = arrName[1] + " " + arrName[0];
      arr.push(
        "<p style='margin-bottom:1px'>" +
          fullName +
          "</p><a style='color:#438ac2' href=mailto:" +
          element.email +
          ">" +
          element.email +
          "</a>"
      );
    });
  } else {
    arr.push("");
  }
  return arr.join(", ");
}

//Change editor (Last Updated By) colum to a name and mailto link
function changeEditorValue(item) {
  var name = item.userName;
  var arrName = name.split(".");
  if (arrName[1] == undefined) {
    var fullName = arrName[0];
    return (
      "<p style='margin-bottom:1px'>" +
      fullName +
      "</p><a style='color:#438ac2' href=mailto:" +
      item.email +
      ">" +
      item.email +
      "</a>"
    );
  } else {
    var fullName = arrName[1] + " " + arrName[0];
    return (
      "<p style='margin-bottom:1px'>" +
      fullName +
      "</p><a style='color:#438ac2' href=mailto:" +
      item.email +
      ">" +
      item.email +
      "</a>"
    );
  }
}

//Change date from (Tue Apr 17 2018 00:00:00 GMT-0400 (EDT)) to (Tue Apr 17 2018)
function dateFormat(item) {
  if (item != undefined) {
    var date = String(item);
    return date.slice(0, 15);
  } else {
    return "";
  }
}

//Changes date but keeps hour:min:sec
function dateModified(item) {
  if (item != undefined) {
    var date = String(item);
    return date.slice(0, 24);
  } else {
    return "";
  }
}

//Modify the Sharepoint given decimal to a percentage (0.25 to 25%)
function modifyPercentComplete(number) {
  if (number != undefined) {
    var percent = number * 100 + "%";
    return percent;
  } else {
    return "";
  }
}

//Establishes document set library number and puts it in new form
function getDocSetNum() {
  var docSetName = Date.now().toString();
  $("input[title='DocSet Required Field']").val(docSetName);
}

//Creates document set (needs refactoring)
function createDocSet(_siteUrl, _docSetLibrary, _docSetName) {
  var clientContext = new SP.ClientContext(_siteUrl);
  var item = null;
  var oList = clientContext
    .get_web()
    .get_lists()
    .getByTitle(_docSetLibrary);
  clientContext.load(oList);
  var itemCreateInfo = new SP.ListItemCreationInformation();
  itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
  itemCreateInfo.set_leafName(_docSetName);
  item = oList.addItem(itemCreateInfo);
  item.set_item("ContentTypeId", "0x0120D520");
  item.set_item("Title", _docSetName);
  item.update();
  clientContext.load(item);
  clientContext.executeQueryAsync(
    function() {
      return true;
    },
    function(sender, args) {
      console.log("Doh... " + args.get_message());
    }
  );
}

//Set the header text on the Tracker Page based on group
function changeHeaderText(groupName) {
  document.getElementById("groupNameHeader").innerHTML = groupName;
}

//OnClick function from Tracker to create new FIN Observation form
function newFINobs() {
  return (location.href =
    "https://[insertURL]/Lists/FINobservation/NewForm.aspx?" +
    "Source=https%3A%2F%2[insertURL]aspx" +
    "&RootFolder=");
}
//OnClick function from Tracker to create new IT Observation form
function newITobs() {
  return (location.href =
    "https://[insertURL]/Lists/ITobservation/NewForm.aspx?" +
    "Source=https%3A%2F%2[insertURL]aspx" +
    "&RootFolder=");
}
//OnClick function from Tracker to create new NFR form
function newNFR() {
  return (location.href =
    "https://[insertURL]/Lists/nfr/NewForm.aspx?" +
    "Source=https%3A%2F%2[insertURL]aspx" +
    "&RootFolder=");
}
//OnClick function from Tracker to create new CAP form
function newCAP() {
  return (location.href =
    "https://[insertURL]/Lists/cap/NewForm.aspx?" +
    "Source=https%3A%2F%2[insertURL]aspx" +
    "&RootFolder=");
}
//OnClick function from NFR Item to create new CAP form
function createRelatedNewCAP() {
  var lastNumURL = window.location.href.split("3F").slice(-1)[0];
  return (location.href =
    "https://[insertURL]/Lists/cap/NewForm.aspx?" +
    "Source=https%3A%2F%2[insertURL]aspx" +
    "&RootFolder=?" +
    lastNumURL);
}

//Set new form LookUp field value, taken from Hillbilly Solutions
//http://www.markrackley.net/2016/09/16/set-lookup-fields-in-edit-forms-for-large-lists-in-sharepoint/
function setLookup(fieldTitle, lookupVal) {
  //Set default value for lookups with less that 20 items
  if ($("select[title='" + fieldTitle + "']").html() !== null) {
    $("select[title='" + fieldTitle + "']").val(lookupVal);
  } else {
    choices = $("input[title='" + fieldTitle + "']").attr("choices");
    hiddenInput = $("input[title='" + fieldTitle + "']").attr("optHid");
    $("input[id='" + hiddenInput + "']").attr("value", lookupVal);

    choiceArray = choices.split("|");
    for (index = 1; index < choiceArray.length; index = index + 2) {
      if (choiceArray[index] == lookupVal) {
        $("input[title='" + fieldTitle + "']").val(choiceArray[index - 1]);
      }
    }
  }
}

//Set new form Enhanced Rich Text field
function setEnhancedRichText(fieldName, newValue) {
  if (newValue != "undefined") {
    $("td.ms-formbody").each(function(i, item) {
      item = $(item);
      if (item.html().indexOf('FieldName="' + fieldName + '"') > -1) {
        item.find("div[contenteditable='true']").html(newValue);
        return false;
      }
    });
  }
}

//Set new form Choice Multiselect field
function setChoiceMulti(fieldName, newValue) {
  if (newValue != "undefined" || null) {
    var arrValues = newValue.split(",");
    arrValues.forEach(function(value) {
      $("td.ms-formbody").each(function(i, item) {
        item = $(item);
        if (item.html().indexOf('FieldName="' + fieldName + '"') > -1) {
          item
            .find('span[title="' + value + '"]')
            .find('input[type="checkbox"]')
            .prop("checked", true);
          return false;
        }
      });
    });
  }
}

//Set new form Lookup Choice Multiselect field (single value only)
function setLookupChoiceMulti(fieldName, newValue) {
  if (newValue != "undefined") {
    $("select[title='" + fieldName + " possible values']")
      .find('option[value="' + newValue + '"]')
      .remove()
      .appendTo($("select[title='" + fieldName + " selected values']"));
    return false;
  }
}

//Get sessionStorage and set new CAP form field values
function getSessionStorageCAP(index) {
  var titleNFR = sessionStorage.getItem("titleNFR" + index);
  var titleValueNFR = sessionStorage.getItem("titleValueNFR" + index);
  var spwStakeholderNFR = sessionStorage.getItem("spwStakeholderNFR" + index);
  var finOrItNFR = sessionStorage.getItem("finOrItNFR" + index);
  var busProcessNFR = sessionStorage.getItem("busProcessNFR" + index);
  var systemNFR = sessionStorage.getItem("systemNFR" + index);
  var subjectNFR = sessionStorage.getItem("subjectNFR" + index);
  var backgroundNFR = sessionStorage.getItem("backgroundNFR" + index);
  var conditionNFR = sessionStorage.getItem("conditionNFR" + index);
  var criteriaNFR = sessionStorage.getItem("criteriaNFR" + index);
  var causeNFR = sessionStorage.getItem("causeNFR" + index);
  var effectNFR = sessionStorage.getItem("effectNFR" + index);
  var recommendationNFR = sessionStorage.getItem("recommendationNFR" + index);

  setLookup("NFR #", titleValueNFR);
  setLookup("SPW Stakeholder", spwStakeholderNFR);
  setLookup("Financial/IT", finOrItNFR);
  setLookup("Business Process", busProcessNFR);
  setEnhancedRichText("System", systemNFR);
  setEnhancedRichText("NFR Subject", subjectNFR);
  setEnhancedRichText("Background", backgroundNFR);
  setEnhancedRichText("Condition", conditionNFR);
  setEnhancedRichText("Criteria (Regulatory Guidance)", criteriaNFR);
  setEnhancedRichText("Cause", causeNFR);
  setEnhancedRichText("Effect", effectNFR);
  setEnhancedRichText("Recommendation", recommendationNFR);
}
