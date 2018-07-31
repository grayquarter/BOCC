
if (currentUserID == 'LAPHAMK') {
	showMessage=true;
	showDebug=true;
	comment('CC_150_InspResultAfter executed successfully <br>inspComment '+ inspComment);
	}

if (appMatch('Building/*/*/*')) {
	showDebug=false;
	
//start replaced branch: CC_151_BLD_InspResultAfter
 {
if (currentUserID == 'LAPHAMK' || currentUserID == 'JONESTC'  || currentUserID == 'OQUENDOM') {
	showMessage=true;
	showDebug=true;
	} else {
	showMessage=false;
	showDebug=false;
	}

if (inspResult=='Fail with Fee') {
	addFee('REJ-B','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	comment('Fail with fee executed.');
	}

if (inspResult=='Fail') {
	addFee('REJ-B','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	comment('Fail with fee executed.');
	}

if (inspResult=='Fail with Fee x 2') {
	addFee('REJ-B2','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail with Fee x 3') {
	addFee('REJ-B3','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (matches(inspResult,'Fail with Fee Z','Fail with Fee x 2 Z','Fail with Fee x 3 Z')) {
	addFee('REJ-Z','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail ROW') {
	addFee('10-ROWREIN','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail Re-inspect') {
	addFee('M-STWTRREI','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Partial') {
	addFee('REJ-B','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (matches(inspResult, 'Pass', 'Approved as Noted', 'Not Required') && balanceDue == 0) {
	pendingInspectionExists = checkForPendingInspections();
	if(!pendingInspectionExists) branchTask('Finaled', getFinaledWorkflowStatus());
	}

if ((inspResult.indexOf('Fail') > -1 || inspResult.indexOf('Partial') > -1 || inspResult.indexOf('Cancelled') > -1)) {
	createPendingInspection(inspGroup, inspType);
	}

if (matches(inspResult, 'Pass', 'Approved as Noted', 'Partial without Fee','Approved per Affidavit Program') && inspType != 'Plans Change Submitted') {
	editAppSpecific('Expiration Date', dateAdd(null,180));
	}

if ((appMatch('Building/Construction/Residential/*') || appMatch('Building/Accessories/Residential/*')) && (inspType == 'Plans Change Submitted' || inspType == 'On-Line Resubmittal') && (inspResult == 'Pass' || inspResult == 'Approved as Noted' )) {
	addFee('PLN CHNG', 'ADD_REVIEW', 'ORIGINAL', 1, 'Y');
	}

if ((appMatch('Building/Construction/Commercial/*') || appMatch('Building/Accessories/Commercial/*')) && (inspType == 'Plans Change Submitted' || inspType == 'On-Line Resubmittal') && (inspResult == 'Pass' || inspResult == 'Approved as Noted')) {
	addFee('PLN CHNG_COM', 'ADD_REVIEW', 'ORIGINAL', 1, 'Y');
	}

if (appMatch('Building/Accessories/Residential/Temporary Erosion Control') && inspType == 'Compliance Inspection' && inspResult == 'Pass') {
	editAppSpecific('Expiration Date',dateAdd(null,60));
	}

if ((inspType == 'Electric Final' && inspResult == 'Electric - Power')) {
	branch('FPL_final');
	comment('Electric Final--Electric - Power');
	}

if ((inspType == 'Electric Temporary Service' && inspResult == 'Electric - Power')) {
	branch('FPL_temp');
	comment('Electric Temporary Service--Electric - Power');
	}

if (matches(inspResult, 'Cancelled by County', 'Cancelled by Applicant')) {
	branch('cancel_email2');
	}

showMessage=true;
showDebug=false;
comment('CC_151_BLD_InspResultAfter executed successfully');
branch('contractor_inspection');

}
//end replaced branch: CC_151_BLD_InspResultAfter;
	}

if (appMatch('Planning/Managed Growth/*/*')) {
	
//start replaced branch: CC_151_GM_InspResultAfter
 {
comment('CC_151_GM_InspResultAfter Executing message');

}
//end replaced branch: CC_151_GM_InspResultAfter;
	}

if (appMatch('Planning/Land Development/*/*')) {
	
//start replaced branch: CC_151_LD_InspResultAfter
 {
comment('CC_151_LD_InspResultAfter Executing message');
if (appMatch('Planning/Land Development/ROW/*') && isTaskActive('Permit Issuance') && inspResult == 'Pass') {
	closeTask('Permit Issuance','Issued','Updated through Inspection');
	}

if (appMatch('Planning/Land Development/ROW/*') && isTaskActive('Permit Issuance') && inspResult == 'Fail') {
	updateTask('Permit Issuance','Failed','Updated through Inspection');
	}

if (appMatch('Planning/Land Development/Plats/Final - Construction') && isTaskActive('Public Works Inspection') && inspType == 'Public Works Inspection' && inspResult == 'Fail') {
	updateTask('Public Works Inspection','Failed','Updated through Inspection');
	branch('CC_152_InspResultAfter');
	}

if (appMatch('Planning/Land Development/Plats/Final - Construction') && isTaskActive('Stormwater Inspection') && inspType == 'Stormwater Inspection' && inspResult == 'Fail') {
	updateTask('Stormwater Inspection','Failed','Updated through Inspection');
	branch('CC_152_InspResultAfter');
	}

if (appMatch('Planning/Land Development/Plats/Final - Non Construction') && isTaskActive('Public Works Inspection') && inspType == 'Public Works Inspection' && inspResult == 'Fail') {
	updateTask('Public Works Inspection','Failed','Updated through Inspection');
	branch('CC_152_InspResultAfter');
	}

if (appMatch('Planning/Land Development/Plats/Final - Non Construction') && isTaskActive('Stormwater Inspection') && inspType == 'Stormwater Inspection' && inspResult == 'Fail') {
	updateTask('Stormwater Inspection','Failed','Updated through Inspection');
	branch('CC_152_InspResultAfter');
	}

if (appMatch('Planning/Land Development/ROW/NA') || appMatch('Planning/Land Development/ROW/Utility') && isTaskActive('Permit Issuance') && inspResult == 'Fail') {
	branch('CC_152_InspResultAfter');
	}

if (appMatch('Planning/Land Development/Stormwater/*') || appMatch('Planning/Land Development/ROW/Utility') && isTaskActive('Permit Issuance') && inspResult == 'Fail') {
	branch('CC_152_InspResultAfter');
	}

}
//end replaced branch: CC_151_LD_InspResultAfter;
	}

if (appMatch('CodeEnforcement/*/*/*')) {
	
//start replaced branch: CC_151_CE_InspResultAfter
 {
comment('CC_151_CE_InspResultAfter Executing message');

}
//end replaced branch: CC_151_CE_InspResultAfter;
	}

if (appMatch('Planning/Growth Mgmt/Zoning Permits/*')) {
	
//start replaced branch: CC_151_GM_ZN_InspResultAfter
 {
if (currentUserID == 'LAPHAMK' || currentUserID == 'JONESTC'  || currentUserID == 'OQUENDOM') {
	showMessage=true;
	showDebug=true;
	} else {
	showMessage=false;
	showDebug=false;
	}

if (inspResult=='Fail with Fee') {
	addFee('REJ-B','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail') {
	addFee('REJ-B','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail with Fee x 2') {
	addFee('REJ-B2','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail with Fee x 3') {
	addFee('REJ-B3','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (matches(inspResult,'Fail with Fee Z','Fail with Fee x 2 Z','Fail with Fee x 3 Z')) {
	addFee('REJ-Z','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail ROW') {
	addFee('10-ROWREIN','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

if (inspResult=='Fail Re-inspect') {
	addFee('M-STWTRREI','ADDTL_INSP_FEES','ORIGINAL',1,'Y');
	}

var capIDString = capId.getCustomID();
comment(capIDString);
oInspList = aa.inspection.getInspections(capId);
inspArray = oInspList.getOutput();
comment(inspArray);
if (appMatch('Planning/Growth Mgmt/Zoning Permits/Residential Fence') && inspType == 'Zoning Final' && matches(inspResult, 'Pass', 'Approved as Noted', 'Not Required') && balanceDue == 0) {
	pendingInspectionExists = checkForPendingInspections();
	if (pendingInspectionExists) for (insp in inspArray) 
//replaced branch(fullInsps)
fullInsps();
	}

if (appMatch('Planning/Growth Mgmt/Zoning Permits/Residential Fence') && matches (inspResult, 'Pass', 'Approved as Noted', 'Not Required') && balanceDue == 0) {
	pendingInspectionExists = checkForPendingInspections();
	if(!pendingInspectionExists) branchTask('Finaled', getFinaledWorkflowStatus());
	}

}
//end replaced branch: CC_151_GM_ZN_InspResultAfter;
	}

