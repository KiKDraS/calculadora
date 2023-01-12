//Elementos del HTML
const calculadora = document.querySelector(".calculadora");
const visor = document.getElementById("resultado");

//Observer para manejar estado de la calculadora
function stateCalculadora() {
  return {
    state: {
      result: 0,
      input: [],
      operator: "",
    },
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
  this.notify(this.state);
}

function update(btn) {
  if (btn.classList.contains("numeros")) {
    if (this.state.operator) {
      if (this.state.result && this.state.operator !== "C") {
        this.state.input.push(Number(btn.textContent));
        this.operations(this.state.operator);
      } else {
        this.state.input.push(Number(btn.textContent));
        this.notify(this.state);
      }
    } else {
      this.state.input.push(Number(btn.textContent));
      this.notify(this.state);
    }
  } else {
    //1er número y 1er número después de un igual
    if (this.state.input.length === 0 && this.state.result) {
      this.state.input.push(this.state.result);
    }

    //Almacenar tipo de operación actual
    if (
      this.state.operator !== btn.textContent &&
      (btn.textContent === "+" ||
        btn.textContent === "-" ||
        btn.textContent === "*" ||
        btn.textContent === "/")
    ) {
      this.state.operator = btn.textContent;
    }

    switch (btn.textContent) {
      case "C":
        this.state.operator = "C";
        this.state.result = 0;
        this.state.input = [];
        this.notify(this.state);
        break;
      case "=":
        this.state.operator = "=";
        this.state.input = [];
        this.notify(this.state);
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
      if (this.state.input.length === 1) {
        this.state.result = this.state.input[0];
      } else {
        let result = 0;
        for (let num of this.state.input) {
          result += num;
        }
        this.state.result = this.toFixed(result);
      }
      this.notify(this.state);
      break;
    }
    case "-": {
      //Evita el for si sólo hay 1 número
      if (this.state.input.length === 1) {
        this.state.result = this.state.input[0];
      } else {
        let result = this.state.input[0];
        const arrLength = this.state.input.length;
        //Realiza la operación a partir del segundo elemento en el Array
        for (let index = 1; index < arrLength; index++) {
          const num = this.state.input[index];
          result -= num;
        }
        this.state.result = this.toFixed(result);
      }
      this.notify(this.state);
      break;
    }
    case "*": {
      //Evita el for si sólo hay 1 número
      if (this.state.input.length === 1) {
        this.state.result = this.state.input[0];
      } else {
        let result = this.state.input[0];
        const arrLength = this.state.input.length;
        for (let index = 1; index < arrLength; index++) {
          const num = this.state.input[index];
          result *= num;
        }
        this.state.result = this.toFixed(result);
      }
      this.notify(this.state);
      break;
    }
    case "/": {
      //Evita el for si sólo hay 1 número
      if (this.state.input.length === 1) {
        this.state.result = this.state.input[0];
      } else {
        let result = this.state.input[0];
        const arrLength = this.state.input.length;
        for (let index = 1; index < arrLength; index++) {
          const num = this.state.input[index];
          result /= num;
        }
        this.state.result = this.toFixed(result);
      }
      this.notify(this.state);
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
