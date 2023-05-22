setInterval(() => {
    let tempo = {
        meses: moment("20230901", "YYYYMMDD").diff(moment(),'months'),
        dias: moment().endOf('month').diff(moment(),'days'),
        horas: moment().endOf('day').diff(moment(),'hours'),
        minutos: moment().endOf('hour').diff(moment(),'minutes'),
        segundos: moment().endOf('minute').diff(moment(),'seconds')
    }
    
    console.log({tempo})

    let campos = Object.keys(tempo)

    campos.forEach(campo => {
        document.querySelector(".contagem-regressiva #"+campo).innerHTML = `
            <h1>${ifOneDigit(tempo[campo])}</h1>
            <span class="text-capitalize">${campo}</span>
        `
    })

},1000)


function ifOneDigit(digit) {
    if (digit < 10) return "0"+digit
    else return digit
}