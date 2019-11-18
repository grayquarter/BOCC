if (inspType == 'Electric Final') {
    var ElecFin = checkInspectionResult('Electric Final', 'Scheduled');
    if (ElecFin == true) {

        if (appMatch('Building/Construction/Commercial/Multi-Family')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/DCA Home')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Duplex')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Duplex-Babcock')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Mobile Home')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Modular')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Single Family')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Single Family-Babcock')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Townhouse')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }

        if (appMatch('Building/Construction/Residential/Townhouse-Babcock')) {
            editAppSpecific('Service Start Date', dateAdd(null, 0));
        }
    }
}
