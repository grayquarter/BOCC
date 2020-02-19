//WTUA:PLANNING/GROWTH MGMT/ZONING PERMITS/RESIDENTIAL FENCE

if (wfTask == 'Permit Issuance' && wfStatus == 'Permit Renewed') {
	editAppSpecific('Expiration Date', dateAdd(, 180));
}
