// 20180906, STAGE original for rollback

/*------------------------------------------------------------------------------------------------------/
| Accela Automation
| Accela, Inc.
| Copyright (C): 2012
|
| Program : INCLUDES_CUSTOM.js
| Event   : N/A
|
| Usage   : Custom Script Include.  Insert custom EMSE Function below and they will be 
|	    available to all master scripts
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/

//20141017 - bec - adding Roland's functions
function checkForPendingInspections() {
	logDebug("FUNCTION: checkForPendingInspections() ...");
	//Return true if a Pending Inspection exists on the Record
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			var iStatus = inspList[xx].inspectionStatus;
			logDebug("Inspection Status: " + iStatus);

			if (iStatus == "Pending" || iStatus == "PENDING" || iStatus == "SCHEDULED" || iStatus == "Scheduled") {
				logDebug("Found Pending Inspection, return true");
				return true;
			}
		}

		//Default false if pending not found
		logDebug("No Pending Inspection Found.  Return false");
		return false;
	}
}

function getFinaledWorkflowStatus() {
	logDebug("FUNCTION: getFinaledWorkflowStatus() ... ");

	//Need to check the Record Types and return status of "C of O Issued" or "Finaled" (default)

	logDebug("Application Type is: " + appTypeString);

	//This function is called for the Building module, so no need to check that here
	if (appTypeArray[1] == "Construction") {
		if (appTypeArray[2] == "Commercial" && matches(appTypeArray[3], "Addition", "Build Out", "Change of Occupancy", "Commercial Building", "DCA Office", "Modular", "Multi-Family")) {
			logDebug("Return status of C of O Issued");
			return "C of O Issued";
		}

		if (appTypeArray[2] == "Residential" && matches(appTypeArray[3], "Addition", "DCA Home", "Duplex", "Mobile Home", "Modular", "Single Family", "Townhouse")) {
			logDebug("Return status of C of O Issued");
			return "C of O Issued";
		}

		//Default need to return "Finaled"
		logDebug("Return status of Finaled");
		return "Finaled";
	}
	else {
		logDebug("Return status of Finaled");
		return "Finaled";
	}
}

// end of Roland's functions



////////////////////////////////////////////////////////////////////////////////////////////
//20180601 - kl -longshoreman's removed (former 20141017 - bec - Longshoreman functions)
//Start the script for validating the licensed professional
////////////////////////////////////////////////////////////////////////////////////////////

function LPValidation() {
	var isExp = null;
	if (controlString == "ApplicationSubmitBefore") {
		var LicProfList = aa.env.getValue("LicProfList");
		if (LicProfList != "") {
			LicProfList = LicProfList.toArray();
			for (var thisLic in LicProfList) {
				licProfScriptModel = LicProfList[thisLic];
				licNum = licProfScriptModel.getLicenseNbr();
				logDebug("Lic Num (ASB): " + licNum);
				isExp = doLogic(licNum, null);
				if (isExp == true)
					return true;  //is expired license
			}
		}
	}
	else if (controlString == "LicProfLookupSubmitBefore") {
		var LicenseList = aa.env.getValue("LicenseList");
		if (LicenseList != "") {
			for (var i = 0; i < LicenseList.size(); i++) {
				var licProfModel = LicenseList.get(i);
				var licenseType = licProfModel.getInsuranceExpDate();
				var getWcExempt = licProfModel.getWcExempt();
				var licNum = licProfModel.stateLicense;
				var licType = licProfModel.getLicenseType();
				logDebug("Lic Num: " + licNum + ", License Type is " + licType + ", and Work is on or above ASI: ");//
				isExp = doLogic(licNum, licType);
				if (isExp == true)
					return true;
			}
		}
	}
	else if (controlString == "WorkflowTaskUpdateBefore") {
		var LicenseListResult = aa.licenseScript.getLicenseProf(capId);
		if (LicenseListResult.getSuccess()) {
			var LicenseList = LicenseListResult.getOutput();
		}
		else {
			logDebug("**WARNING: getting lic prof: " + LicenseListResult.getErrorMessage());
			return true;
		}
		if (LicenseList == null || !LicenseList.length) {
			logDebug("**WARNING: no licensed professionals on this CAP");
			return false;
		}
		for (var i = 0; i < LicenseList.length; i++) {
			var licProfModel = LicenseList[i];
			var licNum = licProfModel.getLicenseNbr();
			logDebug("Lic Num (WTUB): " + licNum);
			isExp = doLogic(licNum, null);
			if (isExp == true)
				return true;
		}
	}
	if (isExp == true)
		return true;
	else
		return false;
}



function doLogic(licNum, licType) {
	//determines if expired (isExp variable in LPValidation() function);
	var WorkComExpDate = null;
	var ExemptCom = null;
	var ExpirationValue = null;
	var exDate = null;
	var insuDate = null;
	var isExp = null;

	var WCIEDName = "WC_Insur_Exp_Date";
	logDebug("WCIEDName = " + WCIEDName);
	var ExpirationName = "WC_Exempt_Exp_Date";
	logDebug("ExpirationName = " + ExpirationName);
	var WCEName = "WC_Exempt";
	logDebug("WCEName = " + WCEName);
	var agency = aa.getServiceProviderCode();

	var lpModel = aa.licenseScript.getRefLicensesProfByLicNbr(agency, licNum);
	if (lpModel.getSuccess()) {
		var lpModelArr = lpModel.getOutput();
	}
	else {
		logDebug("**WARNING: getting lic prof: " + lpModel.getErrorMessage());
		return true;
	}
	if (lpModelArr == null || !lpModelArr.length) {
		logDebug("**WARNING: no licensed professionals on this CAP");
		return true;
	}

	var myLpAttLen = lpModelArr.length;

	//Updated 9/8 by Beyondsoft
	licType = licType + '';

	for (var t = 0; t < myLpAttLen; t++) {
		var licVer = true;
		var wfVer = true;
		var wfVer2 = true;
		if (controlString == "LicProfLookupSubmitBefore") {
			//Updated 9/8 by Beyondsoft
			//if(lpModelArr[t].getLicenseType()!=licType)
			var tmpLicType = lpModelArr[t].getLicenseType() + '';
			if (tmpLicType != licType) {
				logDebug("License Type does not match.  licVer is false and no other validation will be checked.");
				licVer = false;
			}
		}
		if (licVer) {

			logDebug("INSIDE doLogic(), licVer is true so check ...");

			exDate = lpModelArr[t].getLicenseExpirationDate();
			insuDate = lpModelArr[t].getInsuranceExpDate();


			var thisLp = lpModelArr[t];
			var myAttributes = thisLp.getAttributes();

			//DQ 10/20/14 - If no attributes then should always return false because checked
			if (myAttributes == null) {
				return false;
			}

			var myPemModel = myAttributes.get("PeopleAttributeModel");
			var myLenArraty = myPemModel.toArray();
			var mylen = myLenArraty.length;
			for (var i = 0; i < mylen; i++) {

				var contactAttribute = myLenArraty[i];
				var capid = contactAttribute.getCapID();

				var name = contactAttribute.getAttributeName();
				var values = contactAttribute.getAttributeValue();

				logDebug("name and values: " + name + " : " + values);

				if (name == WCIEDName || name == WCIEDName.toUpperCase()) {
					logDebug("Attribute Name = " + WCIEDName + " (or uppercase). Set WorkComExpDate to: " + values);
					WorkComExpDate = values;
				}
				if (name == WCEName || name == WCEName.toUpperCase()) {
					logDebug("Attribute Name = " + WCEName + " (or uppercase). Set ExemptCom to: " + values);
					ExemptCom = values;
				}
				//DQ 8/26 check for exemption everytime
				//if(controlString=="WorkflowTaskUpdateBefore")
				//{
				if (name == ExpirationName || name == ExpirationName.toUpperCase()) {
					logDebug("Attribute Name = " + ExpirationName + "  (or uppercase). Set ExpirationValue to: " + values);
					ExpirationValue = values;
				}
				//}

			}

		}

	}

	logDebug("exDate (getLicenseExpirationDate): " + exDate);
	logDebug("insuDate (getInsuranceExpDate): " + insuDate);
	logDebug("WorkComExpDate (Attribute=" + WCIEDName + ") : " + WorkComExpDate);
	logDebug("ExemptCom (Attribute=" + WCEName + ") : " + ExemptCom);
	logDebug("ExpirationValue (Attribute= " + ExpirationName + ") : " + ExpirationValue);
	logDebug('Below is result of ExemptCom=="Y"');
	logDebug(ExemptCom == "Y");
	//DQ 8/26 if exempt use exemption date
	if (ExemptCom == "Y") {
		logDebug("In ExemptCom==Y.  Set WorkComExpDate=ExpirationValue");
		WorkComExpDate = ExpirationValue;
	}

	//logic      
	if (controlString == "WorkflowTaskUpdateBefore") {
		logDebug("In controlString == 'WorkflowTaskUpdateBefore'");

		if (!(wfStatus == "Issued" || wfStatus == "Permit issued" || wfStatus == "Permit Issued") && (ExemptCom != "Y")) {
			wfVer2 = false;
		}
		if (!(wfStatus == "Issued" || wfStatus == "Permit issued" || wfStatus == "Permit Issued") && ExemptCom == "Y") {
			WorkComExpDate = ExpirationValue;
		}
		if ((wfStatus == "Issued" || wfStatus == "Permit issued" || wfStatus == "Permit Issued") && ExemptCom == "Y") {
			if (ExpirationValue == null) {
				return true;
			}
			else if (convertDateforLong(ExpirationValue) <= conSysDate(sysDate)) {
				return true;
			}
		}
	}

	if (wfVer2) {
		logDebug("In if[wfVer2]");

		if (WorkComExpDate == null || exDate == null || insuDate == null) {
			logDebug("in if wfVer2 and one of the expiration or insurance dates is NULL.  WorkComExpDate, exDate, insuDate");
			return true;
		}
		else if (convertDateforLong(WorkComExpDate) <= conSysDate(sysDate) || conDate(exDate) <= conSysDate(sysDate) || conDate(insuDate) <= conSysDate(sysDate)) {
			logDebug("WorkComExpDate: " + WorkComExpDate);
			logDebug("convertDateforLong(WorkComExpDate)<=conSysDate(sysDate): " + convertDateforLong(WorkComExpDate) <= conSysDate(sysDate));
			logDebug("conDate(exDate)<=conSysDate(sysDate): " + conDate(exDate) <= conSysDate(sysDate));
			logDebug("conDate(insuDate)<=conSysDate(sysDate)" + conDate(insuDate) <= conSysDate(sysDate));

			logDebug("in if wfVer2 and one of the expiration or insurance dates is EXPIRED!");
			return true;
		}
		if (controlString == "WorkflowTaskUpdateBefore") {
			if (!(wfStatus == "Issued" || wfStatus == "Permit issued" || wfStatus == "Permit Issued") && ExemptCom == "Y") {
				wfVer = false;
			}
		}
	}
	return isExp;
}
function convertDateforLong(thisDate) {
	//transform the date which is object

	if (typeof (thisDate) == "string") {
		var retVal = new Date(String(thisDate));
		if (!retVal.toString().equals("Invalid Date"))
			return retVal;
	}

	if (typeof (thisDate) == "object") {

		if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
		{
			return thisDate;
		}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

		if (thisDate.getClass().toString().equals("class java.util.Date")) {
			return new Date(thisDate.getTime());
		}

		if (thisDate.getClass().toString().equals("class java.lang.String")) {
			return new Date(String(thisDate));
		}
	}

	if (typeof (thisDate) == "number") {
		return new Date(thisDate);  // assume milliseconds
	}

	logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
	return null;
}

function conDate(thisDate) {
	//transform the date from asi
	if (thisDate != null)
		return new Date(thisDate.getMonth() + "/" + (thisDate.getDayOfMonth() + 1) + "/" + thisDate.getYear());
	else
		return null;

}

function conSysDate(thisDate) {
	//transform the date from asi
	if (thisDate != null)
		return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
	else
		return null;

}

//End the script for validating the licensed professional
// end of Longshoreman functions
//////////////////////////////////////////////////////////////////////






function getAddressLine(getPrimary) {
	//gets address returns, returns false if address not found
	//capId optional

	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args;
	else
		itemCap = capId;


	var addressLineArray = new Array();

	addrResult = aa.address.getAddressByCapId(itemCap);

	if (addrResult.getSuccess()) {
		addr = addrResult.getOutput();

		if (addr.length > 0) {
			for (ad in addr) {
				var addressLine = "";
				//Build address into a line
				if (addr[ad].getHouseNumberStart() != null) addressLine += addr[ad].getHouseNumberStart();
				if (addr[ad].getStreetDirection() != null) addressLine += " " + addr[ad].getStreetDirection();
				if (addr[ad].getStreetName() != null) addressLine += " " + addr[ad].getStreetName();
				if (addr[ad].getStreetSuffix() != null) addressLine += " " + addr[ad].getStreetSuffix();
				if (addr[ad].getStreetSuffixdirection() != null) addressLine += " " + addr[ad].getStreetSuffixdirection();
				/*Get city,state,zip
				if(addr[ad].getCity() != null) addressLine += ", " + addr[0].getCity();
				if(addr[ad].getState() != null) addressLine += ", " + addr[0].getState();
				if(addr[ad].getZip() != null) addressLine += " " + addr[0].getZip(); */

				//check for primary if getPrimary = "Y"
				if (getPrimary.equals("Yes")) {
					if (addr[ad].getPrimaryFlag() == "Y") {
						logDebug("Sending Primary Address");
						return addressLine;
					}
				}
				else {
					logDebug("Adding " + [ad] + " to array");
					addressLineArray.push(addressLine);
				}

			}
		}
		else
			return false;

		if (addressLineArray.length > 0)
			return addressLineArray[0];
	}
	else
		return false;

	/*--------------------------------------------------------------------------------------------/
	|  Email Primary LP Functions (Start)
	/----------------------------------------------------------------------------------------------*/
	function emailPrimaryLP(emailSubject, emailMessage) {
		recLicProfArray = getLicenseProfessional(capId);

		if (recLicProfArray != null)
			for (recLic in recLicProfArray) {
				var recLP = "";

				recLP = recLicProfArray[recLic];

				if (recLP.getPrintFlag() != "Y")
					continue;

				recLPEmail = recLP.getEmail();

				if (recLPEmail != null)
					email(recLPEmail, "noreply@charlottefl.com", emailSubject, emailMessage);
			}
	}
	/*----------------------------------------------------------------------------------------------/
	|  Email Primary LP Functions (End)
	/----------------------------------------------------------------------------------------------*/

}


