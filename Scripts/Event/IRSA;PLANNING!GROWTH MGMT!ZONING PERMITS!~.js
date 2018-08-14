//start replaced branch: CC_151_GM_ZN_InspResultAfter
{
	if (inspResult == 'Fail with Fee') {
		addFee('REJ-B', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (inspResult == 'Fail') {
		addFee('REJ-B', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (inspResult == 'Fail with Fee x 2') {
		addFee('REJ-B2', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (inspResult == 'Fail with Fee x 3') {
		addFee('REJ-B3', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (matches(inspResult, 'Fail with Fee Z', 'Fail with Fee x 2 Z', 'Fail with Fee x 3 Z')) {
		addFee('REJ-Z', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (inspResult == 'Fail ROW') {
		addFee('10-ROWREIN', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	if (inspResult == 'Fail Re-inspect') {
		addFee('M-STWTRREI', 'ADDTL_INSP_FEES', 'ORIGINAL', 1, 'Y');
	}

	var capIDString = capId.getCustomID();
	comment(capIDString);
	oInspList = aa.inspection.getInspections(capId);
	inspArray = oInspList.getOutput();
	comment(inspArray);
	if (appMatch('Planning/Growth Mgmt/Zoning Permits/Residential Fence') && inspType == 'Zoning Final' && matches(inspResult, 'Pass', 'Approved as Noted', 'Not Required') && balanceDue == 0) {
		pendingInspectionExists = checkForPendingInspections();
		if (pendingInspectionExists)
			for (insp in inspArray)
				//replaced branch(fullInsps)
				fullInsps();
	}

	if (appMatch('Planning/Growth Mgmt/Zoning Permits/Residential Fence') && matches(inspResult, 'Pass', 'Approved as Noted', 'Not Required') && balanceDue == 0) {
		pendingInspectionExists = checkForPendingInspections();
		if (!pendingInspectionExists)
			branchTask('Finaled', getFinaledWorkflowStatus());
	}

}
//end replaced branch: CC_151_GM_ZN_InspResultAfter;
