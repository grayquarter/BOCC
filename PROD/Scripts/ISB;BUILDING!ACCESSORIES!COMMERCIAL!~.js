//ISB:BUILDING/ACCESSORIES/COMMERCIAL/

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
        aa.print("Balance=" + balanceDue);
        aa.print("InspectionType=" + InspectionType );
        doISBprocess(capId, capIDString, InspectionType);

    }

}



function doISBprocess(capId, capIDString, inspType) {


    if ((appMatch('Building/Accessories/Commercial/Carport') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Boatlift') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Cage') && inspType == 'Cage Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Canopy') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Deck') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Dock') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Door') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Driveway') && inspType == 'ROW Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Fence') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Garage') && inspType == 'Building Final' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Lanai') && inspType == 'BUILDING FINAL' && balanceDue > 0)) {
        showMessage = true;
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Barn') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Parking Lot') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Seawall') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Shed') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Shutters') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Sign') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Sign-Government') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Slab') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Swimming Pool') && inspType == 'Pool Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Wall Exterior') && inspType == 'BUILDING FINAL' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Wall Interior') && inspType == 'BUILDING FINAL' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Window') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Solar Photovoltaic') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Outdoor Storage') && inspType == 'Building Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Irrigation System') && inspType == 'Plumbing Final' && balanceDue > 0)) {
        comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
        cancel = true;
    }

    if ((appMatch('Building/Accessories/Commercial/Garage') && inspType == 'Building Final')) {
        //replaced branch(FINALS)
        finals();
    }
}