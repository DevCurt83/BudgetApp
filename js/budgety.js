/* 
       -----------------------  PLAN OF ACTION  --------------------------------------
                -add event handler on tick btn .add__btn
                -collect data from input field(s)
                -add the new data to our data stucture(s)
                -add the new item into the UI
                -calculate the new budget
                -update UI

                USE OF MODULES ----------------------------------

                Fast forward a few years and we now have complete applications being run
                in browsers with a lot of JavaScript, as well as JavaScript being used in 
                other contexts (Node.js, for example).

                It has therefore made sense in recent years to start thinking about
                providing mechanisms for splitting JavaScript programs up into separate
                modules that can be imported when needed.

                Within this app we can cleanly SEPERATE and organise the code into 2 modules
                e.g  for tasks that more deal with updating the UI,
                
                we could have a UI MODULE
                and for data manipulation we could have a DATA MODULE   





let budgetController = (function(){
   let x = 23;

    let add = function(a) {
       return x + a;
   } 

   return {
          publicTest: function(b) {
                 console.log(add(b));
          }
   }
})();
// non of the variables above can be accesed in the global scope 
// however we can get the number 28 returned in the console
// by typing budgetController.publicTest(5)

             //planing note: THESE 2 MODULES ARE COMPLETELY INDEPENDANT MODULES AND HAVE NO INTERACTION
             //this is called a ------------- SEPERATION OF CONCERNS ----------


let UIController = (function() {
  // some code
})();


let controller = (function(budgetCtrl, UICtrl) {
   
})(budgetController, UIController);

*/
// ------------------------------------------------------------------------------------------------------------------------

let budgetController = (function(){
   //we choose to make objects using this function constructor, because looking ahead there will be lots of expenses
   let Expense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;  
       this.percentage = -1;
   };
       //calculate percentage  
   Expense.prototype.calcPercentage = function(totalIncome) {  //if we add this method to the constructor prototype, remember that all the objects created from the constructor will inherit the method due to the prototype chain 
      if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
         this.percentage = -1;
      }
   };


    // following trend of creating functions that have just one specific task 
    //return percentage
   Expense.prototype.getPercentage = function() {
      return this.percentage;
   }
   
   let Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;  
  }
  

let calculateTotal = function(type) {
  let sum = 0;
  data.allItems[type].forEach(function(cur) {
    sum += cur.value;
  });
data.totals[type] = sum;
};

/* 
[200, 400, 100]
sum = 0 + 20 //1st iteration etc..
sum = 200 + 400 
sum = 600 + 100 = 700 
*/

  // here we could collect a lot of information in seperate variables, seperate arrays etc.... BUT.. wherever possible we should use ONE data structure as this is easier to read
  // this 'global'? data structure is here, ready to receive data 
  let data = {
      allItems: {
         exp: [], // these arrays will hold objects containing the relevant information
         inc: []
      },
      totals: {
         exp: 0,
         inc: 0
      },
      budget: 0,
      percentage: -1   
  };

  return {
     addItem: function(type, des, val) {    //type represents expense or income, des - description, val value
         let newItem, ID;

         //[1 2 3 4 5], next ID = 6
         //[1 2 4 6 8], next ID = 9 
         // ID = last ID + 1
         
         //create new ID
         if(data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
         } else {
            ID = 0;
         }
         
         
         // create new item based on 'inc' or 'exp' type
         if (type === 'exp') {
            newItem = new Expense(ID, des, val);
         } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
         }
         
         //push it into our data structure
         data.allItems[type].push(newItem);

         //return the new element 
         return newItem;
     },
     
     deleteItem: function(type, id) {
      let ids, index;

      // [1 2 4 6 8]; example of ids imagining 0, 3, 5, 7  have all been deleted, we need to take that into account when writing this method   
      //here we need to create an array with all of the id numbers that we have
      //and then find out what the index of the input id is 
      //(the index of the element we want to remove)
      ids =  data.allItems[type].map(function(current) {
        return current.id; 
      });

      index = ids.indexOf(id); // this returns the index number of the element of the array that we input here

      if(index !== -1) {
         data.allItems[type].splice(index, 1);
      }
     },

      calculateBudget: function() {

         //calculate total income and expenses
         calculateTotal('exp');
         calculateTotal('inc');

         //calculate the budget: income - expenses
         data.budget = data.totals.inc - data.totals.exp;

         //calculate the percentage of income that we spent
         if(data.totals.inc > 0) {
         data.percentage - Math.round((data.totals.exp / data.totals.inc) * 100);
         } else {
            data.percentage = -1;
         }

      },

      calculatePercentages: function() {

         data.allItems.exp.forEach(function(cur) {
            cur.calcPercentage(data.totals.inc);
         });

      },

      getPercentage: function() {
         let allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
         });
         return allPerc;
      },

      getBudget: function() {  // an object is argueably the best way to return 4 or more values at the same time 
        return {  // here we create an object that is returned to the app 'controller' which then passes it to displayBudget 
           budget: data.budget,
           totalInc: data.totals.inc,
           totalExp: data.totals.exp,
           percentage: data.percentage
        };
      },

      testing: function() {
         console.log(data);
      }
  };

})();

