//WTUB:PLANNING/LAND DEVELOPMENT/STORM WATER/

if (wfTask == 'Review' && wfStatus == 'Approved' && !balanceDue == 0) {
    showMessage = true;
    comment('All Fees must be paid before this action can take place.');
    cancel = true;
}
