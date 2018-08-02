
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
		comment('<b>** This Contractor is not valid to be the primary contractor on this CAP. If you are adding a sub GÇô please continue. If you are trying to change the primary contractor, please see your supervisor. **</b>');
		cancel = true;
	}
}

//TODO: embed this code?
include('LPLUSB:' + appTypeArray[0] + '/*/*/*');