/*----------------------------------------------------------------------------------------------/
|  Inspection Functions (Begin)  KL/20160920
/----------------------------------------------------------------------------------------------*/

function lastInspEmail(myCapID, insp2Cinspheck) {
	var myCapId = aa.cap.getCapID(myCapID);
	var myInspType = insp2Cinspheck;
	if (myCapId.getSuccess()) {
		myCap = myCapId.getOutput();
		var capIDString = myCap.getCustomID();
		var getResult = aa.inspection.getInspections(myCap);
		if (getResult.getSuccess()) {
			var list = getResult.getOutput();
			var lastInsp = "";
			for (ei in list) {
				var inspType = list[ei].getInspectionType();
				var inspStatus = list[ei].getInspectionStatus();
				var inSpector = list[ei].getInspector();
				var inspSched = list[ei].getScheduledDate();
				var cap2 = list[ei].getCapID();
				var inspID = list[ei].getIdNumber();
				if (inspSched != null) {
					var inspSched = dateFormatted(inspSched.getMonth(), inspSched.getDayOfMonth(), inspSched.getYear(), "MM-DD-YYYY");
				} else {
					var inspSched = "N/A"
				}
				if (inspType == insp2Cinspheck && inspStatus != "Pending") {
					if (inspStatus.length) {
						var lastInsp = inSpector;
					}
				}
			}
		}
		var nameArray = new Array();
		nameArray = String(lastInsp).split("/");
		var inspTor2 = nameArray[6];
		var nameArray2 = new Array();
		nameArray2 = String(inspTor2).split(" ");
		var firstname = nameArray2[0]; var lastname = nameArray2[1];
		var lastInspObj = aa.person.getUser(firstname, "", lastname).getOutput();
		var lastInspU = lastInspObj.getUserID();
		var userEml = lastInspObj.getEmail();
		return (userEml);
	}
}


