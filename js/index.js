//Elementos del HTML
const calculadora = document.querySelector(".calculator");
const visor = document.getElementById("result");

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
    setState,
    update,
    operate,
    toFixed,
  };
}

//Operaciones de State
function start() {
  this.notify(this.state);
}

function setState(newState) {
  const state = this.state;
  for (const key in newState) {
    if (state.hasOwnProperty(key)) {
      state[key] = newState[key];
    }
  }
  return state;
}

function update(btn) {
  const isNumber = btn.classList.contains("number");
  const hasOperator = this.state.operator;

  if (isNumber && !hasOperator) {
    //Mostrar Input
    const btnNumber = btn.textContent;
    const newState = {
      input: [...this.state.input, Number(btnNumber)],
    };

    this.state = this.setState(newState);
    this.notify(this.state);
  } else if ((!isNumber && !hasOperator) || (!isNumber && hasOperator)) {
    const btnType = btn.textContent;

    const isType =
      btnType === "+" || btnType === "-" || btnType === "*" || btnType === "/";

    if (this.state.operator !== btnType && isType) {
      //Almacenar tipo de operación actual
      const newState = {
        operator: btnType,
      };

      this.state = this.setState(newState);
    } else {
      //Mostrar/borrar resultado de operaciones
      switch (btnType) {
        case "C": {
          const newState = {
            operator: "C",
            result: 0,
            input: [],
          };

          this.state = this.setState(newState);
          this.notify(this.state);
          break;
        }
        case "=": {
          const newState = {
            operator: "=",
          };

          this.state = this.setState(newState);
          this.notify(this.state);
          break;
        }
      }
    }
  } else if (isNumber && hasOperator) {
    const inputLength = this.state.input.length;
    const btnType = btn.textContent;

    //Mostrar número ingresado
    const newState = {
      input: [...this.state.input, Number(btnType)],
    };

    this.state = this.setState(newState);
    this.notify(this.state);

    //Agregar número Array 1er número ingresado y 1er número ingresado después de un igual
    if (inputLength === 0 && this.state.result) {
      const newState = {
        input: [...this.state.input, this.state.result],
      };

      this.state = this.setState(newState);
    }

    //Operar
    switch (this.state.operator) {
      case "+":
        this.operate((n1, n2) => n1 + n2);
        break;
      case "-":
        this.operate((n1, n2) => n1 - n2);
        break;
      case "*":
        this.operate((n1, n2) => n1 * n2);
        break;
      case "/":
        this.operate((n1, n2) => n1 / n2);
        break;
    }
  }
}

function operate(cb) {
  const input = this.state.input;

  let result = input[0];
  const arrLength = this.state.input.length;

  for (let index = 1; index < arrLength; index++) {
    const num = input[index];
    result = cb(result, num);
  }

  const newState = {
    result: this.toFixed(result),
    input: [result],
  };

  this.state = this.setState(newState);
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
  const { result, input, operator } = state;

  //Evaluación de tipo de vista
  if (!operator) {
    if (input.length < 1) visor.textContent = result;
    else visor.textContent = input[input.length - 1];
  } else if (!result && operator === "C") {
    if (input.length < 1) visor.textContent = result;
    else visor.textContent = input[input.length - 1];
  } else if (result && operator === "=") {
    visor.textContent = result;
  } else {
    visor.textContent = input[input.length - 1];
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
