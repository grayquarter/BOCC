//ASA:PLANNING/GROWTH MGMT/ZONING DETERMINATION LETTER/ZONING DETERMINATION LETTER

var asi = AInfo["AG Exemption"];
comment('AG Exemption = ' + asi);
if ((asi == 'Yes')) {
    scheduleInspection('Follow-up Inspection', 365, null, null, 'scheduled via script');
}

