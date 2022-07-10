let tokenJwt
const logOut = document.querySelector('#closeApp')

onload = function () {
  tokenJwt = sessionStorage.getItem('jwt')

  if (!tokenJwt) {
    alert('You don`t have access permission')
    location.href = 'index.html'
  } else {
    buscaDadosUsuario()
    getUserTasks(tokenJwt)
  }
}

function clearTasks() {
  let pendingTasksList = document.querySelector('.tarefas-pendentes div')
  // console.log('pendingTasksList', pendingTasksList)
  let finishedTasksList = document.querySelector('.tarefas-terminadas div')

  pendingTasksList.innerHTML = ''
  finishedTasksList.innerHTML = ''
}

async function getUserTasks(tokenJwt) {
  const inputAddedTask = document.querySelector('.tarefas-pendentes div')
  const inputAddedTaskCompleted = document.querySelector(
    '.tarefas-terminadas div'
  )
  // console.log('inputAddedTask', inputAddedTask)
  let configRequest = {
    headers: {
      Authorization: tokenJwt,
    },
  }
  try {
    let dados = await fetch(
      'https://ctd-fe2-todo-v2.herokuapp.com/v1/tasks',
      configRequest
    )

    if (dados.status == 200) {
      let dadosConvertidos = await dados.json()
      dadosConvertidos.forEach((tarefa) => {
        const item = `
        <li class="tarefa"> 
        <div id="btnDone" class="not-done" onclick="atualizarTarefa(${
          tarefa.id
        })"></div>
        <div class="descricao">
          <p class="nome">${tarefa.description}</p>
          <p class="timestamp">Criada em: ${formatDate(tarefa.createdAt)}</p>
          <div onclick="deletarTarefa(${tarefa.id})" >
            <i class="far fa-trash-alt delete">
            </i>
          </div>
        </div>
      </li>
            `
        if (!tarefa.completed) {
          inputAddedTask.innerHTML += item
        } else {
          inputAddedTaskCompleted.innerHTML += item
        }
      })
    } else {
      throw dados
    }
  } catch (error) {
    console.log('erro', error)
  }
}

async function buscaDadosUsuario() {
  let configRequest = {
    headers: {
      Authorization: tokenJwt,
    },
  }

  try {
    let resposta = await fetch(
      'https://ctd-fe2-todo-v2.herokuapp.com/v1/users/getMe',
      configRequest
    )

    if (resposta.status == 200) {
      let respostaConvertida = await resposta.json()

      exibeNomeUsuario(respostaConvertida)
    } else {
      throw resposta
    }
  } catch (error) {
    if (error.status == 404 || error.status == 500) {
      errorBuscaDados()
      console.log(error)
    }
  }
}

function successBuscaDados() {
  alert('Sucesso!')
}
function errorBuscaDados() {
  alert('User does not exist and/ or Server error')
}

function exibeNomeUsuario(objetoUsuario) {
  let p = document.getElementById('userName')
  p.innerText = `${objetoUsuario.firstName} ${objetoUsuario.lastName}`
}

// Finalizar Sessão

logOut.addEventListener('click', () => {
  sessionStorage.removeItem('jwt')
  location.href = 'index.html'
})

// funcoes e eventos de criar tarefa(to-do)

let objTask = {
  description: '',
  completed: false,
}

let objTaskJson = ''

// const btnCompleted = document.getElementById('btnDone')

// btnCompleted.addEventListener('click', (e) => {
//   e.preventDefault()

//   btnCompleted.classList.toggle('done')
//   if (objTask.completed == false) {
//     objTask.completed == true
//   } else {
//     objTask.completed = false
//   }
// })

/*********************botao criar tarefa********************/

async function newTaskApi(obj, tokenJwt) {
  let configRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: tokenJwt,
    },
    body: obj,
  }

  try {
    let data = await fetch(
      'https://ctd-fe2-todo-v2.herokuapp.com/v1/tasks',
      configRequest
    )

    if (data.status === 200 || data.status === 201) {
      clearTasks()
      await getUserTasks(tokenJwt)
    } else {
      throw data
    }
  } catch (error) {
    console.log(error)
  }
}

