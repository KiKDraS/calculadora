//Elementos del HTML
const calculadora = document.querySelector(".calculadora");
const visor = document.getElementById("resultado");

//Observer para manejar estado de la calculadora
function stateCalculadora() {
  return {
    result: 0,
    input: [],
    operator: "",
    subscribers: [],
    suscribe: function (subscriber) {
      this.subscribers.push(subscriber);
    },
    notify: function (value) {
      this.subscribers.forEach((subscriber) => {
        subscriber.notify(value);
      });
    },
    start,
    update,
    operations,
    toFixed,
  };
}

//Operaciones de State
function start() {
  this.notify(this);
}

function update(btn) {
  if (btn.classList.contains("numeros")) {
    if (this.operator) {
      if (this.result && this.operator !== "C") {
        this.input.push(Number(btn.textContent));
        this.operations(this.operator);
      } else {
        this.input.push(Number(btn.textContent));
        this.notify(this);
      }
    } else {
      this.input.push(Number(btn.textContent));
      this.notify(this);
    }
  } else {
    //1er número y 1er número después de un igual
    if (this.input.length === 0 && this.result) {
      this.input.push(this.result);
    }

    //Almacenar tipo de operación actual
    if (
      this.operator !== btn.textContent &&
      (btn.textContent === "+" ||
        btn.textContent === "-" ||
        btn.textContent === "*" ||
        btn.textContent === "/")
    ) {
      this.operator = btn.textContent;
    }

    switch (btn.textContent) {
      case "C":
        this.operator = "C";
        this.result = 0;
        this.input = [];
        this.notify(this);
        break;
      case "=":
        this.operator = "=";
        this.input = [];
        this.notify(this);
        break;
      case "+":
        this.operations("+");
        break;
      case "-":
        this.operations("-");
        break;
      case "*":
        this.operations("*");
        break;
      case "/":
        this.operations("/");
        break;
    }
  }
}

function operations(operation) {
  switch (operation) {
    case "+": {
      //Evita el for si sólo hay 1 número
      if (this.input.length === 1) {
        this.result = this.input[0];
      } else {
        let result = 0;
        for (let num of this.input) {
          result += num;
        }
        this.result = this.toFixed(result);
      }
      this.notify(this);
      break;
    }
    case "-": {
      //Evita el for si sólo hay 1 número
      if (this.input.length === 1) {
        this.result = this.input[0];
      } else {
        let result = this.input[0];
        const arrLength = this.input.length;
        //Realiza la operación a partir del segundo elemento en el Array
        for (let index = 1; index < arrLength; index++) {
          const num = this.input[index];
          result -= num;
        }
        this.result = this.toFixed(result);
      }
      this.notify(this);
      break;
    }
    case "*": {
      //Evita el for si sólo hay 1 número
      if (this.input.length === 1) {
        this.result = this.input[0];
      } else {
        let result = this.input[0];
        const arrLength = this.input.length;
        for (let index = 1; index < arrLength; index++) {
          const num = this.input[index];
          result *= num;
        }
        this.result = this.toFixed(result);
      }
      this.notify(this);
      break;
    }
    case "/": {
      //Evita el for si sólo hay 1 número
      if (this.input.length === 1) {
        this.result = this.input[0];
      } else {
        let result = this.input[0];
        const arrLength = this.input.length;
        for (let index = 1; index < arrLength; index++) {
          const num = this.input[index];
          result /= num;
        }
        this.result = this.toFixed(result);
      }
      this.notify(this);
      break;
    }
  }
}

function toFixed(num) {
  //Impide el trabajo con más de 2 decimales
  if (Number.isInteger(num)) {
    return num;
  } else {
    return Number(num.toFixed(2));
  }
}

//Observador para manipular la vista
function updateView(react) {
  return {
    notify: react,
  };
}

//Operaciones de Vista
const viewInput = updateView((state) => {
  //Evaluación de tipo de vista
  if (!state.operator) {
    if (state.input.length < 1) visor.textContent = state.result;
    else visor.textContent = state.input[state.input.length - 1];
  } else if (!state.result && state.operator === "C") {
    if (state.input.length < 1) visor.textContent = state.result;
    else visor.textContent = state.input[state.input.length - 1];
  } else if (state.result && state.operator === "=") {
    visor.textContent = state.result;
  } else {
    visor.textContent = state.input[state.input.length - 1];
  }
});

//Ejecutar Observer y Observador
const state = stateCalculadora();
state.suscribe(viewInput);

//Delegación de Evento Click para actualización de vista
calculadora.addEventListener("click", ({ target }) => {
  state.update(target);
});

//Inicializar
state.start();
