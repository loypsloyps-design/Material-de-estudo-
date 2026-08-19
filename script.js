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
           Garante que dados antigos não
           quebrem o sistema caso alguma
           propriedade esteja faltando.
        */

        const dadosIniciais =
            criarDadosIniciais();


        return {

            ...dadosIniciais,

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


    /*
       Atualiza qualquer elemento que
       esteja usando data-nivel.
    */

    document
        .querySelectorAll("[data-nivel]")
        .forEach(elemento => {

            elemento.textContent =
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


    if (
        typeof materiasPMES ===
        "undefined"
    ) {

        console.error(
            "materiasPMES não foi carregado."
        );

        return;

    }


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
   CALCULAR PROGRESSO DA MATÉRIA
========================================== */

function calcularProgressoMateria(
    materia,
    dados
) {

    if (
        !materia ||
        !materia.assuntos ||
        materia.assuntos.length === 0
    ) {

        return 0;

    }


    let concluidos = 0;


    materia.assuntos.forEach(
        (assunto, index) => {

            const chave =
                `${materia.id}_assunto_${index}`;


            if (
                dados[chave] &&
                dados[chave].concluido
            ) {

                concluidos++;

            }

        }
    );


    return Math.round(

        (
            concluidos /
            materia.assuntos.length
        ) * 100

    );

}


/* ==========================================
   CONTAR ASSUNTOS CONCLUÍDOS
========================================== */

function contarAssuntosConcluidos(
    materia
) {

    if (
        !materia ||
        !materia.assuntos
    ) {

        return 0;

    }


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

    if (
        typeof materiasPMES ===
        "undefined"
    ) {

        alert(
            "Não foi possível carregar as matérias."
        );

        return;

    }


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

    carregarRedacao();

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


    atualizarDashboard();

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


    if (
        typeof materiasPMES ===
        "undefined"
    ) {

        return 0;

    }


    materiasPMES.forEach(
        materia => {

            if (
                !materia.assuntos
            ) return;


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


    /*
       Elementos que usam data-progresso
    */

    document
        .querySelectorAll(
            "[data-progresso]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `${progresso}%`;

            }
        );


    /*
       Elementos que usam data-aproveitamento
    */

    document
        .querySelectorAll(
            "[data-aproveitamento]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `${aproveitamento}%`;

            }
        );


    /*
       Elementos que usam data-xp
    */

    document
        .querySelectorAll(
            "[data-xp]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.xp;

            }
        );


    /*
       Elementos que usam data-nivel
    */

    document
        .querySelectorAll(
            "[data-nivel]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.nivel;

            }
        );


    /*
       Elementos que usam data-questoes
    */

    document
        .querySelectorAll(
            "[data-questoes]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.questoesRespondidas;

            }
        );


    /*
       Elementos que usam data-acertos
    */

    document
        .querySelectorAll(
            "[data-acertos]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.questoesAcertadas;

            }
        );


    /*
       Elementos que usam data-tempo
    */

    document
        .querySelectorAll(
            "[data-tempo]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.tempoEstudo;

            }
        );


    /*
       Elementos que usam data-sequencia
    */

    document
        .querySelectorAll(
            "[data-sequencia]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    dadosPerfil.sequencia;

            }
        );


    /*
       Atualiza barras de progresso
    */

    document
        .querySelectorAll(
            "[data-barra-progresso]"
        )
        .forEach(
            elemento => {

                elemento.style.width =
                    `${progresso}%`;

            }
        );


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

function carregarRedacao() {

    const redacao =
        document.querySelector(
            ".redacao-area"
        );


    if (!redacao) return;


    const textoSalvo =
        carregarProgresso(
            "redacao"
        );


    redacao.value =
        textoSalvo || "";

}


const redacao =
    document.querySelector(
        ".redacao-area"
    );


if (redacao) {

    carregarRedacao();


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
   RESETAR PROGRESSO DO PERFIL
========================================== */

function resetarProgresso() {

    const confirmar =
        confirm(

            "⚠️ ATENÇÃO!\n\n" +

            "Isso vai apagar TODO o progresso " +

            `do perfil ${activeProfile}.\n\n` +

            "• XP\n" +

            "• Nível\n" +

            "• Questões\n" +

            "• Assuntos concluídos\n" +

            "• Revisões\n" +

            "• Redação\n" +

            "• Tempo de estudo\n" +

            "• Sequência\n\n" +

            "Deseja realmente começar do ZERO?"

        );


    if (!confirmar) return;


    /*
       Cria um perfil completamente novo.
    */

    dadosPerfil =
        criarDadosIniciais();


    /*
       Salva o perfil zerado.
    */

    salvarDados();


    /*
       Atualiza todas as partes
       do sistema.
    */

    atualizarPerfil();

    atualizarDashboard();

    renderizarMaterias();

    carregarRedacao();


    /*
       Garante que qualquer campo
       de redação seja limpo.
    */

    const campoRedacao =
        document.querySelector(
            ".redacao-area"
        );


    if (campoRedacao) {

        campoRedacao.value = "";

    }


    alert(

        "✅ PROGRESSO RESETADO!\n\n" +

        `O perfil ${activeProfile} ` +

        "começou novamente do ZERO."

    );

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

atualizarPerfil();

atualizarDashboard();

renderizarMaterias();

carregarRedacao();


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
