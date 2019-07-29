//CTRCA:PLANNING/// 

var cap = aa.cap.getCap(capId).getOutput();
var CapTypeResult = cap.getCapType();
var frACA = cap.isCreatedByACA();
var resArr = CapTypeResult.toString().split("/");

for (x in resArr) {
    aa.print(resArr[x]);
    if (x == 2) {
        //var type3 = resArr[x];
        var type3 = resArr[x].substr(0, 1);
    }
    if (x == 3) {
        var type4 = resArr[x];
        //var type4 = resArr[x].substr(0, 5);
    }
}
var capResult = aa.cap.getCap(capId).getOutput().getCapModel();
capResult.setSpecialText(type3 + " " + type4 + " On-line Permit");
aa.cap.editCapByPK(capResult);
editAppSpecific("On-Line Permit?", "Yes");

arrInspRecord = new Array();
oInspList = aa.inspection.getInspectionListForSchedule(capId.getID1(), capId.getID2(), capId.getID3());
if (oInspList.getSuccess()) {
    inspectionTypes = oInspList.getOutput();
}
for (type in inspectionTypes) {
    //replaced branch(ASA:AddInspectionToASITable:LOOP)
    addInspectionsToASITable();
}

seaTurtle();



var capPeopleArr = null;
var peopCon = aa.people.getCapContactByCapID(capId);
if (peopCon.getSuccess()) {
    capPeopleArr = peopCon.getOutput();
}
if (capPeopleArr.length == 0) {
    aa.print("There are no contacts associated with this record.");
}

var primFlag = 0;
var pCon = "";


if (capPeopleArr != null || capPeopleArr.length > 0) {
    for (i in capPeopleArr) {
        var capContactScriptModel = capPeopleArr[i];
        var capContactModel = capContactScriptModel.getCapContactModel();
        var peopleModel = capContactScriptModel.getPeople();

        var thisPeop = capPeopleArr[i];
        var allPeopData = thisPeop.getPeople();
        var firstName1 = peopleModel.getFirstName();
        var pEml = peopleModel.getEmail();
        var bizName = peopleModel.getBusinessName();
        var cType = peopleModel.getContactType();
        var isPrim = peopleModel.getFlag();
        var conNo = peopleModel.getContactSeqNumber();
        if (isPrim == 'Y') {
            primFlag++;
            var fPcon = conNo;
        } else {
            if (i == 0) {
                pCon = conNo;
            }
        }
    }

    if (primFlag == 0) {
        var capContactResult = aa.people.getCapContactByPK(capId, pCon);
        if (capContactResult.getSuccess()) {
            var contact = capContactResult.getOutput();
            var peopleObj = contact.getCapContactModel().getPeople();
            peopleObj.setFlag("Y");
            contact.getCapContactModel().setPeople(peopleObj);
            var editResult = aa.people.editCapContact(contact.getCapContactModel());
            if (editResult.getSuccess()) {
                aa.print(pCon + " contact successfully set to Primary.");
            }
        } else {
            aa.print("No people contact loaded...");
        }
    } else {
        aa.print(primFlag + " Primary contact found: " + fPcon);
    }
}

