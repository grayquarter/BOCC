//ISB:BUILDING///

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
        aa.print("InspectionType=" + InspectionType);
        doISBprocess(capId, capIDString, InspectionType);


    }

}



function doISBprocess(capId, capIDString, inspType) {

    var scriptFlag = 0;

    if ((currentUserID != 'JONESTC' && currentUserID != 'LAPHAMK') && inspType == 'Assess Garbage') {
        aa.print("This inspection type cannot be manually scheduled.");
        comment("This inspection type cannot be manually scheduled.");
        cancel = true;
    }

    if (inspType != 'Plans Change Submitted' && capStatus != 'Permit Issued' && capStatus != 'Issued' && capStatus != 'Temp C of O Issued') {
        showMessage = true;
        cancel = true;
        comment("Cannot schedule inspections when the permit does not currently have a status of 'Issued'");
    }

    if (appHasCondition(null, 'Applied', null, 'LOCK')) {
        showMessage = true;
        comment('Cannot schedule an inspection until LOCK condition is met.');
        cancel = true;
    }

    if (appHasCondition(null, 'Applied', null, 'HOLD')) {
        showMessage = true;
        comment('Cannot schedule an inspection until HOLD condition is met.');
        cancel = true;
    }

    if (appHasCondition(null, 'Applied', 'Inspection Hold', 'NOTICE')) {
        showMessage = true;
        comment('Cannot schedule an inspection until outstanding condition is met.');
        cancel = true;
    }

    // DISABLED: ISB:Building/*/*/*:35
    // if ((inspType == 'Babcock Final' && balanceDue > 0)) {
    // 	comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
    // 	cancel = true;
    // 	}

    var LicProfList = getLicenseProfessional(capId);
    var x = 0;
    if ((LicProfList.length != null) && (LicProfList.length > 0)) {
        for (x in LicProfList) {
            if (LicProfList[x].printFlag == 'Y');
        }
        lpIndex = x;
    }

    if ((LicProfList.length != null) && (LicProfList.length > 0)) {
        var pLicNo = LicProfList[lpIndex].getLicenseNbr();
    }

    if ((LicProfList.length != null) && (LicProfList.length > 0) && (pLicNo == '01') && ((currentUserID.substr(0, 6) == 'PUBLIC') || (currentUserID.substr(0, 6) == 'ADMIN'))) {
        comment('Scheduling for this inspection type is not available online.  Please contact Community Development at 941-743-1201 to schedule your inspection.');
        cancel = true;
    }



    if (!appMatch('Building/Accessories/Residential/Garage') && !appMatch('Building/Accessories/Commercial/Garage') && (inspType == 'Lintel')) {

        showMessage = true;
        comment('This is a Lintel inspection... checking for Flood Zone.');
        var asi = '';
        asi = getAppSpecific('Flood Zone', capId);
        comment('Flood zone = ' + asi);
        var elevCertPassedAll = false;
        var elevCertPassed = false;
        var elevCertPassed2 = false;
        var elevCertPassed3 = false;
        var elevCertPassed4 = false;
        elevCertPassed = checkInspectionResult('Elevation Certificate - Under Construction', 'Pass');
        elevCertPassed2 = checkInspectionResult('Elevation Certificate - Under Construction', 'Approved as Noted');
        elevCertPassed3 = checkInspectionResult('Elevation Certificate - Final', 'Pass');
        elevCertPassed4 = checkInspectionResult('Elevation Certificate - Final', 'Approved as Noted');
        if ((elevCertPassed == true || elevCertPassed2 == true || elevCertPassed3 == true || elevCertPassed4 == true)) {
            elevCertPassedAll = true;
            comment('Elevation Cert Passed = ' + elevCertPassedAll);
        } else {
            comment('Elevation Cert = ' + elevCertPassedAll);
        }

        if ((asi != null && asi != 'No' && asi != 'X' && asi != 'D' && elevCertPassedAll == false)) {
            comment("An Elevation certificate required for Lintel since is in flood zone '" + asi + "'.  Cancelling inspection...");
            cancel = true;
        } else {
            comment('Criteria met... Lintel inspection scheduled.');
        }
    }
}  
