//ISB:BUILDING/CONSTRUCTION/RESIDENTIAL//

if (currentUserID == "LAPHAMK") {
    showMessage = true;
    showDebug = true;
} else {
    showMessage = false;
    showDebug = false;
}

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
aa.print(vScriptName + "/" + vEventName);

if (vScriptName == "InspectionMultipleScheduleBefore") {
    aa.print("Processing InspectionMultipleScheduleBefore...");
    var PermitID1Array = aa.env.getValue("PermitID1Array");
    var PermitID2Array = aa.env.getValue("PermitID2Array");
    var PermitID3Array = aa.env.getValue("PermitID3Array");
    var InspectionIdArray = aa.env.getValue("InspectionIDArray");
    aa.print("InspectionIdArray obj=" + InspectionIdArray);


    for (x in InspectionIdArray) {
        InspectionId = InspectionIdArray[x];
        aa.print(InspectionId);
        capResult = aa.cap.getCapID(PermitID1Array[x], PermitID2Array[x], PermitID3Array[x]);
        if (capResult.getSuccess()) {
            var capId = capResult.getOutput();
            aa.print("capId: " + capId);
            var capIDString = capId.getCustomID();
            aa.print("capIDString : " + capIDString);

            aa.print("InspectionIdArray = " + InspectionIdArray);
            var inspObj = aa.inspection.getInspection(capId, InspectionId).getOutput();
            aa.print("inspObj:" + inspObj);
            var inspGroup = inspObj.getInspection().getInspectionGroup();
            var inspType = inspObj.getInspection().getInspectionType();
            aa.print(" inspGroup(arr)== " + inspGroup);
            aa.print(" inspType(arr)== " + inspType);
            aa.print("---");
            doISBprocess(capId, capIDString, inspType);

        }
    }
}


if (vScriptName == "InspectionScheduleBefore") {
    var PermitId1 = aa.env.getValue("PermitId1");
    var PermitId2 = aa.env.getValue("PermitId2");
    var PermitId3 = aa.env.getValue("PermitId3");
    var inspType = aa.env.getValue("InspectionType");
    aa.print(PermitId1 + PermitId2 + PermitId3);
    aa.print("inspType=" + inspType);

    capResult = aa.cap.getCapID(PermitId1, PermitId2, PermitId3);
    if (capResult.getSuccess()) {
        var capId = capResult.getOutput();
        aa.print("capId: " + capId);
        var capIDString = capId.getCustomID();
        aa.print("capIDString : " + capIDString);

        doISBprocess(capId, capIDString, inspType);

    }

}


function doISBprocess(capId, capIDString, inspType) {

    if ((appMatch('Building/Construction/Residential/Single Family') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Addition') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/DCA Home') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Miscellaneous') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Mobile Home') && inspType == 'Mobile Home Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Modular') && inspType == 'Mobile Home Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Remodel') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/SUBDRY') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Single Family-Babcock') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment(capIDString + ' ' + inspType + ' Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Duplex') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Townhouse') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Construction/Residential/Coastal Lighting') && inspType == 'COASTAL LIGHTING FINAL' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    /*
    if ((appMatch('Building/Construction/Residential/Duplex') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }

    if ((appMatch('Building/Construction/Residential/Mobile Home') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }

    if ((appMatch('Building/Construction/Residential/Modular') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }

    if ((appMatch('Building/Construction/Residential/Single Family') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }

    if ((appMatch('Building/Construction/Residential/Single Family-Babcock') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }

    if ((appMatch('Building/Construction/Residential/Townhouse') && inspType == 'Building Final')) {
	    //replaced branch(FINALS)
	    finals();
    }
    */

}
