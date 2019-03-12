// budgetController
const budgetController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    this.percentage = Math.round((this.value / totalIncome) * 100);

    //Calculate the percentage of income that we spent
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = -1;

    console.log(this.percentage);
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Keep our data here
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  const calculateTotal = type => {
    let sum = 0;

    data.allItems[type].forEach(element => {
      sum += element.value;
    });

    data.totals[type] = sum;
  };

  return {
    addItem: (type, description, value) => {
      let newItem,
        ID = 0;

      //Create new ID
      if (data.allItems[type].length > 0)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

      //Create new Item based ON INC OR EXP
      if (type === "exp") {
        newItem = new Expense(ID, description, value);
      } else if (type === "inc") {
        newItem = new Income(ID, description, value);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },
    testing: () => {
      console.log(data.allItems);
    },
    calculateBudget: () => {
      //calculate total incomes and expenses
      calculateTotal("inc");
      calculateTotal("exp");

      //Calculate total budgets = totalIncome - totalExpenses
      data.budget = data.totals.inc - data.totals.exp;

      //Calculate the percentage of income that we spent
      if (data.totals.inc > 0)
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.percentage = -1;
    },
    deleteItem: (type, id) => {
      let ids = data.allItems[type].map(current => {
        return current.id;
      });

      let index = ids.indexOf(id);

      if (index !== -1) data.allItems[type].splice(index, 1);
    },
    calculatePercentages: () => {
      data.allItems.exp.forEach(cur => {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: () => {
      return data.allItems.exp.map(cur => {
        return cur.getPercentage();
      });
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalIncomes: data.totals.inc,
        totalExpenses: data.totals.exp,
        percentage: data.percentage
      };
    }
  };
})();

// UIController
const UIController = (function() {
  const DomStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    badgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  const formatNumber = (number, type) => {
    /* 
     + or - before number
     exactly two decimal points
     comma separating the thousands

     2310.4567 =>  + 2,310.45
     2000 => 2,000..00
    */

    let num = Math.abs(number);
    num = num.toFixed(2);

    let numSplit = num.split(".");
    let integer = numSplit[0];
    if (integer.length > 3) {
      integer =
        integer.substr(0, integer.length - 3) +
        "," +
        integer.substr(integer.length - 3, 3);
    }
    let decimal = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + integer + "." + decimal;
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(DomStrings.inputType).value,
        description: document.querySelector(DomStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DomStrings.inputValue).value)
      };
    },
    deleteListItem: selectorId => {
      let element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
    },
    addListItem: (item, type) => {
      let html, element;

      //Create html string with placeholder text
      if (type === "inc") {
        element = DomStrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
      } else if (type === "exp") {
        element = DomStrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">0%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
      }

      //Replace the placeholder text with some actual data
      let newHtml = html.replace("%id%", item.id);
      newHtml = newHtml.replace("%description%", item.description);
      newHtml = newHtml.replace("%value%", formatNumber(item.value, type));

      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: () => {
      let fields = document.querySelectorAll(
        DomStrings.inputDescription + ", " + DomStrings.inputValue
      );

      let fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach((element, index, array) => {
        element.value = "";
      });
      fieldsArray[0].focus();
    },
    displayBudget: budget => {
      document.querySelector(DomStrings.badgetLabel).textContent = formatNumber(
        budget.budget,
        budget.budget >= 0 ? "inc" : "exp"
      );
      document.querySelector(DomStrings.incomeLabel).textContent = formatNumber(
        budget.totalIncomes,
        "inc"
      );
      document.querySelector(
        DomStrings.expenseLabel
      ).textContent = formatNumber(budget.totalExpenses, "exp");
      document.querySelector(DomStrings.percentageLabel).textContent =
        budget.percentage > 0 ? budget.percentage + "%" : "-";
    },
    displayPercentages: percentages => {
      let fields = document.querySelectorAll(
        DomStrings.expensesPercentageLabel
      );

      let nodeListForEach = function(fields, callBack) {
        for (var i = 0; i < fields.length; i++) callBack(fields[i], i);
      };

      nodeListForEach(fields, function(current, index) {
        current.textContent =
          percentages[index] !== -1 ? percentages[index] + "%" : "-";
      });
    },
    displayMonth: () => {
      let now = new Date();
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      document.querySelector(DomStrings.dateLabel).textContent =
        months[now.getMonth()] + " " + now.getFullYear();
    },
    getDomStrings: () => DomStrings
  };
})();

// controller
const controller = (function(budgetCtrl, uiCtrl) {
  //--------------ctrlAddItem--------------//
  const updateBudget = () => {
    //Calculate Budget
    budgetCtrl.calculateBudget();

    //Return the budget
    let budget = budgetCtrl.getBudget();

    //Dispaly
    uiCtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    //Calculate Percentages
    budgetCtrl.calculatePercentages();

    //Read percentages  from the budget controller
    let percentages = budgetController.getPercentages();

    //Update UI with the new Percentages
    uiCtrl.displayPercentages(percentages);

    console.log(percentages);
  };

  //--------------ctrlAddItem--------------//
  const ctrlAddItem = () => {
    let input, newItem;

    //Get the field input data
    input = UIController.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //Add the item to the budget controller
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );

      //Add a new item to the UI
      uiCtrl.addListItem(newItem, input.type);

      //Clear the fields
      uiCtrl.clearFields();

      //Calculcate the budget
      updateBudget();

      //Update Percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = event => {
    let itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      //inc-1
      let splitID = itemID.split("-");
      let type = splitID[0];
      let id = parseInt(splitID[1]);

      // 1.Delete the item from datastructure
      budgetCtrl.deleteItem(type, id);

      // 2.Delete the item from UI
      uiCtrl.deleteListItem(itemID);

      // 3.Update and show the new budget
      updateBudget();

      //Update Percentages
      updatePercentages();
    }
  };

  //--------------setupEventListeners--------------//
  const setupEventListeners = function() {
    const dom = UIController.getDomStrings();

    document
      .querySelector(dom.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(dom.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  return {
    init: () => {
      UIController.displayBudget({
        budget: 0,
        totalIncomes: 0,
        totalExpenses: 0,
        percentage: -1
      });
      setupEventListeners();
      uiCtrl.displayMonth();
    }
  };
})(budgetController, UIController);

controller.init();
