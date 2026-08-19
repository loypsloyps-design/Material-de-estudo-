/* ==========================================
   NSS PMES
   SISTEMA PRINCIPAL
========================================== */


/* PERFIL */

const profiles = {
    Felipe: {
        name: "Felipe",
        level: 4
    },

    Primo: {
        name: "Primo",
        level: 1
    }
};


let activeProfile =
    localStorage.getItem("nss_pmes_profile") || "Felipe";


function atualizarPerfil() {

    const profile = profiles[activeProfile];

    document.getElementById("profileName").textContent =
        profile.name;

    document.getElementById("profileLevel").textContent =
        `Nível ${profile.level}`;

    document.getElementById("topName").textContent =
        profile.name;

    document.getElementById("welcome").textContent =
        `Fala aí, ${profile.name}! 👋`;
}


atualizarPerfil();


/* ==========================================
   NAVEGAÇÃO
========================================== */

const menuItems =
    document.querySelectorAll(".menu-item");

const pages =
    document.querySelectorAll(".page");


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const pageId =
            item.dataset.page;

        menuItems.forEach(btn =>
            btn.classList.remove("active")
        );

        item.classList.add("active");

        pages.forEach(page =>
            page.classList.remove("active-page")
        );

        const selected =
            document.getElementById(pageId);

        if (selected) {
            selected.classList.add("active-page");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


/* ==========================================
   MODAL DE PERFIL
========================================== */

const profileModal =
    document.getElementById("profileModal");


document
    .getElementById("switchProfile")
    .addEventListener("click", () => {

        profileModal.classList.add("show");

    });


document
    .getElementById("profileSelector")
    .addEventListener("click", () => {

        profileModal.classList.add("show");

    });


document
    .getElementById("topProfile")
    .addEventListener("click", () => {

        profileModal.classList.add("show");

    });


function fecharModal() {

    profileModal.classList.remove("show");

}


function trocarPerfil(nome) {

    activeProfile = nome;

    localStorage.setItem(
        "nss_pmes_profile",
        nome
    );

    atualizarPerfil();

    fecharModal();

}


/* ==========================================
   AULA
========================================== */

function abrirAula() {

    const aulaMenu =
        document.querySelector(
            '[data-page="aula"]'
        );

    if (aulaMenu) {
        aulaMenu.click();
    }

}


/* ==========================================
   FECHAR MODAL CLICANDO FORA
========================================== */

profileModal.addEventListener(
    "click",
    event => {

        if (
            event.target === profileModal
        ) {
            fecharModal();
        }

    }
);


/* ==========================================
   SALVAMENTO DE PROGRESSO
========================================== */

function salvarProgresso(chave, valor) {

    const dados =
        JSON.parse(
            localStorage.getItem(
                `nss_${activeProfile}`
            )
        ) || {};

    dados[chave] = valor;

    localStorage.setItem(
        `nss_${activeProfile}`,
        JSON.stringify(dados)
    );

}


function carregarProgresso(chave) {

    const dados =
        JSON.parse(
            localStorage.getItem(
                `nss_${activeProfile}`
            )
        ) || {};

    return dados[chave];

}


/* ==========================================
   REDAÇÃO
========================================== */

const redacao =
    document.querySelector(".redacao-area");


if (redacao) {

    const textoSalvo =
        carregarProgresso("redacao");

    if (textoSalvo) {
        redacao.value = textoSalvo;
    }

    redacao.addEventListener(
        "input",
        () => {

            salvarProgresso(
                "redacao",
                redacao.value
            );

        }
    );

}


/* ==========================================
   DATA
========================================== */

console.log(
    "NSS-PMES carregado com sucesso."
);

console.log(
    `Perfil ativo: ${activeProfile}`
);
