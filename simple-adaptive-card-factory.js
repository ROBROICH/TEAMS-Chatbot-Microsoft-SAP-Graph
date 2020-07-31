// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {CardFactory } = require('botbuilder');

// Import AdaptiveCard content.


//
const VALUE_1 = "${value1}";
const VALUE_2 = "${value2}";
const VALUE_3 = "${value3}";



const WELCOME_TEXT = 'This bot will introduce you to Adaptive Cards. Type anything to see an Adaptive Card.';

class SimpleAdaptiveCardFactory {
    constructor() { 

        

    }


    async getSimpleAdaptiveCard(){
       
       //@ToDo replace hack with adaptive card templating:
       //https://www.npmjs.com/package/adaptivecards-templating
      
   
       return this.testCard;
   
   }

}



// var cardFactory = new SimpleAdaptiveCardFactory();

// var testCard = cardFactory.getSimpleAdaptiveCard();


module.exports.SimpleAdaptiveCardFactory = SimpleAdaptiveCardFactory;