function getMyLastInsp(insp2Cinspheck, myCapID) {
	var myCapId = aa.cap.getCapID(myCapID);
	var myInspType = insp2Cinspheck;
	if (myCapId.getSuccess()) {
		myCap = myCapId.getOutput();
		myCobj = aa.cap.getCap(myCap).getOutput();
		var capIDString = myCap.getCustomID();
		var getResult = aa.inspection.getInspections(myCap);
		var myInsp2 = "n/a";

		if (getResult.getSuccess()) {
			var list = getResult.getOutput();
			var lastInsp = "";
			for (ei in list) {
				var inspType = list[ei].getInspectionType();
				if (inspType == myInspType) {

					var inspStatus = list[ei].getInspectionStatus();
					var inSpector = list[ei].getInspector();
					aa.print(inspType + " inspector: " + inSpector);
					if (inSpector != "") { var myInsp2 = inSpector }
				}
			}
		}
	}
	return myInsp2;
}

function myfeeAmountExcept(checkCapId) {
	var checkStatus = false;
	var exceptArray = new Array();
	//get optional arguments 
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			exceptArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(checkCapId);
	if (feeResult.getSuccess()) { var feeObjArr = feeResult.getOutput(); }
	else { logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }

	for (ff in feeObjArr)
		if (!checkStatus || !exists(feeObjArr[ff].getFeeCod(), exceptArray))
			feeTotal += feeObjArr[ff].getFee()

	return feeTotal;
}

