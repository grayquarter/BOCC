// CTRCA:BUILDING///

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


if (appMatch('Building/Construction/*/*')) {
    //replaced branch(SeaTurtle)
    seaTurtle();
    if (frACA == true) {
        if (getGISInfo('AGIS_CHARCO', 'DRI', 'NAME') == 'Sandhill') {
            var ahUser = "ShaoJ";
            var adHocTaskName = "Sandhill DRI Review";
            customAddAdHocTask(capIDString, ahUser, adHocTaskName);
        }
    }
}


if (!appMatch('Building/Land Development/*/*')) {

    var profArr = new Array();
    profArr = aa.licenseScript.getLicenseProf(capId);
    profArr = profArr.getOutput();

    aa.print("arr len=" + profArr.length);
    var pLicNo = "";
    if ((profArr != null && profArr.length > 0)) {
        for (x in profArr) {
            if (profArr[x].getPrintFlag() == 'Y') {
                pLicNo = profArr[x].getLicenseNbr();
            } else {
                aa.print(profArr[x].getLicenseNbr() + " is not set as a primary LP.")
            }
        }
    }
    aa.print("pLicNo:" + pLicNo);


    if (appMatch('Building/Trade Permits/*/Mechanical') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Water Heater') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Electrical') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Fire') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/Residential/Solar Water Heater') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Accessories/*/Solar Photovoltaic') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Plumbing') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Roofing') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Gas') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/*/Pool Heat Pump') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }

    if (appMatch('Building/Trade Permits/Residential/Pool Solar System') && (pLicNo.substr(0, 3) == 'CGC')) {
        addStdCondition('CC PERMIT', 'Subcontractor Worksheet');
    }
}

if (appMatch('Building/Construction/Residential/Single Family-Babcock') && frACA == true) {
    scheduleInspection('Babcock Final', 100, 'AMY.WICKS@KIMLEY-HORN.COM', null, 'scheduled via script');
}

if (appMatch('Building/Construction/Residential/Single Family-Babcock') && frACA == true) {
    scheduleInspection('Babcock-Landscape', 100, 'AMY.WICKS@KIMLEY-HORN.COM', null, 'scheduled via script');
}


if (proximity('AGIS_CHARCO', 'DRI', 1) && !appMatch('Building/POS/*/*')) {
    email('Kevin.Lapham@charlottecountyfl.gov', 'aca.DRI@AGIS-accela.com', 'ACA Application in DRI for ' + capId + ' / ' + capIDString, 'Application in DRI for ' + capId + ' / ' + capIDString);
    if (ckCapDRI(capIDString) == false) {
        addStdCondition('CC PERMIT', 'DRI Notice');
    }
    editAppSpecific('Project Name', getGISInfo('AGIS_CHARCO', 'DRI', 'NAME'));
}


editAppSpecific('Flood Zone', GISFloodPlain('AGIS_CHARCO', 'FEMA Flood Zones (Effective 5/5/2003)', 0, 'FZONE'));

if (getGISInfo('AGIS_CHARCO', 'FEMA Flood Zones (Effective 5/5/2003)', 'SFHA') == 'IN') {
	editAppSpecific('In SFHA', 'Y');
}

//editAppSpecific('Expiration Date', dateAdd(null, 180));


// DISABLED: ConvertToRealCapAfter:40
// if (addConditionToCapsWithMatchingParcelACA() == true) {
// 	comment('Open permit at same address.  Please contact Community Development.');
// 	cancel=true;
// 	}


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