let UIController = (function() {
   // below DOMstrings is what we can do to limit the ever growing amount of document.querySelectors in this file
   // note how it is made public and becomes a closure in the return statement  
   let DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel: '.budget__title--month' 
   };

   let formatNumber = function(num, type) {
      let numSplit, int, dec;
      // + or - before number 

      num = Math.abs(num);         //abs stands for absolute and removes the sign of the number e.g - 7.24 becomes 7.24
      
      // exactly 2 decimal points
      num = num.toFixed(2);        //toFixed is a member of the number prototype

      numSplit = num.split('.');
      int = numSplit[0];
      
      // comma seperating the thousands
      if(int.length > 3) {
         int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2310, output 2,310
      }
      dec = numSplit[1]

      return (type === 'exp' ? '-' : '+') + int + '.' + dec;
   };

   //this private function can only be used by the methods that are in this UIcontroller function can use it
   let nodeListForEach = function(list, callback) {  //list here refers to Nodelist
      for(var i = 0; i < list.length; i++) { //note here nodeList has access to .length
         callback(list[i], i);
      }          
   }

   return {
      getInput: function() {
         return {
             type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp'
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
         };
      },

      addListItem: function(obj, type) { //these parameters are the information thats needed to add a new item to the list
         let html, newHtml, element;
        // create an html string with placeholder text
        if(type === 'inc') {
         element = DOMstrings.incomeContainer;  
         html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if(type === 'exp') {
           element = DOMstrings.expensesContainer;
         html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        // replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


        // insert the html into the DOM
        document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
      },

      deleteListItem: function(selectorID) { // check paper notes 
        let el = document.getElementById(selectorID);
         el.parentNode.removeChild(el);


      },

      // clear input field after entry
      clearFields: function() {
        let fields, fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription, DOMstrings.inputValue); //returns a list that needs to be converted to an array
        fieldsArr = Array.prototype.slice.call(fields); //this is now an array, AKA a hack!
        fieldsArr.forEach((current, index, array) => {
           current.value = '';
        });

        fieldsArr[0].focus();
      },

      displayBudget: function(obj) {
         let type;
         obj.budget > 0 ? type = 'inc' : type = 'exp';
         document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
         document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
         document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
         

         if(obj.percentage > 0 ) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
         } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
         }

      }, 

      displayPercentages: function(percentages) {
        let fields = document.querySelectorAll(DOMstrings.expensesPercLabel); //This returns a nodelist 
        
        
        
        //we are going to create our own forEach function for 'nodeLists'not 'arrays'
        nodeListForEach(fields, function(current, index) {
           //Do Stuff
          if(percentages[index] > 0) {
           current.textContent = percentages[index] + '%';
          } else {
             current.textContent = '---';
          }
        });
      },

      displayMonth: function() {
         let year, month, now, months;
         
         
         months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

         now = new Date();

         month = now.getMonth();
         year = now.getFullYear();
         document.querySelector(DOMstrings.dateLabel).textContent = ' ' + months[month] + ' ' + year;
      },

      changedType: function() {

         let fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);     
         
         nodeListForEach(fields, function(cur) {
            cur.classList.toggle('red-focus');
         });  
         
         document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
      },

      getDOMstrings: function() {
         return DOMstrings;
      }
   };
})();



//GLOBAL APP CONTROLLER     
let controller = (function(budgetCtrl, UICtrl) { // this is where we tell the other modules what to do
   
   let setupEventListeners = () => {
      let DOM = UICtrl.getDOMstrings();
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);  
      document.addEventListener('keypress', function(event) { //remember here that the callback function of the addEventListener method always has access to the EVENT OBJECT..it is named 'event' just so we remember what it is..but can be named anything 
         if(event.keycode === 13 || event.which === 13) { // .which is for older browsers, also now deprecated
                ctrlAddItem();
         }
      });

      document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem) //the event object can be passed in this instance similarly to explanation above 

      document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType)
   };

   let updateBudget = function() {
      //1. Calculate the budget
      budgetCtrl.calculateBudget();

      //2. Return the budget
      let budget = budgetCtrl.getBudget();
      
      //3. Display the budget on the UI
      UIController.displayBudget(budget);
   }

   let updatePercentages = function() {

      //calculate percentages 
      budgetController.calculatePercentages();
      
      //read percentages from the budget controller
      let percentages = budgetController.getPercentage();

      //update the UI with the new percentages
      UIController.displayPercentages(percentages);
   }

   let ctrlAddItem = function() {
      let input, newItem;

      //1. Get the field input data
      input = UIController.getInput();

      if(input.description !== "" && !isNaN(input.value) && input.value > 0) {  //if '' is not a number it will return true so we've put the ! before isNaN to get the opposite result
        
        //2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UIController.addListItem(newItem, input.type);

        //4. Clear Input fields
        UIController.clearFields();
      
        // 5. calculate and update budget
        updateBudget();

        //6. Calculate and update percentages
        updatePercentages();
      }
      
      
   };

   let ctrlDeleteItem = function(event) { //we have put the event placeholder here so we can find out the target element 
      let itemID;
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //this is an example of traversing the DOM

      if(itemID) {

         splitID = itemID.split('-');
         type = splitID[0];
         ID = parseInt(splitID[1]);

         //1. delete the item from the data structure 
         budgetController.deleteItem(type, ID);
 
         //2. delete the item from the UI
         UIController.deleteListItem(itemID);

         //3. Update and show the new budget 
         updateBudget();

         //4. calculate and update percentages
         updatePercentages();

      }

   }
   
   return {
      init: function() {
        console.log('Congtratulations this app is now running');
        UIController.displayMonth();
        UIController.displayBudget({
           budget: 0,
           totalInc: 0,
           totalExp: 0,
           percentage: -1
        });
        // line below is the reason we setup this function
        setupEventListeners(); //after this the eventListeners will only be setup when the init: function is called 
      }
   }
})(budgetController, UIController);

//without this line of code nothing will ever happen 
controller.init();
