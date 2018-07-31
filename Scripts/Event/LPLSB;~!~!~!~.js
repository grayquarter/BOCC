
showMessage = true;

bAllowAdd = false;
bContinue = false;
lookupResult = '';
fixedCAPType = '';
lookupSearchVal = 'FILTER_BY_REFTYPE_' + appTypeArray[0] + '_' + licenseTypetoAdd;
lookupResult = lookup('ACA_FILTER_CAP_BY_LICENSE', lookupSearchVal);
if (lookupResult != undefined)
	bContinue = true;
if (bContinue)
	arrAllowedCAPTypes = lookupResult.split(',');
if (bContinue)
	for (xy in arrAllowedCAPTypes)
		if (!bAllowAdd)
			//replaced branch(LPLUSB:ValidateLicenseTypeForCAP:LOOP)
			validateLicenseTypeForCap();
if (bContinue)
	if (!bAllowAdd)
		comment('<b>** This Contractor is not valid to be the primary contractor on this CAP. If you are adding a sub GÇô please continue. If you are trying to change the primary contractor, please see your supervisor. **</b>');
if (bContinue)
	if (!bAllowAdd);


include('LPLUSB:' + appTypeArray[0] + '/*/*/*');
