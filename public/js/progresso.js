async function getProgresso(user, callback) {
    try {
        let response = await getPerfil(user)
        let perfil = {}

        if (response.status === 404) perfil = await createPerfil(user)
        else if (response.status === 200) perfil = await response.json()
        else throw response

        console.log(perfil)
        callback(perfil)
    } catch (error) {
        console.log(error)
        modalError("Erro ao buscar os dados de progresso do usuário!")
    }
}

async function atualizaProgresso(user,indice,tempo,finalizado,callback=null){
    try {
        let response = await updateProgresso(user,indice,tempo,finalizado)
        if (response.status !== 204) throw response
        else if (callback) callback()
        else console.log("Progresso atualizado!")
    } catch (error) {
        console.log(error)
        modalError("Erro ao atualizar o seu progresso!")
    }
}

function updateProgresso(user,indice,tempo,finalizado) {
    return new Promise((resolve, reject) => {
        fetch("https://api-curso-programacao-web.vercel.app/api/curso/progresso/"+user.uid, {
            headers: {
                "Authorization": "Basic <ADMIN_AUTH_TOKEN>"
            },
            "method": "PUT",
            "body": JSON.stringify({
                indice: {
                    aula: indice[0],
                    parte: indice[1]
                },
                progresso: {
                    finalizado: finalizado,
                    tempo: tempo
                }
            })
        })
            .then(res => resolve(res))
            .catch(error => reject(error))
    })
    
}

function exibirProgresso(perfil) {
    let tempoCurso = 0
    aulas.forEach(aula => aula.forEach(parte => tempoCurso += parte.duracao))
    let horasCurso = secondsToHour(tempoCurso)

    let tempoAssistido = 0
    perfil.progresso.forEach(aula => aula.forEach(parte => tempoAssistido += parte.tempo || 0))
    let horasAssistidas = secondsToHour(tempoAssistido)

    document.querySelector("#tempoAssistido").textContent = `${horasAssistidas} / ${horasCurso}`

    let videos = 0
    perfil.progresso.forEach(aula => aula.forEach(parte => videos++))
    console.log(videos)

    let videosFinalizados = 0
    perfil.progresso.forEach(aula => aula.forEach(parte => videosFinalizados += parte.finalizado ? 1 : 0))
    console.log(perfil)
    console.log(videosFinalizados)

    document.querySelector("#videosAssistidos").textContent = `${videosFinalizados} / ${videos}`

    //Conquista da primeira aula
    if (perfil.progresso[0][0].finalizado) liberarConquista("conquista1")
    //Conquista de 10 aulas
    if (videosFinalizados >= 10) liberarConquista("conquista2")
    //Conquista de 20 aulas
    if (videosFinalizados >= 20) liberarConquista("conquista3")
    //Conquista de 30 aulas
    if (videosFinalizados >= 30) liberarConquista("conquista4")
    //Conquista de Curso Concluido
    if (videosFinalizados >= videos) liberarConquista("conquista5")

    let div = document.querySelector(".aulas-assistidas")
    let newAulas = [...aulas]
    newAulas = newAulas.map((aulaCompleta,aCI) => {
        return aulaCompleta.map((aula,aI) => {
            return {...aula,...perfil.progresso[aCI][aI]}
        })
    })

    let aulasAssistidas = []
    newAulas.forEach(a => {
        if (a.find(p => p.finalizado == true)) aulasAssistidas.push(a.filter(p => p.finalizado === true))
    })

    console.log({newAulas,div,aulasAssistidas})

    createPreview(aulasAssistidas,div)
}

function liberarConquista(id) {
    document.querySelector("#nenhuma-conquista").classList.add("oculto")
    document.querySelector("#"+id).classList.remove("oculto")
}