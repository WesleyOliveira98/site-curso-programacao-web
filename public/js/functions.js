function secondsToHour(sec) {
    let horas = Math.floor(sec / 3600)
    let minutos = Math.floor((sec % 3600) / 60)
    let segundos = Math.round((sec % 3600) % 60)
    let ifOneDigit = digit => digit < 10 ? "0"+digit : digit
    return `${ifOneDigit(horas)}:${ifOneDigit(minutos)}:${ifOneDigit(segundos)}`
}

function homePreview(user=null) {
    console.log(user)
    const home = document.querySelector(".home-aulas")
    var newAulas = [...aulas]

    if (user) {
        newAulas = newAulas.map((aulaCompleta,aCI) => {
            return aulaCompleta.map((aula,aI) => {
                return {...aula,...user.progresso[aCI][aI]}
            })
        })
        console.log(aulas)
        console.log(newAulas)

        let proximaAula = false
        user.progresso.forEach((pAula,pIndex) => {
            pAula.forEach((a,i) => {
                if (!proximaAula && !a.finalizado) proximaAula = [pIndex,i]
            })
        })
        console.log({proximaAula})

        let button = document.querySelector("#proximaAula")

        if (proximaAula) {
            button.querySelector("span").textContent = "Continuar Curso"
            button.href = "/aulas/?" + aulas[proximaAula[0]][proximaAula[1]].url
        } 

        if (proximaAula[0] === 0 && proximaAula[1] === 0) button.querySelector("span").textContent = "Começar Curso"

        if (!user.progresso.find(p => p.find(a => !a.finalizado))) {
            button.href = "/meu-perfil"
            button.classList.remove("btn")
            button.classList.remove("btn-primary")
            button.classList.add("finalizou")
            button.innerHTML = `<div>
                <h3>Parabéns! Você finalizou o curso!</h3>
                <div class="m-4">
                    <img src="../img/conquistas/5.png" alt="conquista5">
                </div>
            </div>`

            document.querySelector(".contagem-regressiva").parentElement.classList.add("oculto")
        } else document.querySelector(".contagem-regressiva").parentElement.classList.remove("oculto")

        button.classList.remove("oculto")
    }
    else {
        modalLoading.hide()
        modalError("Não foi possivel obter informações do usuário!")
        return
    }

    createPreview(newAulas,home)
    
    modalLoading.hide()
}

function createPreview(aulas,elem){
    aulas.forEach((aula,i) => {
        aula.forEach(a => {
            elem.innerHTML += `<div class="col-md-12 mt-2 mb-2 aula-preview rounded ${!!a.finalizado ? 'aula-assistida-home' : ''}">
                <a href="/aulas/?${a.url}" target="_blank" rel="noopener noreferrer">
                    <img class="rounded mt-2 dim-16-9" src="${a.preview}" alt="${a.titulo}">
                    <div>
                        <div>
                            <h4>Aula ${i+1}</h4>
                            <span title="${a.titulo}">${a.titulo}</span>
                        </div>
                        
                        <div class="display-flex" style="align-items: flex-end">
                            <span>${secondsToHour(a.duracao)}</span>
                            <button class="btn ${!!a.finalizado ? 'btn-secondary' : 'btn-success'}" type="button">
                                ${!!a.finalizado ? 
                                    'Assistido <i class="bi bi-check-circle"></i>' : 
                                        a.tempo && a.tempo > 0 ? 
                                        'Continuar <i class="bi bi-play-circle"></i>' : 
                                        'Assistir <i class="bi bi-play-circle"></i>'
                                }
                            </button>
                           
                        </div>
                        
                    </div>
                </a>
            </div>`
        })
    })
}

function criarIndiceAulas(indice,user) {
    const aside = document.querySelector(".indice-aulas")

    var newAulas = [...aulas]

    if (user) {
        newAulas = newAulas.map((aulaCompleta,aCI) => {
            return aulaCompleta.map((aula,aI) => {
                return {...aula,...user.progresso[aCI][aI]}
            })
        })
        console.log(aulas)
        console.log(newAulas)
    }

    newAulas.forEach((aula, i) => {
        let details = document.createElement("details")
        if (!aula.find(a => a.finalizado === false)) details.classList.add("aula-assistida")
        details.innerHTML = `<summary><span>Aula ${i + 1}</span><div></div></summary>`

        aula.forEach((a, p) => {
            let aulaAtual = indice[0] == i && indice[1] == p
            if (aulaAtual) {
                details.classList.remove("aula-assistida")
                details.classList.add("aula-atual")
                details.innerHTML += `<div class="aula-atual">
                    <a href="#"><div><i class="bi bi-play-btn-fill aula-atual-icon"></i>Parte ${p + 1}</div></a>
                </div>`
            } 
            else if (a.finalizado) details.innerHTML += `<div class="aula-assistida">
                <a href="/aulas/?${a.url}"><div><i class="bi bi-play-btn-fill aula-assistida-icon"></i>Parte ${p + 1}</div></a>
            </div>`
            else details.innerHTML += `<div>
                <a href="/aulas/?${a.url}"><div><i class="bi bi-play-btn-fill"></i>Parte ${p + 1}</div></a>
            </div>`
        })
        aside.appendChild(details)
    })
}

