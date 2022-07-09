/*Selecionando os inputs a serem manipulados */
let inputFname = document.getElementById('inputFname')
let inputLname = document.getElementById('inputLname')
let inputCreateEmail = document.getElementById('inputCreateEmail')
let inputCreatePassword = document.getElementById('inputCreatePassword')
let inputRepeatPassword = document.getElementById('inputRepeatPassword')
let signupBtn = document.getElementById('signupBtn')

/*Alterando botao quando esta bloqueado*/
signupBtn.style.backgroundColor = '#979292A1'
signupBtn.innerText = 'Blocked'

/*Define um objeto para o usuario ao cadastrar*/

let objUserSignUp = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

let signupUserJson = ''

/*Evento Botao CRIAR CONTA*/

signupBtn.addEventListener('click', function (e) {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  if (
    validateSignUp(
      inputFname.value,
      inputLname.value,
      inputCreateEmail.value,
      inputCreatePassword.value,
      inputRepeatPassword.value,
      validateEmail(inputCreateEmail.value)
    )
  ) {
    e.preventDefault()

    // Normalização das informações
    inputFname = normalizeString(inputFname.value)
    inputLname = normalizeString(inputLname.value)
    inputCreateEmail = normalizeString(inputCreateEmail.value)
    inputCreatePassword = normalizeString(inputCreatePassword.value)

    // Atribui as informações normalizadas ao objeto do usuário(em JS)
    objUserSignUp.firstName = inputFname
    objUserSignUp.lastName = inputLname
    objUserSignUp.email = inputCreateEmail
    objUserSignUp.password = inputCreatePassword

    console.log('objUserSignUp antes', objUserSignUp)

    // objeto do usuario criado
    let signupUserJson = JSON.stringify(objUserSignUp)
    console.log('signupUserJson depois', signupUserJson)

    // Comunicando-se API Cadastrar usuario
    let configRequest = {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: signupUserJson,
    }

    fetch('https://ctd-fe2-todo-v2.herokuapp.com/v1/users', configRequest)
      .then((response) => {
        console.log(response)
        if (response.status == 201 || response.status == 200) {
          return response.json()
        } else {
          throw response
        }
      })
      .then((json) => {
        successSignup(json)
        console.log(json)
      })
      .catch((err) => {
        // Verifica os status de "senha incorreta ou email incorreto"
        if (err.status == 400 || err.status == 401 || err.status == 500) {
          errorSignup()
        }
      })
  } else {
    /*mostra erro de validação*/
    console.log('Invalid signup')
  }
})

function successSignup(successResponse) {
  console.log(successResponse)
  sessionStorage.setItem('jwt', successResponse.jwt)
  location.href = 'index.html'
  // setTimeout(() => {
  //   // Direciona o usuario para a tela das tarefas
  //   location.href = 'index.html'
  // }, 2000)
}

function errorSignup() {
  alert('Incomplete data and/or Requires Authorization and/or Server Error')
}

/* Verificando o input do nome */
inputFname.addEventListener('keyup', () => {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  let fNameValidation = document.getElementById('fNameValidation')

  if (inputFname.value) {
    fNameValidation.innerText = ''
    inputFname.style.border = '2px solid #009B1A'
  } else {
    fNameValidation.innerText = 'Required field'
    inputFname.style.border = '2px solid #E9554EBB'
  }
  validateSignUp(
    inputFname.value,
    inputLname.value,
    inputCreateEmail.value,
    inputCreatePassword.value,
    inputRepeatPassword.value,
    validateEmail(inputCreateEmail.value)
  )
})

/* Verificando o input do sobrenome */
inputLname.addEventListener('keyup', () => {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  let lNameValidation = document.getElementById('lNameValidation')

  if (inputLname.value) {
    lNameValidation.innerText = ''
    inputLname.style.border = '2px solid #009B1A '
  } else {
    lNameValidation.innerText = 'Required field'
    inputLname.style.border = '2px solid #E9554EBB'
  }
  validateSignUp(
    inputFname.value,
    inputLname.value,
    inputCreateEmail.value,
    inputCreatePassword.value,
    inputRepeatPassword.value,
    validateEmail(inputCreateEmail.value)
  )
})

