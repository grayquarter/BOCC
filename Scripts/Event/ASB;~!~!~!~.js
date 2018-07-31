
if (currentUserID.substr(0, 6) != 'PUBLIC' && !matches(aa.env.getValue('LicProfList'), '', null, undefined)) {
	bAllowAdd = false;
	bContinue = false;
	lookupResult = '';
	lpList = aa.env.getValue('LicProfList').toArray();
	fixedCAPType = '';
	lpIndex = 0;
	for (ll in lpList)
		if (lpList[ll].printFlag == 'Y')
			lpIndex = ll;
	pLicenseType = '' + lpList[lpIndex].getLicenseType();
	lookupSearchVal = 'FILTER_BY_REFTYPE_' + appTypeArray[0] + '_' + pLicenseType;
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
			comment('<b>** You are trying to add an unapproved Licensed Professional type to this CAP **</b>');
	if (bContinue)
		if (!bAllowAdd)
			cancel = true;
}
