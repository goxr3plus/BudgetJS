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
    expensesContainer: ".expenses__list"
  };
  return {
    getInput: () => {
      return {
        type: document.querySelector(DomStrings.inputType).value,
        description: document.querySelector(DomStrings.inputDescription).value,
        value: document.querySelector(DomStrings.inputValue).value
      };
    },
    addListItem: (item, type) => {
      let html, element;

      //Create html string with placeholder text
      if (type === "inc") {
        element = DomStrings.incomeContainer;
        html = `<div class="item clearfix" id="income-%id%">
                <div class="item__description">%description%</div>
                <div class="right clearfix">
                    <div class="item__value">%value%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
      } else if (type === "exp") {
        element = DomStrings.expensesContainer;
        html = `<div class="item clearfix" id="expense-%id%">
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

      console.log(newHtml);

      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
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
    UIController.addListItem(newItem, input.type);

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