/* Verificando o input de email Criar Conta */
inputCreateEmail.addEventListener('keyup', () => {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  let emailValidation = document.getElementById('emailValidation')

  if (inputCreateEmail.value) {
    emailValidation.innerText = ''
    inputCreateEmail.style.border = '2px solid #009B1A'
  } else if (!validateEmail) {
    emailValidation.innerText = 'Invalid Email'
  } else {
    emailValidation.innerText = 'Required field'
    inputCreateEmail.style.border = '2px solid #E9554EBB'
  }
  validateSignUp(
    inputFname.value,
    inputLname.value,
    inputCreateEmail.value,
    inputCreatePassword.value,
    inputRepeatPassword.value,
    validateEmail(inputCreateEmail.value)
  )
  validateEmail(inputCreateEmail.value)
})

/* Verificando o input de senha signup */
inputCreatePassword.addEventListener('keyup', () => {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  let passwordValidation = document.getElementById('passwordValidation')

  if (inputCreatePassword.value) {
    passwordValidation.innerText = ''
    inputCreatePassword.style.border = '2px solid #009B1A'
  } else {
    passwordValidation.innerText = 'Required field'
    inputCreatePassword.style.border = '2px solid #E9554EBB'
  }
  validateSignUp(
    inputFname.value,
    inputLname.value,
    inputCreateEmail.value,
    inputCreatePassword.value,
    inputRepeatPassword.value,
    validateEmail(inputCreateEmail.value)
  )
})

/*Verificando o input de repetir senha signup*/

inputRepeatPassword.addEventListener('keyup', () => {
  //Busca valores atualizados dos inputs
  inputFname = document.querySelector('#inputFname')
  inputLname = document.querySelector('#inputLname')
  inputCreateEmail = document.querySelector('#inputCreateEmail')
  inputCreatePassword = document.querySelector('#inputCreatePassword')
  inputRepeatPassword = document.querySelector('#inputRepeatPassword') // confirmar se precisa mesmo!

  let repeatPassValidation = document.getElementById('repeatPassValidation')

  if (inputRepeatPassword.value === inputCreatePassword.value) {
    repeatPassValidation.innerText = ''
    inputRepeatPassword.style.border = '2px solid #009B1A'
  } else if (!inputRepeatPassword.value) {
    repeatPassValidation.innerText = 'Required field'
    inputRepeatPassword.style.border = '2px solid #E9554EBB'
  } else {
    repeatPassValidation.innerText = 'Must be the same password'
    inputRepeatPassword.style.border = '2px solid #E9554EBB'
  }
  validateSignUp(
    inputFname.value,
    inputLname.value,
    inputCreateEmail.value,
    inputCreatePassword.value,
    inputRepeatPassword.value,
    validateEmail(inputCreateEmail.value)
  )
})

/*Funcao que valida pagina de criar conta */

function validateSignUp(firstName, lastName, email, password, repeatedPass) {
  if (firstName && lastName && email && password && repeatedPass) {
    //True
    signupBtn.removeAttribute('disabled')
    signupBtn.style.backgroundColor = '#7898FF'
    signupBtn.innerText = 'Sign Up'

    return true
  } else {
    //False
    signupBtn.style.backgroundColor = '#979292A1'
    signupBtn.innerText = 'Blocked'
    signupBtn.setAttribute('disabled', true)

    return false
  }
}

function validateEmail(receivedEmail) {
  const regex =
    /[a-z0-9!#$%&’*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&’*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  if (receivedEmail.match(regex)) {
    return true
  } else {
    return false
  }
}

/* animações do signup */

const inputs = document.querySelectorAll('.input')

function focusFunc() {
  let parent = this.parentNode.parentNode
  parent.classList.add('focus')
}
function blurFunc() {
  let parent = this.parentNode.parentNode
  if (this.value == '') {
    parent.classList.remove('focus')
  }
}

inputs.forEach((input) => {
  input.addEventListener('focus', focusFunc)
  input.addEventListener('blur', blurFunc)
})
