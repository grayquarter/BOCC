
if (!appMatch('Building/Trade Permits/Residential/Irrigation System') && !appMatch('Building/Trade Permits/Residential/Electrical')) {
	var LicProfList = aa.env.getValue('LicProfList').toArray();
	var x = 0;
}

if (!appMatch('Building/Trade Permits/Residential/Irrigation System') && !appMatch('Building/Trade Permits/Residential/Electrical') && (LicProfList.length > 0)) {
	for (x in LicProfList) {
		var lpn = LicProfList[x].getLicenseNbr();
	}
	comment(GetLicInfo(lpn)[1]);
	if (GetLicInfo(lpn)[0] == true) {
		// TODO: cancel by itself will not send a message to the user
		cancel = true;
	}
}

if (!appMatch('Building/Trade Permits/Residential/Irrigation System') && !appMatch('Building/Trade Permits/Residential/Electrical') && LPValidation()) {
	showMessage = true;
	cancel = true;
	comment('Your General liability or Workmans Compensation Insurance is expired or not on file. Please contact Community Development on 941-743-1201');
}
