//IRSB:///

showMessage = true;
if (inspType != 'Plans Change Submitted' && (appMatch('Building/*/*/*') && capStatus != 'Permit Issued' && capStatus != 'Issued' && capStatus != 'Temp C of O Issued')) {
	showMessage = true;
        comment("Cannot result inspections when the permit does not currently have a status of 'Issued'");
	cancel = true;
}


if ((currentUserID != 'JONESTC' && currentUserID != 'LAPHAMK' && currentUserID != 'ADMIN') && inspType == 'Assess Garbage' && inspResult == "Pass") {
    aa.print("This inspection type cannot be manually resulted by userID: " + currentUserID);
    comment("This inspection type cannot be manually resulted.");
    cancel = true;
}

