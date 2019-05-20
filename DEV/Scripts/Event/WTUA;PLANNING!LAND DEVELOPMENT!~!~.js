//WTUA;PLANNING!LAND DEVELOPMENT!~!~

if (appMatch('Planning/Land Development/Grade & Fill/*') && wfTask == 'Issuance' && wfStatus == 'Issued') {
    scheduleInspection('ROW Inspection', 0, '');
    scheduleInspection('Preliminary Inspection', 60, '');
    scheduleInspection('Final Inspection', 120, '');
}


if (appMatch('Planning/Land Development/Excavations/II') && wfTask == 'Permit Issuance' && wfStatus == 'Issued') {
    editAppSpecific('Reclamation Date', dateAdd(null, 3650));
}

if (appMatch('Planning/Land Development/Excavations/III') && wfTask == 'Permit Issuance' && wfStatus == 'Issued') {
    editAppSpecific('Reclamation Date', dateAdd(null, 3650));
}

if (appMatch('Planning/Land Development/Excavations/Exemption') && wfTask == 'Overall Approval' && wfStatus == 'Approved') {
    scheduleInspection('Final Excavation Inspection', 365, '');
}

if (appMatch('Planning/Land Development/Plats/Preliminary') && wfTask == 'BCC Hearing' && wfStatus == 'Approved') {
    editAppSpecific('Expiration Date', dateAdd(null, 730));
}
