if (document.querySelector("#modalLoading")) {
    var modalLoading = new bootstrap.Modal('#modalLoading', {
        keyboard: false,
        backdrop: 'static'
    })
    
    modalLoading.show()
}

if (document.querySelector("#modalErro")) {
    var modalErro = new bootstrap.Modal('#modalErro', {
        keyboard: false,
        backdrop: 'static'
    })
}

function modalError(msg) {
    document.querySelector("#modalErro .modal-body").textContent = msg
    if (modalErro) modalErro.show()
}

function closeError() {
    window.location.reload()
}