function getInspBFStat(ioCap) {
	var myCnt = 0
	var myCapId = aa.cap.getCapID(ioCap);

	if (myCapId.getSuccess()) {
		myCap = myCapId.getOutput();
		myCobj = aa.cap.getCap(myCap).getOutput();
		var CapTypeResult = myCobj.getCapType();
		var capIDString = myCap.getCustomID();
		var CapTypeResult = myCobj.getCapType();
		var myGroup = CapTypeResult.getGroup();
		var myType = CapTypeResult.getType();
		var mySubType = CapTypeResult.getSubType();
		var myCat = CapTypeResult.getCategory();
		var getResult = aa.inspection.getInspections(myCap);
		if (getResult.getSuccess()) {
			var list = getResult.getOutput();
			for (ei in list) {
				var inspType = list[ei].getInspectionType();
				var inspStatus = list[ei].getInspectionStatus();
				var inSpector = list[ei].getInspector();
				var inspSched = list[ei].getScheduledDate()
				var cap2 = list[ei].getCapID()
				if (inspType == "Building Final") {
					myCnt = myCnt + 1
				}
			}
		}
	}
	if (myCnt > 0) {
		return true
	} else {
		return false
	}
}



function checkForInsp(capId) {
	var inspSkip = false;
	var inspTyp2SkipArr = new Array();

	if (arguments.length > 1) {
		inspSkip = true;
		for (var i = 1; i < arguments.length; i++) {
			inspTyp2SkipArr.push(arguments[i]);
		}
	}

	var inspsObj = aa.inspection.getInspections(capId);
	if (inspsObj.getSuccess()) {
		var inspsList = inspsObj.getOutput();
	}
	else {
		logDebug("**ERROR: getting inspection items: " + inspsObj.getErrorMessage());
		return false;
	}

	for (insp in inspsList) {
		if ((inspsList[insp].getInspectionStatus() == 'Scheduled' || inspsList[insp].getInspectionStatus() == 'Pending') && (!inspSkip || !exists(inspsList[insp].getInspectionType(), inspTyp2SkipArr))) {
			return true;
		}
	}
	return false;
}


/*----------------------------------------------------------------------------------------------/
|  Inspection Functions (End)
/----------------------------------------------------------------------------------------------*/



/*----------------------------------------------------------------------------------------------/
|  Expired LP insurance notification 6/27/2018 kl
/----------------------------------------------------------------------------------------------*/

function GetLicInfo(myLicNo) {
	var lpArr = GetLicModel(myLicNo);
	if (lpArr != false) {
		for (x in lpArr) {
			var thisLp = lpArr[x];
			var licStatusC = thisLp.getAuditStatus();
			if (licStatusC == "A") {
				var myInsInfo = GetLicInsInfo(thisLp, myLicNo);
				return myInsInfo;
			} else {
				return "This is not a valid license.";
			}
		}
	} else {
		return "This is not a valid license.";
	}
}

function GetLicModel(myLicNo) {
	var myInfo = "";
	var LicNo = myLicNo;
	var lpModel = aa.licenseScript.getRefLicensesProfByLicNbr("BOCC", LicNo);
	if (lpModel.getSuccess()) {
		var lpModelArr = lpModel.getOutput();
		if (lpModelArr != null) {
			return lpModelArr;
		} else {
			return false;
		}
	}
}

