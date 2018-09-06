
// extracted from customized master script
var licenseList = aa.env.getValue("LicenseList").toArray();
var licenseTypetoAdd = "";
logDebug("licenseList = " + licenseList.getClass());
for (var i in licenseList) {
	logDebug("licenseList[" + i + "] = " + licenseList[i].getStateLicense());
	var licenseTypetoAdd = licenseList[i].getLicenseType();
}
// end extracted from customized master script



// TODO, setting showmessage to true could result in popups without meaningful messages
showMessage = true;
bAllowAdd = false;
lookupResult = '';
fixedCAPType = '';
lookupSearchVal = 'FILTER_BY_REFTYPE_' + appTypeArray[0] + '_' + licenseTypetoAdd;
lookupResult = lookup('ACA_FILTER_CAP_BY_LICENSE', lookupSearchVal);
if (lookupResult != undefined) {
	arrAllowedCAPTypes = lookupResult.split(',');
	for (xy in arrAllowedCAPTypes) {
		if (!bAllowAdd) {
			//replaced branch(LPLUSB:ValidateLicenseTypeForCAP:LOOP)
			bAllowAdd = validateLicenseTypeForCap();
		}
	}
	if (!bAllowAdd) {
		comment('<b>** This Contractor is not valid to be the primary contractor on this CAP. If you are adding a sub please continue. If you are trying to change the primary contractor, please see your supervisor. **</b>');
		cancel = true;
	}
}

//TODO: there is only one instance of this script, why not embed this code?
//include('LPLUSB:' + appTypeArray[0] + '/*/*/*');

if (!appMatch('Building/Construction/Commercial/Shell') && !appMatch('Building/Trade Permits/Commercial/Irrigation System')) {

	var LicProfList = aa.env.getValue('LicenseList').toArray();
	var x = 0;

	if (LicProfList.length > 0) {
		for (x in LicProfList) {
			showMessage = true;
			var lpn = LicProfList[x].getStateLicense();
			//comment(GetLicInfo(lpn));
			if (GetLicInfo(lpn)[0] == true) {
				showMessage = true;
				comment(GetLicInfo(lpn)[1]);
				cancel = true;
			}
		}
	}

	if (LPValidation()) {
		showMessage = true;
		cancel = true;
		comment('Your General liability or Workmans Compensation Insurance is expired or not on file. Please contact Community Development on 941-743-1201');
	}
}
