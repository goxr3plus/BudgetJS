// budgetController
const budgetController = (function functionName() {})();

// UIController
const UIController = (function() {
  const domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };
  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: document.querySelector(domStrings.inputValue).value
      };
    },

    getDomStrings: () => domStrings
  };
})();

// controller
const controller = (function(budgetCtrl, uiCtrl) {
  const ctrlAddItem = () => {
    //Get the field input data
    const input = UIController.getInput();
    console.log(input)

    //Add the item to the budget controller

    //Add a new item to the UI

    //Calculcate the budget

    //Display the Budget
  };

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
