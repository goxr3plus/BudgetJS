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

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    test: () => {
      console.log(data);
    }
  };
})();

// UIController
const UIController = (function() {
  const DomStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
  return {
    getInput: () => {
      return {
        type: document.querySelector(DomStrings.inputType).value,
        description: document.querySelector(DomStrings.inputDescription).value,
        value: document.querySelector(DomStrings.inputValue).value
      };
    },

    getDomStrings: () => DomStrings
  };
})();

// controller
const controller = (function(budgetCtrl, uiCtrl) {
  //--------------ctrlAddItem--------------//
  const ctrlAddItem = () => {
    let input, newItem;

    //Get the field input data
    input = UIController.getInput();

    //Add the item to the budget controller
    newItem = budgetController.addItem(
      input.type,
      input.description,
      input.value
    );

    //Add a new item to the UI

    //Calculcate the budget

    //Display the Budget
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
    console.log("Settted up!!!");
  };

  return {
    init: () => {
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
