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

        const dados =
            JSON.parse(dadosSalvos);

        /*
            Garante que dados antigos
            recebam novas propriedades.
        */

        const dadosPadrao =
            criarDadosIniciais();

        return {
            ...dadosPadrao,
            ...dados
        };

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


    document
        .querySelectorAll("[data-nivel]")
        .forEach(element => {

            element.textContent =
                dadosPerfil.nivel;

        });

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
                "subject-card materia-card";


            card.innerHTML = `

                <div class="materia-card-top">

                    <div
                        class="materia-icon ${materia.cor}"
                    >
                        ${materia.icone}
                    </div>

                    <div>

                        <h3>
                            ${materia.nome}
                        </h3>

                        <p>
                            ${materia.assuntos.length}
                            assuntos
                        </p>

                    </div>

                </div>


                <div class="materia-progress-info">

                    <span>
                        Progresso
                    </span>

                    <strong>
                        ${progresso}%
                    </strong>

                </div>


                <div class="progress">

                    <div
                        style="
                            width:${progresso}%;
                        "
                    ></div>

                </div>


                <div class="materia-footer">

                    <span>
                        ${concluidos}
                        /
                        ${materia.assuntos.length}
                        concluídos
                    </span>


                    <button
                        onclick="
                            abrirMateria('${materia.id}')
                        "
                    >
                        Ver matéria →
                    </button>

                </div>

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


    const paginaMaterias =
        document.getElementById(
            "materias"
        );


    if (!paginaMaterias) return;


    const progresso =
        calcularProgressoMateria(
            materia,
            dadosPerfil
        );


    paginaMaterias.innerHTML = `

        <div class="materia-detalhes">


            <button
                class="back-button"
                onclick="voltarMaterias()"
            >
                ← Voltar para matérias
            </button>


            <div class="materia-header">


                <div
                    class="
                        materia-header-icon
                        ${materia.cor}
                    "
                >
                    ${materia.icone}
                </div>


                <div>

                    <h1>
                        ${materia.nome}
                    </h1>

                    <p>
                        Estude cada assunto e acompanhe
                        sua evolução.
                    </p>

                </div>


            </div>


            <div class="materia-resumo">


                <div>

                    <span>
                        Progresso
                    </span>

                    <strong id="materiaProgresso">
                        ${progresso}%
                    </strong>

                </div>


                <div>

                    <span>
                        Assuntos
                    </span>

                    <strong>
                        ${materia.assuntos.length}
                    </strong>

                </div>


                <div>

                    <span>
                        Concluídos
                    </span>

                    <strong id="materiaConcluidos">
                        ${contarAssuntosConcluidos(materia)}
                    </strong>

                </div>


            </div>


            <div class="materia-progress-large">

                <div class="progress">

                    <div
                        id="materiaBarra"
                        style="
                            width:${progresso}%;
                        "
                    ></div>

                </div>

            </div>


            <div class="assuntos-header">

                <h2>
                    Assuntos
                </h2>

                <span>
                    ${materia.assuntos.length}
                    conteúdos
                </span>

            </div>


            <div
                class="assuntos-list"
                id="assuntosList"
            >

                ${materia.assuntos.map(
                    (assunto, index) =>
                        criarCardAssunto(
                            materia,
                            assunto,
                            index
                        )
                ).join("")}

            </div>


        </div>

    `;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==========================================
   CRIAR CARD DO ASSUNTO
========================================== */

function criarCardAssunto(
    materia,
    assunto,
    index
) {

    const chave =
        `${materia.id}_assunto_${index}`;


    const concluido =
        dadosPerfil[chave]?.concluido === true;


    return `

        <div
            class="
                assunto-card
                ${concluido ? "concluido" : ""}
            "
        >


            <div class="assunto-numero">

                ${String(index + 1).padStart(2, "0")}

            </div>


            <div class="assunto-info">

                <h3>
                    ${assunto}
                </h3>


                <span>

                    ${
                        concluido
                            ? "✓ Assunto concluído"
                            : "○ Não concluído"
                    }

                </span>

            </div>


            <div class="assunto-actions">

                ${
                    concluido

                    ?

                    `
                        <button
                            class="btn-concluido"
                            disabled
                        >
                            ✓ Concluído
                        </button>
                    `

                    :

                    `
                        <button
                            class="btn-assunto"
                            onclick="
                                concluirAssunto(
                                    '${materia.id}',
                                    ${index}
                                )
                            "
                        >
                            Marcar concluído
                        </button>
                    `

                }

            </div>


        </div>

    `;

}


/* ==========================================
   VOLTAR PARA MATÉRIAS
========================================== */

function voltarMaterias() {

    const paginaMaterias =
        document.getElementById(
            "materias"
        );


    if (!paginaMaterias) return;


    paginaMaterias.innerHTML = `

        <div class="page-title">

            <h1>
                Matérias
            </h1>

            <p>
                Conteúdo organizado conforme o edital.
            </p>

        </div>


        <div
            id="materiasContainer"
            class="cards-container"
        ></div>

    `;


    renderizarMaterias();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==========================================
   CONCLUIR ASSUNTO
========================================== */

function concluirAssunto(
    materiaId,
    assuntoIndex
) {

    const materia =
        materiasPMES.find(
            item =>
                item.id === materiaId
        );


    if (!materia) return;


    const chave =
        `${materiaId}_assunto_${assuntoIndex}`;


    if (
        dadosPerfil[chave]?.concluido
    ) {

        return;

    }


    dadosPerfil[chave] = {

        concluido: true,

        data:
            new Date().toISOString()

    };


    /*
       Ganho de XP
    */

    adicionarXP(
        50,
        false
    );


    salvarDados();


    atualizarPerfil();

    atualizarDashboard();


    abrirMateria(
        materiaId
    );

}


/* ==========================================
   ADICIONAR XP
========================================== */

function adicionarXP(
    quantidade,
    atualizar = true
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


    if (atualizar) {

        atualizarPerfil();

        atualizarDashboard();

    }

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
   PROGRESSO GERAL
========================================== */

function calcularProgressoGeral() {

    let total = 0;

    let concluidos = 0;


    materiasPMES.forEach(
        materia => {

            total +=
                materia.assuntos.length;


            materia.assuntos.forEach(
                (assunto, index) => {

                    const chave =
                        `${materia.id}_assunto_${index}`;


                    if (
                        dadosPerfil[chave]?.concluido
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


    /*
       PROGRESSO
    */

    document
        .querySelectorAll("[data-progresso]")
        .forEach(element => {

            element.textContent =
                `${progresso}%`;

        });


    document
        .querySelectorAll("[data-barra-progresso]")
        .forEach(element => {

            element.style.width =
                `${progresso}%`;

        });


    /*
       APROVEITAMENTO
    */

    document
        .querySelectorAll("[data-aproveitamento]")
        .forEach(element => {

            element.textContent =
                `${aproveitamento}%`;

        });


    /*
       XP
    */

    document
        .querySelectorAll("[data-xp]")
        .forEach(element => {

            element.textContent =
                dadosPerfil.xp;

        });


    /*
       NÍVEL
    */

    document
        .querySelectorAll("[data-nivel]")
        .forEach(element => {

            element.textContent =
                dadosPerfil.nivel;

        });


    /*
       SEQUÊNCIA
    */

    document
        .querySelectorAll("[data-sequencia]")
        .forEach(element => {

            element.textContent =
                dadosPerfil.sequencia;

        });


    /*
       BARRA DE XP
    */

    const xpAtual =
        dadosPerfil.xp;


    const xpMax =
        dadosPerfil.xpProximoNivel;


    const porcentagemXP =
        xpMax > 0
            ? Math.round(
                (xpAtual / xpMax) * 100
            )
            : 0;


    document
        .querySelectorAll("[data-barra-xp]")
        .forEach(element => {

            element.style.width =
                `${porcentagemXP}%`;

        });


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
   RESETAR PROGRESSO
========================================== */

function resetarProgresso() {

    const confirmar =
        confirm(

            "⚠️ ATENÇÃO!\n\n" +

            `Isso vai apagar todo o progresso do perfil ${activeProfile}.\n\n` +

            "XP\n" +
            "Nível\n" +
            "Questões\n" +
            "Assuntos concluídos\n" +
            "Revisões\n" +
            "Redação\n" +
            "Tempo de estudo\n\n" +

            "Deseja realmente começar do ZERO?"

        );


    if (!confirmar) return;


    dadosPerfil =
        criarDadosIniciais();


    salvarDados();


    atualizarPerfil();

    atualizarDashboard();

    renderizarMaterias();


    /*
       Se estiver dentro de uma matéria,
       volta para a lista.
    */

    const paginaMaterias =
        document.getElementById(
            "materias"
        );


    if (
        paginaMaterias &&
        paginaMaterias.classList.contains(
            "active-page"
        )
    ) {

        voltarMaterias();

    }


    alert(
        "✅ Progresso resetado!\n\n" +
        "O perfil começou do zero."
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
