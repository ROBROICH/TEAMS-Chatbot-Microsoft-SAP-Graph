// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const itemsHeaderColumnItem = require('../adaptiveCards/itemsHeaderColumnItem.json');
const itemsHeaderColumnQuantity = require('../adaptiveCards/itemsHeaderColumnQuantity.json');
const itemsHeaderColumnNetPrice = require('../adaptiveCards/itemsHeaderColumnNetPrice.json');

/**
 * This class is a helper class for Adaptive Cards Manipulation
  */
class AdaptiveCardsHelper {
    /**
     * constructs the items table for the Sales Order Adaptive Card
     */
    static getItemsTable(salesOrderItems) {
        const itemsTable = [];

        const columnsTemplate = {
            type: 'Column',
            items: []
        };

        const itemTemplate = {
            type: 'TextBlock',
            weight: 'default',
            text: ''
        };

        const headerColumns = AdaptiveCardsHelper.getHeaderColumns();

        // loop through all header columns
        for (let i = 0; i < headerColumns.length; i++) {
            let columnName = '';
            const column = JSON.parse(JSON.stringify(columnsTemplate));
            column.items.push(headerColumns[i]);

            switch (headerColumns[i].id) {
            case 'productDescriptionColumn':
                columnName = 'productDescription';
                break;
            case 'quantityColumn':
                columnName = 'quantity';
                break;
            case 'netPriceColumn':
                columnName = 'netPrice';
                // TODO: show currency?
                break;
            default:
                // not supported.
                // TOOD: create some error handling for this case
                break;
            }

            // add texts to the table
            // for (let j = 0; j < salesOrderItems.length; j++) {
            //     const columnItem = JSON.parse(JSON.stringify(itemTemplate));
            //     columnItem.text = salesOrderItems[j][columnName];
            //     column.items.push(columnItem);
            // }

            itemsTable.push(column);
        }

        return itemsTable;
    }

    /**
     * returns all header columns
     */
    static getHeaderColumns() {
        // add all 3 headers
        const header = [];

        header.push(itemsHeaderColumnItem);
        header.push(itemsHeaderColumnQuantity);
        header.push(itemsHeaderColumnNetPrice);

        return header;
    }
}

exports.AdaptiveCardsHelper = AdaptiveCardsHelper;
