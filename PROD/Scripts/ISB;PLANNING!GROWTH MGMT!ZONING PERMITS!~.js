//ISB:PLANNING/GROWTH MGMT/ZONING PERMITS/*

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

    if (capStatus != 'Permit Issued' && capStatus != 'Issued' && capStatus != 'Temp C of O Issued') {
        showMessage = true;
        cancel = true;
        comment("Cannot schedule inspections when the permit does not currently have a status of 'Issued'");
    }

    if ((appMatch('Planning/Growth Mgmt/Zoning Permits/Temporary Advertising') && inspType == 'Zoning Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Planning/Growth Mgmt/Zoning Permits/Residential Fence') && inspType == 'Zoning Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Planning/Growth Mgmt/Zoning Permits/Outdoor Storage') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Planning/Growth Mgmt/Zoning Permits/Special Event') && inspType == 'Tree Inspection' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Planning/Growth Mgmt/Zoning Permits/Tree') && inspType == 'Tree Inspection' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }
}