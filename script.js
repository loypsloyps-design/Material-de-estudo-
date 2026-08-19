/* ==========================================
   NSS-PMES
   SISTEMA PRINCIPAL
========================================== */


/* ==========================================
   PERFIS
========================================== */

const profiles = {

    Felipe: {
        name: "Felipe"
    },

    Primo: {
        name: "Primo"
    }

};


/* ==========================================
   PERFIL ATIVO
========================================== */

let activeProfile =
    localStorage.getItem("nss_pmes_profile") || "Felipe";


/* ==========================================
   DADOS PADRÃO
========================================== */

function criarDadosIniciais() {

    return {

        nivel: 1,

        xp: 0,

        xpProximoNivel: 500,

        sequencia: 0,

        tempoEstudo: 0,

        questoesRespondidas: 0,

        questoesAcertadas: 0,

        progressoEdital: 0,

        ultimaDataEstudo: null,

        assuntosConcluidos: {},

        questoes: {},

        revisoes: [],

        redacao: ""

    };

}


/* ==========================================
   CARREGAR DADOS
========================================== */

function carregarDados() {

    const chave =
        `nss_${activeProfile}`;

    const dadosSalvos =
        localStorage.getItem(chave);


    if (!dadosSalvos) {

        const novosDados =
            criarDadosIniciais();

        localStorage.setItem(
            chave,
            JSON.stringify(novosDados)
        );

        return novosDados;

    }


    try {

        return JSON.parse(
            dadosSalvos
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        const novosDados =
            criarDadosIniciais();

        localStorage.setItem(
            chave,
            JSON.stringify(novosDados)
        );

        return novosDados;

    }

}


/* ==========================================
   DADOS DO PERFIL
========================================== */

let dadosPerfil =
    carregarDados();


/* ==========================================
   SALVAR DADOS
========================================== */

function salvarDados() {

    localStorage.setItem(

        `nss_${activeProfile}`,

        JSON.stringify(
            dadosPerfil
        )

    );

}


/* ==========================================
   ATUALIZAR PERFIL
========================================== */

function atualizarPerfil() {

    const profile =
        profiles[activeProfile];


    if (!profile) return;


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileLevel =
        document.getElementById(
            "profileLevel"
        );


    const topName =
        document.getElementById(
            "topName"
        );


    const welcome =
        document.getElementById(
            "welcome"
        );


    if (profileName) {

        profileName.textContent =
            profile.name;

    }


    if (profileLevel) {

        profileLevel.textContent =
            `Nível ${dadosPerfil.nivel}`;

    }


    if (topName) {

        topName.textContent =
            profile.name;

    }


    if (welcome) {

        welcome.textContent =
            `Fala aí, ${profile.name}! 👋`;

    }

}


/* ==========================================
   NAVEGAÇÃO
========================================== */

const menuItems =
    document.querySelectorAll(
        ".menu-item"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


menuItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const pageId =
                item.dataset.page;


            menuItems.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            item.classList.add(
                "active"
            );


            pages.forEach(page => {

                page.classList.remove(
                    "active-page"
                );

            });


            const selected =
                document.getElementById(
                    pageId
                );


            if (selected) {

                selected.classList.add(
                    "active-page"
                );

            }


            /* Atualiza a página de matérias */

            if (
                pageId === "materias"
            ) {

                renderizarMaterias();

            }


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

});


/* ==========================================
   RENDERIZAR MATÉRIAS
========================================== */