function GetLicInsInfo(thisLp, myLicNo) {
	var WCexFlag = 0
	var licType = thisLp.getLicenseType();
	if (licType == "OWNER BUILDER" || licType == "UNLICENSED CONTRACTOR" || licType == "COUNTY EMPLOYEE") {
		aa.abortScript();
	}
	var bizName = thisLp.getBusinessName();
	var licExpDt = thisLp.getLicenseExpirationDate();
	var licExpDtF = convertDate(licExpDt);
	var insExpDt = thisLp.getInsuranceExpDate();
	var insExpDtF = convertDate(insExpDt);
	var myAttributes = thisLp.getAttributes();


	if (myAttributes == null) {
		logDebug("no attributes to print");
	} else {
		var myPemModel = myAttributes.get("PeopleAttributeModel");
		var myLenArraty = myPemModel.toArray();
		var mylen = myLenArraty.length;
		for (var i = 0; i < mylen; i++) {
			var contactAttribute = myLenArraty[i];
			var capid = contactAttribute.getCapID();
			var name = contactAttribute.getAttributeName();
			var values = contactAttribute.getAttributeValue();
			if ((name == "WC_Exempt" || name == "WC_EXEMPT") && values != "N") {
				WCexFlag = 1;
			}
			if ((name == "WC_Exempt_Exp_Date" || name == "WC_EXEMPT_EXP_DATE") && (values != null)) {
				var myWCexemptExpDt2 = values;
				var myWCexemptExpDt = new Date(myWCexemptExpDt2);
			}
			if ((name == "WC_Insur_Exp_Date" || name == "WC_INSUR_EXP_DATE") && values != null) {
				var myWCexpDt2 = values;
				var myWCexpDt = new Date(myWCexpDt2);
			}
		}
		var sysDate = aa.date.getCurrentDate();
		var todayF = convertDate(sysDate);
		if (todayF < licExpDtF) {
			var licFlag = true;
		} else {
			var licFlag = false;
		}
		if (todayF < insExpDtF) {
			var insFlag = true;
		} else {
			var insFlag = false;
		}
		if (WCexFlag == 0) {
			if (todayF < myWCexpDt) {
				var WCflag = true;
			} else {
				var WCflag = false;
			}
		} else {
			if (todayF < myWCexemptExpDt) {
				var WCflag = true;
			} else {
				var WCflag = false;
			}
		}
		if (licFlag == false || insFlag == false || WCflag == false) {
			var myInfo1 = "";
			var myInfo2 = "";
			var myInfo3 = "";
			if (licFlag == false) {
				myInfo1 = " License expired.";  //insurance and/or license expired.
			}
			if (insFlag == false) {
				myInfo2 = " Insurance expired.";  //insurance and/or license expired.
			}
			if (WCflag == false) {
				myInfo3 = " WC insurance expired.";  //insurance and/or license expired.
			}
			var myInfo = [true, myLicNo + myInfo1 + myInfo2 + myInfo3];
			aa.print(myInfo[1]);
			logDebug(myInfo[1]);
			return myInfo;
		} else {
			aa.abortScript();
		}
	}
}






/*----------------------------------------------------------------------------------------------/
|  DRI Function (Start)
/----------------------------------------------------------------------------------------------*/

function isDRIexpir(capId) {
	var capId = aa.cap.getCapID(capId);
	if (capId.getSuccess()) {
		capId = capId.getOutput();
	} else {
		aa.print(capId.getErrorMessage());
		aa.abortScript();
	}
	var capIDString = capId.getCustomID();

	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	var Parcels = capParcelResult.getOutput().toArray();
	var parcelObj = Parcels[0];
	var parcelNumber = parcelObj.getParcelNumber();

	var proxType = "DRI";
	var myProx = myproximityInfo("AGIS_CHARCO", proxType, 1);
	if (myProx != undefined && myProx != 0) {
		if (proxType == "DRI") {
			var myType = "Project Name";
			var asi = getAppSpecific(myType, capId);
			if (asi == undefined) {
				return false;
				aa.abortScript;
			}
			var asiCapId = aa.cap.getCapID(asi);
			if (asiCapId.getSuccess()) {
				var capIdASI = asiCapId.getOutput()
				var capIDStringASI = capIdASI.getCustomID();
				var appSpecificInfo = new Array();
				var appSpecificInfo = aa.appSpecificInfo.getByCapID(capIdASI);
				if (appSpecificInfo.getSuccess()) {
					var fAppSpecInfoObj = appSpecificInfo.getOutput();
					for (loopk in fAppSpecInfoObj)
						if (fAppSpecInfoObj[loopk].getCheckboxDesc() == "EXPIRATION DATE") {  //NOTE:  in Prod = "Expiration Date"
							var myDateFlag = 0
							var sysDate = aa.date.getCurrentDate();
							myDt = "";
							myDt = fAppSpecInfoObj[loopk].getChecklistComment()
							if (myDt == null) {
								myDt = "01/01/2050";
								myDateFlag = 1;
							}
							myDt = aa.date.parseDate(myDt);
							if (myDateFlag == 0) {
								var myDtMMDDYYYY = dateFormatted(myDt.getMonth(), myDt.getDayOfMonth(), myDt.getYear(), "MM/DD/YYYY");
							} else {
								var myDtMMDDYYYY = null
							}
							var filterDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "MM/DD/YYYY");
							myDt = convertDate(myDt);
							sysDate = convertDate(sysDate);
							if (myDt > sysDate) {
								return false;
							} else {
								return true;
							}
						}
				} else {
					aa.print("This CAP has not been found.");
					aa.abortScript();
				}
			}
		}

	} else {
		if (myProx == undefined) {
			return false;
		}
		else {
			return false;
		}
	}

	function myproximityInfo(svc, layer, numDistance) {
		var distanceType = "feet"
		if (arguments.length == 4) distanceType = arguments[3];
		var bufferTargetResult = aa.gis.getGISType(svc, layer);
		if (bufferTargetResult.getSuccess()) {
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(layer + "_ID");
		}
		else { aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false }
		var gisObjResult = aa.gis.getCapGISObjects(capId);
		if (gisObjResult.getSuccess())
			var fGisObj = gisObjResult.getOutput();
		else { aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false }
		for (a1 in fGisObj) {
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else { aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is:  missing " + layer + " / " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return 0 }
			for (a2 in proxArr) {
				var proxObj = proxArr[a2].getGISObjects();
				for (z1 in proxObj) {
					var v = proxObj[z1].getAttributeValues();
					for (g in v) {
						myName = v[g]
					}
					return myName;
				}

			}
		}
	}

}


