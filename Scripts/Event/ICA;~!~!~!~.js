//new InspectionCancelAfter event script 20180823 -KL
var inspectionList = aa.env.getValue("InspectionList");
var Product = aa.env.getValue("Product");
//comment("inspectionList = " + inspectionList);
//comment("Product = " + Product);

var InspArr = inspectionList.toArray();
var myCapID = InspArr[0].getCapID();
var myCustCapID = myCapID.getCustomID();
var myID = InspArr[0].getIdNumber();
//comment("myID = " + myID + " for " + myCustCapID);
var inspType = InspArr[0].getInspectionType();
var inspGroup = InspArr[0].getInspectionGroup();
createPendingInspection(inspGroup, inspType, myCapID);
