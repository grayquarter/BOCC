//ASA:PLANNING/GROWTH MGMT/ZONING DETERMINATION LETTER/ZONING DETERMINATION LETTER

var asi = AInfo["AG Exemption"];
comment('AG Exemption = ' + asi);
if ((asi == 'Yes')) {
    scheduleInspection('Follow-up Inspection', 365, null, null, 'scheduled via script');
}

// TODO more optimal to use asi = AInfo["AG Exemption"]; prior: asi = getAppSpecific('AG Exemption', capId);
// DISABLED: ASA:Planning/Growth Mgmt/Zoning Determination Letter/Zoning Determination Letter:10
// if (proximity('AGIS_CHARCO', 'Babcock_Lots', 1)) {
// 	addStdCondition('CC PERMIT','Babcock Ranch');
// 	}
