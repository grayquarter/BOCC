//ISB:CODEENFORCEMENT///

if ((appMatch('CodeEnforcement/Unsafe Building/NA/NA') && inspType == 'Follow-up Inspection' && balanceDue > 0)) {
    showMessage = true;
    comment('Inspection cannot be scheduled because there is a balance of $' + balanceDue + ' due on the record.');
    cancel = true;
}
