//IRSA:CODEENFORCEMENT///  refactored
//start replaced branch: CC_151_CE_InspResultAfter

comment('CC_151_CE_InspResultAfter Executing message');


if (inspResult.indexOf('Fail') > -1 || inspResult.indexOf('Partial') > -1 || inspResult.indexOf('Cancelled') > -1) {
    createPendingInspection(inspGroup, inspType);
}


//end replaced branch: CC_151_CE_InspResultAfter;