async function infosAula(user=null) {
    console.log(user)
    const indice = getIndice()

    criarIndiceAulas(indice,user)

    let aulaAnterior = [...indice]
    if (aulaAnterior[1] - 1 < 0) {
        aulaAnterior[0]--
        if (aulaAnterior[0] < 0) aulaAnterior = false
        else aulaAnterior[1] = aulas[aulaAnterior[0]].length - 1
    } else aulaAnterior[1]--

    const aulaAnteriorLink = document.querySelector("#aulaAnterior a")
    if (aulaAnterior) aulaAnteriorLink.setAttribute("href", "/aulas/?"+aulas[aulaAnterior[0]][aulaAnterior[1]].url)
    else aulaAnteriorLink.remove()

    let proximaAula = [...indice]
    if (proximaAula[1] + 1 > aulas[indice[0]].length - 1) {
        proximaAula[0]++
        if (proximaAula[0] > 17) proximaAula = false
        else proximaAula[1] = 0
    } else proximaAula[1]++

    const proximaAulaLink = document.querySelector("#proximaAula a")
    let proximaAulaClick = false
    let aulaAtual = aulas[indice[0]][indice[1]]

    if (!proximaAula) proximaAulaLink.innerHTML = 'Finalizar Curso <i class="bi bi-check-circle"></i>'

    proximaAulaLink.addEventListener("click", () => {
        proximaAulaClick = true
        atualizaProgresso(user,indice,Math.round(aulaAtual.duracao) || 0,true, () => {
            modalLoading.show()
            if (proximaAula) window.location.href = "/aulas/?"+aulas[proximaAula[0]][proximaAula[1]].url
            else window.location.href = '/home'
        })
    })
    
    document.querySelector("#aula h1").textContent = `Aula ${indice[0]+1}`
    document.querySelector("#aula h4").textContent = aulaAtual.titulo
    document.querySelector(".video-aula").innerHTML = `<video class="rounded dim-16-9" preload="none" controls poster="${aulaAtual.poster}">
        <source type="video/webm" src="${aulaAtual.video}" />
    </video>`
    
    document.querySelector("#aula iframe").setAttribute("src",aulaAtual.material)

    if (aulaAtual.codigos && aulaAtual.codigos !== "") {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/codigos", {
            headers: {
                "Authorization": "Basic YWRtaW5fcm91dGU6YWRtaW4xMjM="
            },
            "method": "POST",
            "body": JSON.stringify({
                gist: aulaAtual.codigos
            })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                let html = `<link rel="stylesheet" href="${res.stylesheet}">`
                html += res.div
                document.querySelector("#codigos").innerHTML = html
            })
            .catch(error => console.log(error))
    }

    const video = document.querySelector("video")
    let tempo = 0

    if (user.progresso[indice[0]][indice[1]].tempo) {
        tempo = user.progresso[indice[0]][indice[1]].tempo
        video.currentTime = tempo
        video.muted = true
        video.play().then(() => {
            video.pause()
            video.muted = false
        }).catch(error => {
            console.log(error)
        })
    }

    video.addEventListener('timeupdate', () => {
        let tempoAtual = Math.round(video.currentTime)
        let tempoMaximo = Math.round(video.duration)
        console.log({tempoAtual,tempoMaximo})

        if (proximaAulaClick) return
        else if (tempoAtual >= tempo+5){
            tempo = tempoAtual
            atualizaProgresso(user,indice,tempoAtual,false)
        } 
        else if (tempoAtual >= tempoMaximo-15) {
            tempo = tempoMaximo
            atualizaProgresso(user,indice,tempoMaximo,true)
        }
    })

    video.addEventListener('ended', () => {
        atualizaProgresso(user,indice,Math.round(video.duration),true)
    })

    modalLoading.hide()
}

function getIndice() {
    var params = {}
    window.location.search.slice(1).split("&").map(p => p.split("=")).forEach(param => params[param[0]] = param[1])
    console.log(params)

    if (params.aula == 1) {
        document.querySelector("title").textContent = "Aula 1"
        return [0,0]
    } 
    else if (params.aula && params.parte) {
        document.querySelector("title").textContent = `Aula ${params.aula} - Parte ${params.parte}`
        return [params.aula-1,params.parte-1]
    } 
    else window.location.href = "../404.html"
}

async function initHeader(user) {
    try {
        let response = await getPerfil(user)
        let usuario = {}
        if (response.status === 200) usuario = await response.json()
        else throw response

        document.querySelector("#nomeUsuario").textContent = usuario.nome.toLowerCase().split(" ")[0]
        document.querySelector("#avatar").src = usuario.photoURL
    } catch (error) {
        console.log(error)
        
        document.querySelector("#nomeUsuario").textContent = user.displayName.toLowerCase().split(" ")[0]
        document.querySelector("#avatar").src = user.photoURL
    }
}

function colapseIndice() {
    let div = document.querySelector(".colapse-indice")
    if (div.title == "Exibir aulas") {
        div.title = "Ocultar aulas"
        div.querySelector("button i").classList.remove("bi-caret-down-square-fill")
        div.querySelector("button i").classList.add("bi-caret-up-square-fill")
        document.querySelectorAll(".indice-aulas details").forEach(aula => aula.classList.add("exibir-aula"))
        document.querySelector(".indice-aulas").classList.add("animate__slideInDown")
    } else {
        div.title = "Exibir aulas"
        div.querySelector("button i").classList.add("bi-caret-down-square-fill")
        div.querySelector("button i").classList.remove("bi-caret-up-square-fill")
        document.querySelectorAll(".indice-aulas details").forEach(aula => aula.classList.remove("exibir-aula"))
        document.querySelector(".indice-aulas").classList.remove("animate__slideInDown")
    }
}