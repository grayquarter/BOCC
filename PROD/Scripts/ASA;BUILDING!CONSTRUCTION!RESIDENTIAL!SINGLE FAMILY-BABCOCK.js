//ASA:BUILDING/CONSTRUCTION/RESIDENTIAL/SINGLE FAMILY-BABCOCK

var mCap = aa.cap.getCap(capId).getOutput();
var myMatch = capIDString.indexOf('TMP') !== -1;

if (!mCap.isCreatedByACA() && currentUserID.substr(0, 6) != 'PUBLIC' && (myMatch == false)) {
    scheduleInspection('Babcock Final', 100, 'AMY.WICKS@KIMLEY-HORN.COM', null, 'scheduled via script');
}

if (!mCap.isCreatedByACA() && currentUserID.substr(0, 6) != 'PUBLIC' && (myMatch == false)) {
    scheduleInspection('Babcock-Landscape', 100, 'AMY.WICKS@KIMLEY-HORN.COM', null, 'scheduled via script');
}