function renderizarMaterias() {

    const container =
        document.getElementById(
            "materiasContainer"
        );


    if (!container) return;


    container.innerHTML = "";


    materiasPMES.forEach(
        materia => {


            const progresso =
                calcularProgressoMateria(
                    materia,
                    dadosPerfil
                );


            const concluidos =
                contarAssuntosConcluidos(
                    materia
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "subject-card";


            card.innerHTML = `

                <h3>
                    ${materia.icone}
                    ${materia.nome}
                </h3>


                <div class="subject-content">

                    <div class="
                        mini-circle
                        ${
                            progresso >= 70
                                ? "green-circle"
                                : "yellow-circle"
                        }
                    ">

                        ${progresso}%

                    </div>


                    <div>

                        <p>
                            Assuntos:
                            <b>
                                ${materia.assuntos.length}
                            </b>
                        </p>


                        <p>
                            Concluídos:
                            <b>
                                ${concluidos}
                            </b>
                        </p>

                    </div>

                </div>


                <div class="progress">

                    <div
                        style="
                            width:${progresso}%;
                        "
                    ></div>

                </div>


                <button
                    onclick="
                        abrirMateria('${materia.id}')
                    "
                >

                    Ver matéria

                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   CONTAR ASSUNTOS CONCLUÍDOS
========================================== */

function contarAssuntosConcluidos(
    materia
) {

    let total = 0;


    materia.assuntos.forEach(
        (assunto, index) => {

            const chave =
                `${materia.id}_assunto_${index}`;


            if (
                dadosPerfil[chave] &&
                dadosPerfil[chave].concluido
            ) {

                total++;

            }

        }
    );


    return total;

}


/* ==========================================
   ABRIR MATÉRIA
========================================== */

function abrirMateria(
    materiaId
) {

    const materia =
        materiasPMES.find(
            item =>
                item.id === materiaId
        );


    if (!materia) return;


    console.log(
        "Matéria selecionada:",
        materia.nome
    );


    alert(

        `${materia.nome}\n\n` +

        `Assuntos disponíveis: ` +

        `${materia.assuntos.length}\n\n` +

        `A próxima etapa será abrir ` +

        `os assuntos, materiais, aulas ` +

        `e questões.`

    );

}


/* ==========================================
   MODAL DE PERFIL
========================================== */

const profileModal =
    document.getElementById(
        "profileModal"
    );


const switchProfile =
    document.getElementById(
        "switchProfile"
    );


const profileSelector =
    document.getElementById(
        "profileSelector"
    );


const topProfile =
    document.getElementById(
        "topProfile"
    );


if (switchProfile) {

    switchProfile.addEventListener(
        "click",
        () => {

            if (profileModal) {

                profileModal.classList.add(
                    "show"
                );

            }

        }
    );

}


if (profileSelector) {

    profileSelector.addEventListener(
        "click",
        () => {

            if (profileModal) {

                profileModal.classList.add(
                    "show"
                );

            }

        }
    );

}


if (topProfile) {

    topProfile.addEventListener(
        "click",
        () => {

            if (profileModal) {

                profileModal.classList.add(
                    "show"
                );

            }

        }
    );

}


/* ==========================================
   FECHAR MODAL
========================================== */

function fecharModal() {

    if (!profileModal) return;


    profileModal.classList.remove(
        "show"
    );

}


/* ==========================================
   TROCAR PERFIL
========================================== */

function trocarPerfil(
    nome
) {

    if (!profiles[nome]) return;


    activeProfile =
        nome;


    localStorage.setItem(
        "nss_pmes_profile",
        nome
    );


    dadosPerfil =
        carregarDados();


    atualizarPerfil();

    atualizarDashboard();

    renderizarMaterias();

    fecharModal();

}


/* ==========================================
   FECHAR MODAL CLICANDO FORA
========================================== */

if (profileModal) {

    profileModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                profileModal
            ) {

                fecharModal();

            }

        }
    );

}


/* ==========================================
   ABRIR AULA
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
   SALVAR PROGRESSO
========================================== */

function salvarProgresso(
    chave,
    valor
) {

    dadosPerfil[chave] =
        valor;


    salvarDados();

}


/* ==========================================
   CARREGAR PROGRESSO
========================================== */

function carregarProgresso(
    chave
) {

    return dadosPerfil[chave];

}


/* ==========================================
   CONCLUIR ASSUNTO
========================================== */

function concluirAssunto(
    materiaId,
    assuntoIndex
) {

    const chave =
        `${materiaId}_assunto_${assuntoIndex}`;


    dadosPerfil[chave] = {

        concluido: true,

        data:
            new Date().toISOString()

    };


    salvarDados();


    atualizarDashboard();


    renderizarMaterias();

}


/* ==========================================
   ADICIONAR XP
========================================== */

function adicionarXP(
    quantidade
) {

    dadosPerfil.xp +=
        quantidade;


    while (
        dadosPerfil.xp >=
        dadosPerfil.xpProximoNivel
    ) {

        dadosPerfil.xp -=
            dadosPerfil.xpProximoNivel;


        dadosPerfil.nivel++;


        dadosPerfil.xpProximoNivel =
            Math.round(

                dadosPerfil.xpProximoNivel *
                1.25

            );

    }


    salvarDados();


    atualizarPerfil();


    atualizarDashboard();

}


/* ==========================================
   REGISTRAR QUESTÃO
========================================== */

function registrarQuestao(
    questaoId,
    acertou
) {

    dadosPerfil.questoesRespondidas++;


    if (acertou) {

        dadosPerfil.questoesAcertadas++;


        adicionarXP(10);

    } else {

        dadosPerfil.revisoes.push({

            questaoId:
                questaoId,

            data:
                new Date().toISOString()

        });


        adicionarXP(3);

    }


    dadosPerfil.questoes[questaoId] = {

        acertou:
            acertou,

        data:
            new Date().toISOString()

    };


    salvarDados();


    atualizarDashboard();

}


/* ==========================================
   PROGRESSO GERAL DO EDITAL
========================================== */

function calcularProgressoGeral() {

    let total = 0;

    let concluidos = 0;


    materiasPMES.forEach(
        materia => {

            materia.assuntos.forEach(
                (assunto, index) => {

                    total++;


                    const chave =
                        `${materia.id}_assunto_${index}`;


                    if (
                        dadosPerfil[chave] &&
                        dadosPerfil[chave].concluido
                    ) {

                        concluidos++;

                    }

                }
            );

        }
    );


    if (total === 0) {

        return 0;

    }


    return Math.round(

        (
            concluidos /
            total
        ) * 100

    );

}


/* ==========================================
   APROVEITAMENTO
========================================== */

function calcularAproveitamento() {

    if (
        dadosPerfil.questoesRespondidas ===
        0
    ) {

        return 0;

    }


    return Math.round(

        (

            dadosPerfil.questoesAcertadas /

            dadosPerfil.questoesRespondidas

        ) * 100

    );

}


/* ==========================================
   ATUALIZAR DASHBOARD
========================================== */

function atualizarDashboard() {

    const progresso =
        calcularProgressoGeral();


    const aproveitamento =
        calcularAproveitamento();


    console.log(
        "Progresso:",
        progresso + "%"
    );


    console.log(
        "Aproveitamento:",
        aproveitamento + "%"
    );


    console.log(
        "XP:",
        dadosPerfil.xp
    );


    console.log(
        "Nível:",
        dadosPerfil.nivel
    );


    /*
       Por enquanto os cards do dashboard
       ainda possuem valores visuais fixos.

       Na próxima etapa vamos conectar
       esses cards aos dados reais.
    */

}


/* ==========================================
   REDAÇÃO
========================================== */

const redacao =
    document.querySelector(
        ".redacao-area"
    );


if (redacao) {

    const textoSalvo =
        carregarProgresso(
            "redacao"
        );


    if (textoSalvo) {

        redacao.value =
            textoSalvo;

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
   RESETAR PERFIL
========================================== */

function resetarPerfil() {

    const confirmar =
        confirm(

            "ATENÇÃO!\n\n" +

            "Isso vai apagar todo o progresso " +

            `do perfil ${activeProfile}.\n\n` +

            "Deseja continuar?"

        );


    if (!confirmar) return;


    dadosPerfil =
        criarDadosIniciais();


    salvarDados();


    atualizarPerfil();


    atualizarDashboard();


    renderizarMaterias();


    alert(
        "Progresso zerado com sucesso! 🚔🔥"
    );

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

atualizarPerfil();


atualizarDashboard();


renderizarMaterias();


console.log(
    "================================"
);


console.log(
    "NSS-PMES carregado com sucesso."
);


console.log(
    `Perfil ativo: ${activeProfile}`
);


console.log(
    `Nível: ${dadosPerfil.nivel}`
);


console.log(
    `XP: ${dadosPerfil.xp}`
);


console.log(
    "================================"
);

/* ==========================================
   RESETAR PROGRESSO DO PERFIL
========================================== */

function resetarProgresso() {

    const confirmar = confirm(
        "⚠️ ATENÇÃO!\n\n" +
        "Isso vai apagar todo o progresso deste perfil:\n\n" +
        "• XP\n" +
        "• Nível\n" +
        "• Questões\n" +
        "• Assuntos concluídos\n" +
        "• Revisões\n" +
        "• Redação salva\n" +
        "• Tempo de estudo\n\n" +
        "Deseja realmente começar do ZERO?"
    );

    if (!confirmar) return;

    localStorage.removeItem(
        `nss_${activeProfile}`
    );

    dadosPerfil = criarDadosIniciais();

    salvarDados();

    atualizarPerfil();

    atualizarDashboard();

    renderizarMaterias();

    alert(
        "✅ Progresso resetado!\n\n" +
        "O perfil começou do zero."
    );

}
