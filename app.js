// budgetController
const budgetController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
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
    container: ".container"
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
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
      }

      //Replace the placeholder text with some actual data
      let newHtml = html.replace("%id%", item.id);
      newHtml = newHtml.replace("%description%", item.description);
      newHtml = newHtml.replace("%value%", item.value);

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
      document.querySelector(DomStrings.badgetLabel).textContent =
        budget.budget;
      document.querySelector(DomStrings.incomeLabel).textContent =
        budget.totalIncomes;
      document.querySelector(DomStrings.expenseLabel).textContent =
        budget.totalExpenses;
      document.querySelector(DomStrings.percentageLabel).textContent =
        budget.percentage > 0 ? budget.percentage + "%" : "-";
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
    }
  };
})(budgetController, UIController);

controller.init();
