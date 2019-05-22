//ASA:BUILDING/CONSTRUCTION//

var mCap = aa.cap.getCap(capId).getOutput();
var frACA = mCap.isCreatedByACA();

//replaced branch(SeaTurtle)
seaTurtle();

if (frACA == false) {
    if (getGISInfo('AGIS_CHARCO', 'DRI', 'NAME') == 'Sandhill') {
        var ahUser = "ShaoJ";
        var adHocTaskName = "Sandhill DRI Review";
        customAddAdHocTask(capIDString, ahUser, adHocTaskName);
    }
}