/*----------------------------------------------------------------------------------------------/
|  DRI Function (End)
/----------------------------------------------------------------------------------------------*/


/*----------------------------------------------------------------------------------------------/
|  Check for extension (begin)
/----------------------------------------------------------------------------------------------*/


function mEXTENDpd(myCapID) {
	var meFlag = 0;
	var feeA = feesPaid(myCapID);
	var sysDate = aa.date.getCurrentDate();
	var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "MM-DD-YYYY");

	for (x in feeA) {
		thisFee = feeA[x];
		if (thisFee.code == "M-EXTEND" || thisFee.code == "M-EXTEND2") {
			if (thisFee.status == "INVOICED") {
				if (thisFee.amountPaid > 50) {
					if (thisFee.applyDateF == sysDateMMDDYYYY) {
						myResult = "Fee: " + thisFee.code + " status: " + thisFee.status + " amt pd: $" + thisFee.amountPaid + " on " + thisFee.applyDateF;
						meFlag++

					}
				}
			}
		}
	}

	if (meFlag > 0) {
		return true;
	} else {
		return false;
	}
}

function feesPaid() {
	var itemCap = capId;
	if (arguments.length > 0) {
		ltcapidstr = arguments[0];
		if (typeof (ltcapidstr) == "string") {
			var ltresult = aa.cap.getCapID(ltcapidstr);
			if (ltresult.getSuccess())
				itemCap = ltresult.getOutput();
			else { logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " + ltresult.getErrorMessage()); return false; }
		}
		else
			itemCap = ltcapidstr;
	}
	var feeArr = new Array();
	var feeResult = aa.fee.getFeeItems(itemCap);
	if (feeResult.getSuccess()) { var feeObjArr = feeResult.getOutput(); }
	else { logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage()); return false; }
	for (ff in feeObjArr) {
		fFee = feeObjArr[ff];
		var myFee = new FeeObj();
		var amtPaid = 0;

		var pfResult = aa.finance.getPaymentFeeItems(itemCap, null);
		if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			for (ij in pfObj)
				if (fFee.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
					amtPaid += pfObj[ij].getFeeAllocation();
		}

		myFee.sequence = fFee.getFeeSeqNbr();
		myFee.code = fFee.getFeeCod();
		myFee.sched = fFee.getF4FeeItemModel().getFeeSchudle();
		myFee.description = fFee.getFeeDescription();
		myFee.unit = fFee.getFeeUnit();
		myFee.amount = fFee.getFee();
		myFee.amountPaid = amtPaid;
		if (fFee.getApplyDate()) myFee.applyDate = convertDate(fFee.getApplyDate());
		if (fFee.getApplyDate()) myFee.applyDateF = dateFormatted(fFee.getApplyDate().getMonth(), fFee.getApplyDate().getDayOfMonth(), fFee.getApplyDate().getYear(), "MM-DD-YYYY");
		if (fFee.getEffectDate()) myFee.effectDate = convertDate(fFee.getEffectDate());
		if (fFee.getExpireDate()) myFee.expireDate = convertDate(fFee.getExpireDate());
		myFee.status = fFee.getFeeitemStatus();
		myFee.period = fFee.getPaymentPeriod();
		myFee.display = fFee.getDisplay();
		myFee.accCodeL1 = fFee.getAccCodeL1();
		myFee.accCodeL2 = fFee.getAccCodeL2();
		myFee.accCodeL3 = fFee.getAccCodeL3();
		myFee.formula = fFee.getFormula();
		myFee.udes = fFee.getUdes();
		myFee.UDF1 = fFee.getUdf1();
		myFee.UDF2 = fFee.getUdf2();
		myFee.UDF3 = fFee.getUdf3();
		myFee.UDF4 = fFee.getUdf4();
		myFee.subGroup = fFee.getSubGroup();
		myFee.calcFlag = fFee.getCalcFlag();
		myFee.calcProc = fFee.getFeeCalcProc();
		myFee.version = fFee.getF4FeeItemModel().getVersion();

		feeArr.push(myFee);
	}

	return feeArr;
}

function FeeObj() {
	this.sequence = null;
	this.code = null;
	this.description = null;  // getFeeDescription()
	this.unit = null; //  getFeeUnit()
	this.amount = null; //  getFee()
	this.amountPaid = null;
	this.applyDate = null; // getApplyDate()
	this.effectDate = null; // getEffectDate();
	this.expireDate = null; // getExpireDate();
	this.status = null; // getFeeitemStatus()
	this.recDate = null;
	this.period = null; // getPaymentPeriod()
	this.display = null; // getDisplay()
	this.accCodeL1 = null; // getAccCodeL1()
	this.accCodeL2 = null; // getAccCodeL2()
	this.accCodeL3 = null; // getAccCodeL3()
	this.formula = null; // getFormula()
	this.udes = null; // String getUdes()
	this.UDF1 = null; // getUdf1()
	this.UDF2 = null; // getUdf2()
	this.UDF3 = null; // getUdf3()
	this.UDF4 = null; // getUdf4()
	this.subGroup = null; // getSubGroup()
	this.calcFlag = null; // getCalcFlag();
	this.calcProc = null; // getFeeCalcProc()
	this.auditDate = null; // getAuditDate()
	this.auditID = null; // getAuditID()
	this.auditStatus = null; // getAuditStatus()
	this.version = null; // getVersion()
}



