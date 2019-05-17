//PRB
comment('CC_240_PaymentBefore started');
showMessage = false;
if (PaymentMethod.equals('Cash')) {
    bNotFound = false;
    serviceURL = lookup('CASHIER_WEB_SERVICE', PaymentRegisterId);
    if (serviceURL == undefined)
        bNotFound = true;
    if (bNotFound)
        showMessage = true;
        comment('Web Service URL not found in standard choice CASHIER_WEB_SERVICE for Terminal #: ' + PaymentRegisterId);
    if (bNotFound)
        cancel = true;
    if (!bNotFound)
        arrServiceURL = serviceURL.split('|');
    bUserFound = true;
    if (!bNotFound && arrServiceURL.length < 2)
        bUserFound = false;
    if (!bNotFound && bUserFound)
        userAssigned = arrServiceURL[1].toUpperCase();
    if (!bNotFound && bUserFound)
        if (currentUserID == userAssigned)
            serviceURL = arrServiceURL[0];
    if (!bNotFound && bUserFound)
        if (currentUserID != userAssigned)
            showMessage = true;
            comment('User: ' + currentUserID + ' is not assigned to Terminal #: ' + PaymentRegisterId + ' in standard choice CASHIER_WEB_SERVICE');
    if (!bNotFound && bUserFound)
        if (currentUserID != userAssigned)
            cancel = true;
    if (!bNotFound && bUserFound)
        if (currentUserID != userAssigned)
            bNotFound = true;
    serviceStatus = 'ERROR';
    if (!bNotFound)
    //start replaced branch: PRB:WEB_SERVICE:CHECK_STATUS
    {
        xmlCheckDrawerStatus = '';
        xmlCheckDrawerStatus += "<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope' xmlns:char='http://accela.com/CharlotteCounty/'>";
        xmlCheckDrawerStatus += '   <soap:Header/>';
        xmlCheckDrawerStatus += '   <soap:Body>';
        xmlCheckDrawerStatus += '      <char:CheckDrawerStatus/>';
        xmlCheckDrawerStatus += '   </soap:Body>';
        xmlCheckDrawerStatus += '</soap:Envelope>';
        serviceStatus = aa.util.httpPostToSoapWebService(serviceURL, xmlCheckDrawerStatus, '', '', 'http://accela.com/CharlotteCounty/CheckDrawerStatus').getOutput();
        if (serviceStatus == null)
            serviceStatus = 'WSERROR';
        if (serviceStatus != 'WSERROR')
            serviceStatus = getNode(serviceStatus, 'CheckDrawerStatusResult');

    }
    //end replaced branch: PRB:WEB_SERVICE:CHECK_STATUS;
    logDebug('Check Status Web Service call returns: ' + serviceStatus);
    bError = false;
    bContinue = true;
    if (serviceStatus == 'ERROR' || serviceStatus == 'WSERROR')
        bError = true;
    if (!bNotFound && bError && serviceStatus == 'ERROR')
        showMessage = true;
        comment('Error communicating with Cash Drawer, Web Service returns ' + serviceStatus);
    if (!bNotFound && bError && serviceStatus == 'WSERROR')
        showMessage = true;
        comment('Error communicating with Cash Drawer, no response from Web Service');
    if (!bNotFound && bError)
        bContinue = false;
    if (!bNotFound && bContinue && serviceStatus == 'OPEN')
        bContinue = false;
    serviceStatus2 = 'ERROR';
    if (!bNotFound && bContinue && serviceStatus == 'CLOSED')
    //start replaced branch: PRB:WEB_SERVICE:OPEN_DRAWER
    {
        xmlOpenDrawer = '';
        xmlOpenDrawer += "<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope' xmlns:char='http://accela.com/CharlotteCounty/'>";
        xmlOpenDrawer += '   <soap:Header/>';
        xmlOpenDrawer += '   <soap:Body>';
        xmlOpenDrawer += '      <char:OpenDrawer/>';
        xmlOpenDrawer += '   </soap:Body>';
        xmlOpenDrawer += '</soap:Envelope>';
        serviceStatus2 = aa.util.httpPostToSoapWebService(serviceURL, xmlOpenDrawer, '', '', 'http://accela.com/CharlotteCounty/OpenDrawer').getOutput();
        if (serviceStatus2 == null)
            serviceStatus2 = 'WSERROR';
        if (serviceStatus2 != 'WSERROR')
            serviceStatus2 = getNode(serviceStatus2, 'OpenDrawerResult');

    }
    //end replaced branch: PRB:WEB_SERVICE:OPEN_DRAWER;
    if (!bNotFound && bContinue && serviceStatus == 'CLOSED')
        logDebug('Open Drawer Web Service call returns: ' + serviceStatus2);
    if (bContinue && (serviceStatus2 == 'ERROR' || serviceStatus2 == 'WSERROR'))
        bError = true;
    if (!bNotFound && bContinue && bError && serviceStatus2 == 'ERROR')
        showMessage = true;
        comment('Error Opening Cash Drawer, Web Service returns ' + serviceStatus2);
    if (!bNotFound && bContinue && bError && serviceStatus2 == 'WSERROR')
        showMessage = true;
        comment('Error Opening Cash Drawer, no response from Web Service');
    if (bError)
        cancel = true;
}