const newTask = document.querySelector('.nova-tarefa')

newTask.addEventListener('submit', (e) => {
  e.preventDefault()
  const toDo = newTask.add.value.trim().toLowerCase()

  // console.log('toDo', toDo)

  if (toDo.length) {
    objTask.description = toDo
    let objTaskJson = JSON.stringify(objTask)
    // console.log(objTaskJson)
    // generateTemplateHtml(toDo)
    newTaskApi(objTaskJson, tokenJwt)

    newTask.reset()
  }
})

// formatando data(será chamada no generateTemplateHtml)
const formatDate = () => {
  let data = new Date(),
    dia = data.getDate().toString(),
    diaF = dia.length == 1 ? '0' + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = mes.length == 1 ? '0' + mes : mes,
    anoF = data.getFullYear()
  return diaF + '/' + mesF + '/' + anoF
}
// const inputAddedTask = document.querySelector('.tarefas-pendentes div')

const generateTemplateHtml = (todo) => {
  let formattedDate = formatDate()
  const html = `
      <li class="tarefa">
        <div id="btnDone" class="not-done"></div>
        <div class="descricao">
          <p class="nome">${todo}</p>
          <p class="timestamp">Criada em: ${formattedDate}</p>
          <i class="fa-solid fa-pen-to-square edit"></i>
          <i class="far fa-trash-alt delete"></i>
        </div>
      </li>
`
  if (todo.completed == false) {
    inputAddedTask.innerHTML += html
  }
}

/****************função assíncrona enviarTarefa para API ******************/
// const undoneTask = document.querySelector('.undone-task')
// const doneTask = document.querySelector('.done-task')

async function atualizarTarefa(id) {
  let configRequest = {
    headers: {
      'Content-Type': 'Application/json',
      Authorization: tokenJwt,
    },
  }

  try {
    let data = await fetch(
      `https://ctd-fe2-todo-v2.herokuapp.com/v1/tasks/${id}`,
      configRequest
    )
    // console.log('data', data)

    let resp = await data.json()

    // console.log('resp', resp)

    if (data.status == 200 || data.status == 201) {
      objTask = {
        description: resp.description,
        completed: resp.completed === true ? false : true,
      }
      let objTaskJson = JSON.stringify(objTask)
      // console.log(objTaskJson)
      // generateTemplateHtml(toDo)

      let configRequestPut = {
        method: 'PUT',
        headers: {
          'Content-type': 'Application/Json',
          Authorization: tokenJwt,
        },
        body: objTaskJson,
      }
      try {
        let response = await fetch(
          `https://ctd-fe2-todo-v2.herokuapp.com/v1/tasks/${id}`,
          configRequestPut
        )
        let resp = await response.json()

        if (response.status === 200 || response.status === 201) {
          // console.log('resp put', resp)
          clearTasks()
          await getUserTasks(tokenJwt)
        } else {
          throw response
        }
      } catch (error) {
        console.log(error) //tratar erros em breve...
      }
    }
  } catch (error) {
    console.log(error) //tratar erros em breve...
  }
}

// const btnDel = document.getElementById("btnDel")

async function deletarTarefa(id) {
  let configRequest = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'Application/json',
      Authorization: tokenJwt,
    },
  }
  try {
    let response = await fetch(
      `https://ctd-fe2-todo-v2.herokuapp.com/v1/tasks/${id}`,
      configRequest
    )
    // console.log('response', response)
    if (response.status === 200 || response.status === 201) {
      clearTasks()
      await getUserTasks(tokenJwt)
    } else {
      throw response
    }
    let data = await response.json()
    // console.log('data', data)
  } catch (error) {
    console.log(error)
  }
}

/* animações do to do */

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