function validateInput(input, select=false) {
    if (!input || !input.value || input.value == "") input.classList.add("is-invalid")
    else if (select && input.value == "Escolha uma opção") input.classList.add("is-invalid")
    else input.classList.remove("is-invalid")
}

function validateCheckboxes(checkbox) {
    if (!checkbox || !checkbox.checked) checkbox.classList.add("is-invalid")
    else checkbox.classList.remove("is-invalid")
}

let fields = ["nome","sobrenome","email","data_nascimento","ddd","telefone","github"]
let selects = ["experiencia_logica","experiencia_javascript"]
let checkboxes = ["confirmacao_repositorio","confirmacao_perfil"]

fields.forEach(field => {
    let input = document.querySelector("#"+field)
    input.addEventListener("input",inp => validateInput(inp.target))
})

selects.forEach(select => {
    let elem = document.querySelector("#"+select)
    elem.addEventListener("change",e => validateInput(e.target,true))
})

checkboxes.forEach(checkbox => {
    let input = document.querySelector("#"+checkbox)
    input.addEventListener("change",inp => validateCheckboxes(inp.target))
})

document.querySelector("#formulario_acesso").addEventListener("submit", event => {
    event.preventDefault()

    const response = {}

    fields.forEach(field => {
        let elem = document.querySelector("#"+field)
        validateInput(elem)
        response[field] = elem.value
    })

    selects.forEach(select => {
        let elem = document.querySelector("#"+select)
        validateInput(elem, true)
        response[select] = elem.value
    })

    checkboxes.forEach(checkbox => {
        let input = document.querySelector("#"+checkbox)
        validateCheckboxes(input)
        response[checkbox] = input.checked
    })

    response.ddd = Number(response.ddd)
    response.telefone = Number(response.telefone)
    response.data_submissao = new Date().toLocaleString("pt-BR").replace(",","")
    response.data_nascimento = response.data_nascimento.split("-").reverse().join("/")

    let uid = window.localStorage.getItem("cpw-user-uid")
    if (uid) {
        response.uid = uid
        sendRequest(response)
    } 
    else {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                response.uid = user.uid
                sendRequest(response)
            } 
            else {
                modalError("Não foi possivel identificar o seu login! Logue novamente no sistema!")
            }
        });
    }
    
})

function sendRequest(response) {
    console.log(response)

    if (document.querySelector(".is-invalid")) return

    modalLoading.show()

    enviarSolicitacao(response)
}

async function getAcesso(user) {
    try {
        const request = await fetch("https://api-curso-programacao-web.vercel.app/api/curso/acesso/"+user.uid, {
            headers: {
                "Authorization": "Basic YWRtaW5fcm91dGU6YWRtaW4xMjM="
            }
        });

        if (request.status === 404 || request.status === 400) return false;
        else {
            const response = await request.json();
            return response;
        }
    } catch(error) {
        modalError("Não foi possivel verificar o seu acesso!")
    }
    
}

function createRequest(solicitacao) {
    return new Promise((resolve,reject) => {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/acesso", {
            headers: {
                "Authorization": "Basic YWRtaW5fcm91dGU6YWRtaW4xMjM="
            },
            "method": "POST",
            "body": JSON.stringify({...solicitacao})
        })
            .then(res => resolve(res))
            .catch(error => reject(error))
    })
}

async function enviarSolicitacao(response) {
    try {
        const req = await createRequest(response)
        if (req.status !== 201) {
            const res = await req.json()
            throw new Error(res.error || req.status)
        } else {
            modalLoading.hide()
            document.querySelector(".formulario-solicitacao").classList.add("oculto")
            document.querySelector(".solicitacao-enviada").classList.remove("oculto")
        }
    } 
    catch (error) {
        modalError("Ocorreu um erro ao enviar sua solicitação: " + error.message)
    }
}

function editarSolicitacao(acesso) {
    const keys = Object.keys(acesso)

    keys.forEach(key => {
        let field = document.getElementById(key)
        if (!field) return

        if (key === "data_nascimento") {
            let dateAmerican = acesso[key].split("/").reverse().join("-")
            field.value = dateAmerican
        }
        else if (key === "confirmacao_perfil" || key === "confirmacao_repositorio") {
            if (acesso[key] === true) field.checked = true
            else field.checked = false
        }
        else field.value = acesso[key]
    })
}