function checkMEXTEND(myCapId) {
	var myCap = aa.cap.getCapID(myCapId);
	if (myCap.getSuccess()) {
		myCap = myCap.getOutput();
	} else {
		return false
		aa.abortScript();
	}
	var capIDString = myCap.getCustomID();
	aat = aa.finance.getCashierAuditListByCapId(myCap, null).getOutput();
	var myFlag = 0;

	for (i in aat) {
		var MYgetAuditID = aat[i].getAuditID();
		var MYgetAuditStatus = aat[i].getAuditStatus();
		var MYgetAction = aat[i].getAction();
		var MYgetCashierID = aat[i].getCashierID();
		var MYgetFee = aat[i].getFee();
		var MYgetFeeCod = aat[i].getFeeCod();
		var MYgetFeeDescription = aat[i].getFeeDescription();
		var MYgetTranAmount = aat[i].getTranAmount();
		var MYgetTranDate = aat[i].getTranDate();
		if ((MYgetFeeCod == "M-EXTEND" || MYgetFeeCod == "M-EXTEND2") && MYgetAction == "Invoice FeeItem") {
			myFlag++;
		}
		if ((MYgetFeeCod == "M-EXTEND" || MYgetFeeCod == "M-EXTEND2") && MYgetAction == "Payment Applied") {
			myFlag--;
		}
	}
	if (myFlag <= 0) {
		return false
	} else {
		return true
	}
}


function checkMEXTENDB(myCapId) {
	var sysDate = aa.date.getCurrentDate();
	var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth() - 1, sysDate.getYear(), "MM-DD-YYYY");

	var myCap = aa.cap.getCapID(myCapId);
	if (myCap.getSuccess()) {
		myCap = myCap.getOutput();
	} else {
		aa.abortScript();
	}
	var capIDString = myCap.getCustomID();
	aat = aa.finance.getCashierAuditListByCapId(myCap, null).getOutput();
	var myFlag = 0;

	for (i in aat) {
		var MYgetAuditID = aat[i].getAuditID();
		var MYgetAuditStatus = aat[i].getAuditStatus();
		var MYgetAction = aat[i].getAction();
		var MYgetCashierID = aat[i].getCashierID();
		var MYgetFee = aat[i].getFee();
		var MYgetFeeCod = aat[i].getFeeCod();
		var MYgetFeeDescription = aat[i].getFeeDescription();
		var MYgetTranAmount = aat[i].getTranAmount();
		var MYgetTranDate = aat[i].getTranDate();
		if (MYgetTranDate != null) {
			var MYgetTranDate = convertDate(aat[i].getTranDate());
			var MYgetTranDateYYYY = dateFormatted(aat[i].getTranDate().getMonth(), aat[i].getTranDate().getDayOfMonth(), aat[i].getTranDate().getYear(), "MM-DD-YYYY");
		} else { var MYgetTranDate = ""; }
		if ((MYgetFeeCod == "M-EXTEND" || MYgetFeeCod == "M-EXTEND2") && MYgetAction == "Payment Applied") {
			if (MYgetTranDateYYYY == sysDateMMDDYYYY) {
				return true
				myFlag = 1
			}
		}
	}
	if (myFlag == 0) {
		return false
	}
}


/*----------------------------------------------------------------------------------------------/
|  Check for extension (End)
/----------------------------------------------------------------------------------------------*/

function addConditionToCapsWithMatchingParcel2() {
	logDebug("function: BEGIN function addConditionToCapsWithMatchingParcel");
	logDebug("function: Get Parcel on CAP");

	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()) { var Parcels = capParcelResult.getOutput().toArray(); }
	else { logDebug("**ERROR: getting parcels by cap ID: " + capParcelResult.getErrorMessage()); return false; }

	for (zz in Parcels) {
		var ParcelValidatedNumber = Parcels[zz].getParcelNumber();

		logDebug("Looking at parcel " + ParcelValidatedNumber);

		logDebug("function: Get CAPs by Parcel");
		capResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber, null);
		if (capResult.getSuccess()) {
			addrCaps = capResult.getOutput();

			for (addrCap in addrCaps) {
				logDebug("Found CAP " + addrCaps[addrCap].getCustomID() + " with matching address.  Checking CAP Type...");
				capResult2 = aa.cap.getCap(addrCaps[addrCap].getID1(), addrCaps[addrCap].getID2(), addrCaps[addrCap].getID3());
				if (capResult2.getSuccess()) {
					cap2 = capResult2.getOutput();
					logDebug("Cap Type is " + cap2.getCapType().toString());
					logDebug("Cap Status is " + cap2.getCapStatus() + "");

					if (addrCaps[addrCap].getCustomID().toString().equals(capIDString)) {
						logDebug("Permit # in result matches the permit # just created, ignore this permit and continue");
					}
					else {
						if (cap2.getCapType().toString().equals(appTypeString) && !matches(cap2.getCapStatus() + "", "NULL", "Abatement Complete", "Applicant Request", "Application Canceled", "C of Completion Issued", "C of O Issued", "COED", "Closed", "Closed Out", "Complete", "Compliant", "Dismissed", "Exemption", "External Referral", "Final Approval", "Final Approved", "Final Plat Recorded", "Final Review", "Finaled", "In Compliance", "Not Required", "Plat Book Page Recorded", "SUSPEND", "Temp C of O Issued", "Void", "Voided", "Withdrawn")) {
							logDebug("Found matching cap type with valid status, adding condition.");
							addStdCondition("CC PERMIT", "Open Record at Same Address");
							break;
						}
					}
				}
				else {
					logDebug("function: Error calling getCAP to convert to CapScriptModel object: " + capResult2.getError());
				}
			}
		}
		else {
			logDebug("function: Error getting CAPs with matching parcel: " + capResult.getErrorMessage());
		}
	}
	logDebug("function: END function addConditionToCapsWithMatchingParcel");
}


