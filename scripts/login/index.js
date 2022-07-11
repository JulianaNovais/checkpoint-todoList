/* Captura os inputs que serão manipulados */
let emailLogin = document.querySelector('#inputEmail')
let passwordLogin = document.querySelector('#inputPassword')
let buttonLogin = document.querySelector('#buttonLogin')

/* Altera o botão de acesso quando está bloqueado */
buttonLogin.style.backgroundColor = '#979292A1'
buttonLogin.innerText = 'Blocked'

/* Define um objeto para o usuário, para utilizar na API */
let objUserLogin = {
  email: '',
  password: '',
}

let loginUserJson = ''

/* Adiciona o evento de click ao botão LOGIN */
buttonLogin.addEventListener('click', function (e) {
  // Busca valores atualizados dos inputs
  emailLogin = document.querySelector('#inputEmail')
  passwordLogin = document.querySelector('#inputPassword')

  //Verifica a validação
  if (validateLogin(emailLogin.value, passwordLogin.value)) {
    e.preventDefault()

    /* Normalização das informações*/
    emailLogin = normalizeString(emailLogin.value)
    passwordLogin = normalizeString(passwordLogin.value)

    //Atribui as informações normalizadas ao objeto do usuário (em JS)
    objUserLogin.email = emailLogin
    objUserLogin.password = passwordLogin

    //Converte o objeto JS em objeto JSON(textual)
    let loginUserJson = JSON.stringify(objUserLogin)

    console.log('loginUserJson', loginUserJson)

    // Comunicando-se com a API To-Do Swagger DH

    //declarando requisição e armazenando-a dentro de uma variável
    let configRequest = {
      method: 'POST', //método HTTP
      headers: {
        //Cabeçalho da requisição
        'Content-type': 'Application/json', //Tipo do conteúdo enviado
      },
      body: loginUserJson, //Corpo da requisição: enviar objeto transformado em json!
    }

    // Consumindo API

    //api - login user(POST)
    fetch('https://ctd-fe2-todo-v2.herokuapp.com/v1/users/login', configRequest)
      .then((response) => {
        console.log(response) //depois apagar, serve apenas para teste do objeto Response
        if (response.status == 201 || response.status == 200) {
          return response.json()
        } else {
          throw response
        }
      })
      .then((json) => {
        // Ao obter sucesso no login, chama a função de sucesso do login
        successLogin(json)
      })
      .catch((err) => {
        // Verifica os status de "senha incorreta ou email incorreto"
        if (err.status == 400 || err.status == 404 || err.status == 500) {
          errorLogin(err)
        }
      })
  }
})

// função em caso de sucesso: irá armazenar o token o sessionStorage
function successLogin(successResponse) {
  //alert('Sucesso!')

  // salvando o token obtido da API
  sessionStorage.setItem('jwt', successResponse.jwt)

  // Direciona o usuario para a tela das tarefas
  location.href = 'tarefas.html' //ASPAS DUPLAS, POIS É O ATRIBUTO HREF!!!!
}

function errorLogin(errorResponse) {
  if (errorResponse.status == 400 || errorResponse.status == 404) {
    alert('User does not exist and/or Incorrect password')
  } else if (errorResponse.status == 500) {
    alert('Server error')
  } else {
    alert(`ERROR: ${errorResponse.statusText}`)
  }
}

/* Validating the email input*/
emailLogin.addEventListener('keyup', () => {
  emailLogin = document.querySelector('#inputEmail')
  passwordLogin = document.querySelector('#inputPassword')

  let emailValidation = document.getElementById('emailValidation')

  /* Alterandoo texto do Small - Verifica se o campo é nulo/vazio */
  if (!emailLogin.value) {
    emailValidation.innerText = 'Required field'
    //Troca a cor da borda do input
    emailLogin.style.border = '2px solid #E9554EBB'
  } else {
    emailValidation.innerText = ''

    //Troca a cor da borda para verde ao preencher email
    emailLogin.style.border = '2px solid transparent'
    emailLogin.style.background = '#'
  }

  validateLogin(emailLogin.value, passwordLogin.value)
})

/* Verificando o input de senha */
passwordLogin.addEventListener('keyup', () => {
  emailLogin = document.querySelector('#inputEmail')
  passwordLogin = document.querySelector('#inputPassword')

  let passwordValidation = document.getElementById('passwordValidation')

  if (passwordLogin.value) {
    passwordValidation.innerText = ''
    passwordLogin.style.border = '2px solid transparent'
  } else {
    passwordValidation.innerText = 'Required field'
    passwordLogin.style.border = '2px solid #E9554EBB'
  }
  validateLogin(emailLogin.value, passwordLogin.value)
})

/* Função que valida o acesso na página de login */
function validateLogin(email, password) {
  if (email && password) {
    //True
    buttonLogin.removeAttribute('disabled')
    buttonLogin.style.backgroundColor = '#7898FF'
    buttonLogin.innerText = 'Access'

    return true
  } else {
    //False

    buttonLogin.style.backgroundColor = '#979292A1'
    buttonLogin.innerText = 'Blocked'
    buttonLogin.setAttribute('disabled', true)

    return false
  }
}

/* animações do login */

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
