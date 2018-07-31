
currMnth = new Date().getMonth() + 1;
feeSch = '';
feeAdd = false;
if (appMatch('Building/Construction/Commercial/Multi-Family')) {
	feeSch = 'BLD_CON_COM_MU';
	feeAdd = true;
}

if (feeAdd == true && AInfo['District'] = 'Charlotte County Sanitation District' && !feeExists('GARB-CC', 'INVOICED') && AInfo['Service Start Date'] != null) {
	distFee = lookup('CC_CHAR_CO_SAN_DIST', currMnth);
	updateFee('GARB-CC', feeSch, 'ORIGINAL', distFee, 'Y');
}

if (feeAdd == true && AInfo['District'] = 'Don Pedro/Knight Island Sanitation District' && !feeExists('GARB-CC', 'INVOICED') && AInfo['Service Start Date'] != null) {
	distFee = lookup('CC_DPKI_SAN_DIST', monCurrent);
	updateFee('GARB-DP', feeSch, 'ORIGINAL', distFee, 'Y');
}