/*--------------------------------- 
   NEW DRI FUNCTIONS
----------------------------------*/

function ckCapDRI(capCK) {
	var capId = aa.cap.getCapID(capCK);
	if (capId.getSuccess()) {
		capId = capId.getOutput();
	} else {
		aa.print(capId.getErrorMessage());
		aa.abortScript();
	}
	var capIDString = capId.getCustomID();

	mycap = aa.cap.getCap(capId).getOutput();
	var capStatus = mycap.getCapStatus();
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	var Parcels = capParcelResult.getOutput().toArray();
	var parcelObj = Parcels[0];
	var parcelNumber = parcelObj.getParcelNumber();

	var myProx = proximityInfodri("AGIS_CHARCO", "DRI", 1, capId);
	if (myProx != undefined && myProx != 0) {
		return getDRImatch(myProx);

	} else {
		if (myProx == undefined) {
			return true;
		}
		else {
			return true;
		}
	}
}

function proximityInfodri(svc, layer, numDistance, pCap) {
	var capId = pCap;
	var distanceType = "feet";
	if (arguments.length == 4) distanceType = arguments[3];
	var bufferTargetResult = aa.gis.getGISType(svc, layer);
	if (bufferTargetResult.getSuccess()) {
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(layer + "_ID");
	}
	else { aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false; }
	var gisObjResult = aa.gis.getCapGISObjects(capId);
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else { aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false; }
	for (a1 in fGisObj) {
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else { aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is:  missing " + layer + " / " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return 0; }
		for (a2 in proxArr) {
			var proxObj = proxArr[a2].getGISObjects();
			for (z1 in proxObj) {
				var v = proxObj[z1].getAttributeValues();
				for (g in v) {
					myName = v[g]
				}
				return myName
			}

		}
	}
}


function getDRImatch(DRIname) {

	driResult = aa.cap.getByAppType("Planning", "Growth Mgmt", "DRI", "NA");

	var mySearchStr = DRIname.toUpperCase();

	if (driResult.getSuccess()) {
		driArray = driResult.getOutput();
	}
	var DRIflag = 0;

	for (x in driArray) {
		capObj = driArray[x];
		var capId = capObj.getCapID();
		var altCapId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
		var capIDString = altCapId.getCustomID();
		var myAppStat = capObj.getCapStatus();
		var myCapDes = aa.cap.getCapWorkDesByPK(capId);
		var workDescObj = myCapDes.getOutput();
		var workDesc = workDescObj.getDescription().toUpperCase();
		var myDummyPROX = workDesc;

		if (myAppStat == "Closed") {
			var result = myDummyPROX.search(mySearchStr);
			if (result == 0) {
				DRIflag--;
			}
		}
		if (myAppStat == null) {
			var myDummyPROX = workDesc;
			var result = myDummyPROX.search(mySearchStr);
			if (result == 0) {
				DRIflag++;
			}
		}
	}

	if (DRIflag >= 0) {
		return true;
	} else {
		return false;
	}
}



function addConditionToCapsWithMatchingParcelACA() {
	logDebug("function: BEGIN function addConditionToCapsWithMatchingParcel");
	logDebug("function: Get Parcel on CAP");

	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()) { var Parcels = capParcelResult.getOutput().toArray(); }
	else { logDebug("**ERROR: getting parcels by cap ID: " + capParcelResult.getErrorMessage()); return false; }

	for (zz in Parcels) {
		var ParcelValidatedNumber = Parcels[zz].getParcelNumber();

		logDebug("Looking at parcel " + ParcelValidatedNumber);

		logDebug("function: Get CAPs by Parcel");
		capResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber, null);
		if (capResult.getSuccess()) {
			addrCaps = capResult.getOutput();

			for (addrCap in addrCaps) {
				logDebug("Found CAP " + addrCaps[addrCap].getCustomID() + " with matching address.  Checking CAP Type...")
				capResult2 = aa.cap.getCap(addrCaps[addrCap].getID1(), addrCaps[addrCap].getID2(), addrCaps[addrCap].getID3());
				if (capResult2.getSuccess()) {
					cap2 = capResult2.getOutput();
					logDebug("Cap Type is " + cap2.getCapType().toString());
					logDebug("Cap Status is " + cap2.getCapStatus() + "");

					//RV  - 02/01/2010 - Make sure the AltID is not the one that was just added
					if (addrCaps[addrCap].getCustomID().toString().equals(capIDString)) {
						logDebug("Permit # in result matches the permit # just created, ignore this permit and continue");
					}
					else {
						if (cap2.getCapType().toString().equals(appTypeString) && !matches(cap2.getCapStatus() + "", "NULL", "Abatement Complete", "Applicant Request", "Application Canceled", "C of Completion Issued", "C of O Issued", "Closed", "Closed Out", "Complete", "Compliant", "Dismissed", "Exemption", "External Referral", "Expired", "Final Approval", "Final Approved", "Final Plat Recorded", "Final Review", "Finaled", "In Compliance", "Not Required", "Plat Book Page Recorded", "Temp C of O Issued", "Void", "Voided", "Withdrawn")) {
							logDebug("Found matching cap type with valid status, adding condition.");
							return true;
							break;  //exit for loop
						}
					}
				}
				else {
					logDebug("function: Error calling getCAP to convert to CapScriptModel object: " + capResult2.getError());
					return false;
				}
			} // End CAP FOR loop
		}
		else {
			logDebug("function: Error getting CAPs with matching parcel: " + capResult.getErrorMessage());
			return false;
		}
	} // End parcel FOR loop

	logDebug("function: END function addConditionToCapsWithMatchingParcel");
	return false;
}

