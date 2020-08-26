// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * This class is a helper class for the SAP-Graph-API
  */
 class SAPGraphHelper {

    /**
     * Gets color for adaptive card based on the provided SAP status code
       decide which color to use depending of the Sales Order status. Currently following stati are possible:
       SAP-Status-Code  SAP-Status-Text Adaptvecard-Color
       C                Completed       Good
       A                Open            Attention
       ""               Not Relevant    Default
       B                In Process      Accent
     */
    static getColorByStatusCode(statusCode) {
        var statusColor = '';
        switch (statusCode) {
        case 'C':
            statusColor = 'Good';
            break;
        case 'A':
            statusColor = 'Attention';
            break;
        case 'B':
            statusColor = 'Accent';
            break;
        default:
            statusColor = 'Default';
            break;
        }
        return statusColor;
    }
}

exports.SAPGraphHelper = SAPGraphHelper;
