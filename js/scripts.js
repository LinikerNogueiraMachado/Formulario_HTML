class Validator {

    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate',
        ]
    }

    // iniciar a validação de todos os campos
    validate(form) {

        // resgatar todas as validações
        let currentValidations = document.querySelectorAll('form .error-validation');

        if (currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }

        // pegar os inputs
        let inputs = form.getElementsByTagName('input');

        // Transformar uma HTMLCollection -> Array
        let inputsArray = [...inputs];

        // loop nos inputs e validações mediante ao que for encontrado
        inputsArray.forEach(function (input) {

            // loop em todas as validações existentes
            for (let i = 0; this.validations.length > i; i++) {
                // verifica se a validação atual existe no input
                if (input.getAttribute(this.validations[i]) != null) {

                    // limpando a string para virar um método
                    let method = this.validations[i].replace('data-', '').replace('-', '');

                    // valor do input
                    let value = input.getAttribute(this.validations[i]);

                    // invocar o método 
                    this[method](input, value);
                }
            }
        }, this);
    }

    // verifica se um input tem um número mínimo de caracteres
    minlength(input, minValue) {
        let inputLength = input.value.length;
        let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if (inputLength < minValue) {
            this.printMessage(input, errorMessage);
        }
    }

    maxlength(input, maxValue) {
        let inputLength = input.value.length;
        let errorMessage = `O campo excedeu o limite de ${maxValue} caracteres`;

        if (inputLength > maxValue) {
            this.printMessage(input, errorMessage);
        }
    }

    // validação do e-mail
    emailvalidate(input) {

        // email@email.com -> email@email.com.br
        let re = /\S+@\S+\.\S+/;
        let email = input.value;
        let errorMessage = `Insira um e-mail válido`;

        if (!re.test(email)) {
            this.printMessage(input, errorMessage);
        }
    }

    // valida apenas letras nos campos nome sobrenome
    onlyletters(input) {
        let re = /^[A-Za-z]/;
        let inputValue = input.value;
        let errorMessage = `Este campo só aceita Letras`;

        if (!re.test(inputValue)) {
            this.printMessage(input, errorMessage);
        }
    }

    // verifica se o input é requerido
    required(input) {
        let inputValue = input.value;

        if (inputValue === '') {
            let errorMessage = `* Campo obrigatório *`;
            this.printMessage(input, errorMessage);
        }
    }

    // validação do campo senha
    passwordvalidate(input) {

        // explode string em um Array 
        let charArr = input.value.split("");
        let uppercases = 0;
        let numbers = 0;

        for (let i = 0; charArr.length > i; i++) {
            if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                uppercases++;
            } else if (!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }
        if (uppercases === 0 || numbers === 0) {
            let errorMessage = `Senha precisa ter um Caractere maiúsculo e números`;
            this.printMessage(input, errorMessage);
        }
    }

    // verificação das senhas se conferem
    equal(input, inputName) {
        let inputToCompare = document.getElementsByName(inputName)[0];
        let errorMessage = `Senhas não conferem`;

        if (input.value != inputToCompare.value) {
            this.printMessage(input, errorMessage);
        }
    }

    // tratamento de erros
    printMessage(input, msg) {

        // quantidade de erros
        let errorsQty = input.parentNode.querySelector('.error-validation');

        if (errorsQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);
            template.textContent = msg;

            let inputParent = input.parentNode;
            template.classList.remove('template');
            inputParent.appendChild(template);
        }

    }

    // limpando as validações da tela
    cleanValidations(validations) {
        validations.forEach(el => el.remove());
    }

}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");
let validator = new Validator();

// evento que dispara as validações
submit.addEventListener('click', function (e) {
    e.preventDefault();
    validator.validate(form);
});