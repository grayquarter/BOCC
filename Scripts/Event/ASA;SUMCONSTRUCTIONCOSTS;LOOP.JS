
bProceed = false;
relatedCapID = aa.cap.getCap(arrCAPS[xy]).getOutput();
oFileDate = relatedCapID.getFileDate();
strFileDate = dateFormatted(oFileDate.getMonth(), oFileDate.getDayOfMonth(), oFileDate.getYear(), '');
if (DateWithinXyears(strFileDate, 5))
	bProceed = true;
if (bProceed)
	constructionCost = getAppSpecific('Construction Cost', arrCAPS[xy]);
if (bProceed)
	if (constructionCost != '')
		sumVariable = sumVariable + parseFloat(constructionCost);
