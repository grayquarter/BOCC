//CTRCA ///


editAppSpecific('Expiration Date', dateAdd(null, 180));
if (proximity('AGIS_CHARCO', 'Sea Turtle Lighting Zones', 1)) {
    addStdCondition('CC PERMIT', 'Sea Turtle Monitoring');
    //replaced branch(SeaTurtleMonitor)
    seaTurtleMonitor();
}

