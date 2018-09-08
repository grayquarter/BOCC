function workflowInfo() {

	showMessage = false;
	var myCap = String(capIDString);
	var Subj = wfTask + ' Status Update for Permit # ' + myCap + ' (' + wfStatus + ')';
	addrResult = aa.address.getAddressByCapId(capId);
	var addrArray = new Array();
	var addrArray = addrResult.getOutput();
	var streetName = addrArray[0].getStreetName();
	var hseNum = addrArray[0].getHouseNumberStart();
	var streetSuffix = addrArray[0].getStreetSuffix();
	var city = addrArray[0].getCity();
	var zip = addrArray[0].getZip();
	var profArr = new Array();
	var EmlBod = '';
	profArr = getLicenseProfessional(capId);
	var emailAddress;
	if (profArr != null) {
		for (x in profArr)
			if (profArr[x].getPrintFlag() == 'Y')
				emailAddress = profArr[x].getEmail();
		comment('emailAddress = ' + emailAddress);
	}

	if ((emailAddress == 'NA' || emailAddress == 'na' || emailAddress == null || emailAddress == 'NONE' || emailAddress == 'NA' || emailAddress == 'none')) {
		emailAddress = 'TinaC.Jones@charlottecountyfl.gov';
	}

	nameArray = new Array();
	nameArray = String(aa.person.getUser(wfStaffUserID).getOutput()).split('/');
	var revBy = nameArray[6];
	EmlBod = '<br>Permit Type: ' + appTypeString + '<br>Address: ' + hseNum + ' ' + streetName + ' ' + streetSuffix + ' ' + city + ' ' + zip + '<br>Permit # ' + myCap + '<br>Task: ' + wfTask + ' - ' + wfStatus + '<br>Comment: ' + wfComment + '<br>Reviewed by: ' + revBy;
	var endText = '<br>This is a courtesy message noting a new comment on a plan review.  Questions?  Contact the Charlotte County Community Development Department at 941-743-1201.';
	comment(endText);
	if (wfComment != null) {
		aa.sendMail('NoReply@CharlotteCountyFL.gov', emailAddress, '', Subj, EmlBod + '<br>' + endText);
		aa.sendMail('NoReply@CharlotteCountyFL.gov', 'TinaC.Jones@charlottecountyfl.gov', '', Subj, 'To: ' + emailAddress + '<br>' + EmlBod + '<br>' + endText);
	}

}
