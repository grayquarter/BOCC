//WTUB:CODEENFORCEMENT/COMPLAINTS//

if (wfStatus == 'Not in Compliance' && wfTask == 'Code Violation' && AInfo['Updated.CILB'] != 'CHECKED' && AInfo['Updated.CE'] != 'CHECKED' && AInfo['Updated.Unsafe Building'] != 'CHECKED') {
    showMessage = true;
    comment('If Not in Compliance status selected, please check CE, CILB or Unsafe Building ');
    cancel = true;
}
