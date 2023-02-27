function getPerfil(user) {
    return new Promise((resolve,reject) => {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/perfil/"+user.uid, {
            headers: {
                "Authorization": "Basic <ADMIN_AUTH_TOKEN>"
            }
        })
            .then(res => resolve(res))
            .catch(error => reject(error))
    })
}

function createPerfil(user) {
    return new Promise((resolve,reject) => {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/perfil", {
            headers: {
                "Authorization": "Basic <ADMIN_AUTH_TOKEN>"
            },
            "method": "POST",
            "body": JSON.stringify({
                uid: user.uid,
                nome: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            })
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(error => reject(error))
    })
}

function editPerfil(user) {
    return new Promise((resolve,reject) => {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/perfil/"+user.uid, {
            headers: {
                "Authorization": "Basic <ADMIN_AUTH_TOKEN>"
            },
            "method": "PUT",
            "body": JSON.stringify(user)
        })
            .then(res => resolve(res))
            .catch(error => reject(error))
    })
}

async function initPerfil(user) {
    document.querySelector("#inputName").addEventListener("focusout", event => {
        let id = event?.relatedTarget?.parentElement?.parentElement?.id
        if (!id || id !== "saveName") cancelChange()
    })

    document.querySelector("#formNome").addEventListener("submit", event => {
        event.preventDefault()
        saveName()
    })

    try {
        let response = await getPerfil(user)
        let usuario = {}
        if (response.status === 200) usuario = await response.json()
        else throw response

        document.querySelector("#userName").textContent = usuario.nome
        document.querySelector("#userEmail").textContent = usuario.email
        document.querySelector("#userPhoto").src = usuario.photoURL
        document.querySelector("#userUid").textContent = usuario.uid
    } catch (error) {
        console.log(error)
        modalError("Erro ao buscar perfil do usuário!")

        document.querySelector("#userName").textContent = "----"
        document.querySelector("#userEmail").textContent = user.email
        document.querySelector("#userPhoto").src = user.photoURL
        document.querySelector("#userUid").textContent = user.uid
    }

    modalLoading.hide()
}

function changeName() {
    let form = document.querySelector("#formNome")
    let input = document.querySelector("#inputName")
    let nome = document.querySelector("#userName")
    let change = document.querySelector("#changeName")
    let save = document.querySelector("#saveName")

    form.classList.remove("oculto")
    input.value = ""
    input.focus()
    input.value = nome.textContent
    nome.classList.add("oculto")

    change.classList.add("oculto")
    save.classList.remove("oculto")
}

function cancelChange() {
    let form = document.querySelector("#formNome")
    let nome = document.querySelector("#userName")
    let change = document.querySelector("#changeName")
    let save = document.querySelector("#saveName")

    form.reset()
    form.classList.add("oculto")
    nome.classList.remove("oculto")

    change.classList.remove("oculto")
    save.classList.add("oculto")
}

async function saveName() {
    let form = document.querySelector("#formNome")
    let input = document.querySelector("#inputName")
    let nome = document.querySelector("#userName")
    let nomeHeader = document.querySelector("#nomeUsuario")
    let change = document.querySelector("#changeName")
    let save = document.querySelector("#saveName")

    if (!input.value) {
        cancelChange()
        return
    }

    try {
        modalLoading.show()

        let response = await editPerfil({
            nome: input.value,
            email: document.querySelector("#userEmail").textContent,
            photoURL: document.querySelector("#userPhoto").src,
            uid: document.querySelector("#userUid").textContent,
        })

        if (response.status !== 204) throw response

        form.classList.add("oculto")
        nome.textContent = input.value
        nome.classList.remove("oculto")

        nomeHeader.textContent = input.value.toLowerCase().split(" ")[0]

        change.classList.remove("oculto")
        save.classList.add("oculto")

        modalLoading.hide()
    } catch (error) {
        console.log(error)
        modalError("Erro ao editar perfil do usuário!")
    }
    
}