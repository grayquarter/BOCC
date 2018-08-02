
relatedCapID = aa.cap.getCap(arrCAPS[xy]).getOutput();
oFileDate = relatedCapID.getFileDate();
strFileDate = dateFormatted(oFileDate.getMonth(), oFileDate.getDayOfMonth(), oFileDate.getYear(), '');
if (DateWithinXyears(strFileDate, 5)) {
	constructionCost = getAppSpecific('Construction Cost', arrCAPS[xy]);
	if (constructionCost != '') {
		sumVariable = sumVariable + parseFloat(constructionCost);
	}
}
