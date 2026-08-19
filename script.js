/* ==========================================
   NSS-PMES
   SISTEMA PRINCIPAL
========================================== */


/* ==========================================
   PERFIS
========================================== */

const profiles = {

    Felipe: {

        name: "Felipe",

        avatar: "👤"

    },


    Primo: {

        name: "Primo",

        avatar: "👤"

    }

};


/* ==========================================
   PERFIL ATIVO
========================================== */

let activeProfile =
    localStorage.getItem(
        "nss_pmes_profile"
    ) || "Felipe";


/* ==========================================
   DADOS INICIAIS
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

        redacao: "",

        historicoEstudo: {}

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

            JSON.stringify(
                novosDados
            )

        );


        return novosDados;

    }


    try {

        const dados =
            JSON.parse(
                dadosSalvos
            );


        /* Garante compatibilidade */

        return {

            ...criarDadosIniciais(),

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

            JSON.stringify(
                novosDados
            )

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
   SALVAR
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
   ELEMENTOS
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


menuItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const pageId =
                    item.dataset.page;


                abrirPagina(
                    pageId
                );

            }
        );

    }
);


/* ==========================================
   ABRIR PÁGINA
========================================== */

function abrirPagina(
    pageId
) {

    menuItems.forEach(
        item => {

            item.classList.remove(
                "active"
            );


            if (
                item.dataset.page ===
                pageId
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );


    pages.forEach(
        page => {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const pagina =
        document.getElementById(
            pageId
        );


    if (pagina) {

        pagina.classList.add(
            "active-page"
        );

    }


    if (
        pageId === "materias"
    ) {

        renderizarMaterias();

    }


    if (
        pageId === "desempenho"
    ) {

        renderizarDesempenho();

    }


    if (
        pageId === "ranking"
    ) {

        renderizarRanking();

    }


    if (
        pageId === "revisoes"
    ) {

        renderizarRevisoes();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==========================================
   ABRIR AULA
========================================== */

function abrirAula() {

    abrirPagina(
        "aula"
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


    const topLevel =
        document.getElementById(
            "topLevel"
        );


    const welcome =
        document.getElementById(
            "welcome"
        );


    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );


    const topAvatar =
        document.getElementById(
            "topAvatar"
        );


    const configPerfil =
        document.getElementById(
            "configPerfil"
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


    if (topLevel) {

        topLevel.textContent =
            `Nível ${dadosPerfil.nivel}`;

    }


    if (welcome) {

        welcome.textContent =
            `Fala aí, ${profile.name}! 👋`;

    }


    if (sidebarAvatar) {

        sidebarAvatar.textContent =
            profile.avatar;

    }


    if (topAvatar) {

        topAvatar.textContent =
            profile.avatar;

    }


    if (configPerfil) {

        configPerfil.textContent =
            profile.name;

    }

}


/* ==========================================
   PROGRESSO GERAL
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


    if (
        total === 0
    ) {

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
        dadosPerfil.questoesRespondidas <=
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
   FORMATAR TEMPO
========================================== */

function formatarTempo(
    minutos
) {

    minutos =
        Number(minutos) || 0;


    const horas =
        Math.floor(
            minutos / 60
        );


    const mins =
        minutos % 60;


    if (
        horas === 0
    ) {

        return `${mins}m`;

    }


    if (
        mins === 0
    ) {

        return `${horas}h`;

    }


    return `${horas}h ${mins}m`;

}


/* ==========================================
   ATUALIZAR DASHBOARD
========================================== */

function atualizarDashboard() {

    const progresso =
        calcularProgressoGeral();


    const aproveitamento =
        calcularAproveitamento();


    const statSequencia =
        document.getElementById(
            "statSequencia"
        );


    const statTempo =
        document.getElementById(
            "statTempo"
        );


    const statAproveitamento =
        document.getElementById(
            "statAproveitamento"
        );


    const statProgresso =
        document.getElementById(
            "statProgresso"
        );


    const statXP =
        document.getElementById(
            "statXP"
        );


    const statNivel =
        document.getElementById(
            "statNivel"
        );


    const progressEdital =
        document.getElementById(
            "progressEdital"
        );


    const progressXP =
        document.getElementById(
            "progressXP"
        );


    if (statSequencia) {

        statSequencia.innerHTML =
            `${dadosPerfil.sequencia}
             <small>dias</small>`;

    }


    if (statTempo) {

        statTempo.textContent =
            formatarTempo(
                dadosPerfil.tempoEstudo
            );

    }


    if (statAproveitamento) {

        statAproveitamento.textContent =
            `${aproveitamento}%`;

    }


    if (statProgresso) {

        statProgresso.textContent =
            `${progresso}%`;

    }


    if (statXP) {

        statXP.textContent =
            dadosPerfil.xp;

    }


    if (statNivel) {

        statNivel.textContent =
            `Nível ${dadosPerfil.nivel}`;

    }


    if (progressEdital) {

        progressEdital.style.width =
            `${progresso}%`;

    }


    const percentualXP =

        Math.min(

            100,

            Math.round(

                (
                    dadosPerfil.xp /
                    dadosPerfil.xpProximoNivel
                ) * 100

            )

        );


    if (progressXP) {

        progressXP.style.width =
            `${percentualXP}%`;

    }


    atualizarSequencia();


    renderizarDashboardMaterias();


    renderizarRevisoesDashboard();

}


/* ==========================================
   SEQUÊNCIA
========================================== */

function atualizarSequencia() {

    const sequencia =
        dadosPerfil.sequencia || 0;


    const statTexto =
        document.getElementById(
            "statSequenciaTexto"
        );


    const circle =
        document.getElementById(
            "streakCircle"
        );


    const title =
        document.getElementById(
            "streakTitle"
        );


    const text =
        document.getElementById(
            "streakText"
        );


    const tempo =
        document.getElementById(
            "streakTempo"
        );


    const progress =
        document.getElementById(
            "progressEstudo"
        );


    if (circle) {

        circle.textContent =
            sequencia;

    }


    if (tempo) {

        tempo.textContent =
            formatarTempo(
                dadosPerfil.tempoEstudo
            );

    }


    if (statTexto) {

        if (
            sequencia >= 7
        ) {

            statTexto.textContent =
                "🔥 Excelente!";

            statTexto.className =
                "orange";

        } else if (
            sequencia > 0
        ) {

            statTexto.textContent =
                "Continue firme!";

        } else {

            statTexto.textContent =
                "Comece hoje!";

        }

    }


    if (title) {

        if (
            sequencia >= 7
        ) {

            title.textContent =
                "Parabéns! 🔥";

        } else if (
            sequencia > 0
        ) {

            title.textContent =
                "Boa sequência!";

        } else {

            title.textContent =
                "Bora começar! 🚔";

        }

    }


    if (text) {

        if (
            sequencia > 0
        ) {

            text.textContent =
                "Mantenha a disciplina!";

        } else {

            text.textContent =
                "Estude hoje para iniciar sua sequência.";

        }

    }


    if (progress) {

        const hoje =
            dadosPerfil.tempoEstudo || 0;


        const percentual =
            Math.min(

                100,

                Math.round(
                    (hoje / 90) * 100
                )

            );


        progress.style.width =
            `${percentual}%`;

    }

}


/* ==========================================
   REGISTRAR ESTUDO
========================================== */

function registrarEstudo(
    minutos
) {

    minutos =
        Number(minutos) || 0;


    if (
        minutos <= 0
    ) return;


    dadosPerfil.tempoEstudo +=
        minutos;


    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];


    dadosPerfil.historicoEstudo[hoje] =
        true;


    atualizarSequenciaAutomaticamente();


    salvarDados();


    atualizarPerfil();

    atualizarDashboard();


    mostrarToast(

        "Estudo registrado!",

        `+${minutos} minutos de estudo.`

    );

}


/* ==========================================
   SEQUÊNCIA AUTOMÁTICA
========================================== */

function atualizarSequenciaAutomaticamente() {

    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];


    if (
        dadosPerfil.ultimaDataEstudo ===
        hoje
    ) {

        return;

    }


    const ontemDate =
        new Date();


    ontemDate.setDate(
        ontemDate.getDate() - 1
    );


    const ontem =
        ontemDate
            .toISOString()
            .split("T")[0];


    if (
        dadosPerfil.ultimaDataEstudo ===
        ontem
    ) {

        dadosPerfil.sequencia++;

    } else {

        dadosPerfil.sequencia = 1;

    }


    dadosPerfil.ultimaDataEstudo =
        hoje;

}


/* ==========================================
   ADICIONAR XP
========================================== */

function adicionarXP(
    quantidade
) {

    quantidade =
        Number(quantidade) || 0;


    if (
        quantidade <= 0
    ) return;


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
   CONCLUIR ASSUNTO
========================================== */

function concluirAssunto(
    materiaId,
    assuntoIndex
) {

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


    dadosPerfil.assuntosConcluidos[
        chave
    ] = true;


    adicionarXP(50);


    salvarDados();


    atualizarDashboard();


    renderizarMaterias();


    mostrarToast(

        "Assunto concluído!",

        "+50 XP adicionados ao seu perfil."

    );

}


/* ==========================================
   REGISTRAR QUESTÃO
========================================== */

function registrarQuestao(
    questaoId,
    acertou
) {

    dadosPerfil.questoesRespondidas++;


    if (
        acertou
    ) {

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


    mostrarToast(

        acertou
            ? "Questão correta! 🎯"
            : "Questão errada! 📚",

        acertou
            ? "+10 XP"
            : "+3 XP e revisão criada."

    );

}


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
   CONTAR ASSUNTOS
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


    const assuntos =
        materia.assuntos
            .map(
                (assunto, index) => {

                    const chave =
                        `${materia.id}_assunto_${index}`;


                    const concluido =
                        dadosPerfil[chave]?.concluido;


                    return `

                        <div class="next-item">

                            <strong class="number blue">
                                ${index + 1}
                            </strong>

                            <div>

                                <b>
                                    ${assunto}
                                </b>

                                <small>
                                    ${
                                        concluido
                                            ? "✅ Concluído"
                                            : "📚 Pendente"
                                    }
                                </small>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal show";


    modal.innerHTML = `

        <div class="profile-modal">

            <button
                class="close-modal"
                onclick="this.closest('.modal').remove()"
            >
                ×
            </button>

            <div class="profile-modal-header">

                <div class="profile-modal-icon">
                    ${materia.icone}
                </div>

                <div>

                    <h2>
                        ${materia.nome}
                    </h2>

                    <p>
                        ${materia.assuntos.length} assuntos
                    </p>

                </div>

            </div>


            <div class="next-list">

                ${assuntos}

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* ==========================================
   DASHBOARD — MATÉRIAS
========================================== */

function renderizarDashboardMaterias() {

    const container =
        document.getElementById(
            "dashboardMaterias"
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
                            Progresso:
                            <b>
                                ${progresso}%
                            </b>
                        </p>

                        <p>
                            Assuntos:
                            <b>
                                ${materia.assuntos.length}
                            </b>
                        </p>

                    </div>

                </div>


                <button
                    onclick="
                        abrirPagina('materias');
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
   DESEMPENHO
========================================== */

function renderizarDesempenho() {

    const container =
        document.getElementById(
            "desempenhoContainer"
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
                            Conteúdo:
                            <b>${progresso}%</b>
                        </p>

                        <p>
                            Questões:
                            <b>${dadosPerfil.questoesRespondidas}</b>
                        </p>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   REVISÕES
========================================== */

function renderizarRevisoes() {

    const container =
        document.getElementById(
            "revisoesContainer"
        );


    if (!container) return;


    if (
        dadosPerfil.revisoes.length === 0
    ) {

        container.innerHTML = `

            <span>
                🔄
            </span>

            <h2>
                Nenhuma revisão pendente
            </h2>

            <p>
                Quando você errar questões,
                elas aparecerão aqui.
            </p>

        `;


        return;

    }


    container.className =
        "review-list";


    container.innerHTML = "";


    dadosPerfil.revisoes.forEach(
        revisao => {

            const div =
                document.createElement(
                    "div"
                );


            div.innerHTML = `

                <b>
                    📚 Questão para revisar
                </b>

                <small>
                    ID: ${revisao.questaoId}
                </small>

                <label>
                    Revisar
                </label>

            `;


            container.appendChild(
                div
            );

        }
    );

}


/* ==========================================
   REVISÕES — DASHBOARD
========================================== */

function renderizarRevisoesDashboard() {

    const container =
        document.getElementById(
            "dashboardRevisoes"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        dadosPerfil.revisoes.length === 0
    ) {

        container.innerHTML = `

            <div>

                <b>
                    🎯 Tudo em dia!
                </b>

                <small>
                    Nenhuma revisão pendente.
                </small>

                <label>
                    Continue estudando
                </label>

            </div>

        `;


        return;

    }


    dadosPerfil.revisoes
        .slice(-3)
        .forEach(
            revisao => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.innerHTML = `

                    <b>
                        📚 Revisar questão
                    </b>

                    <small>
                        Questão ${revisao.questaoId}
                    </small>

                    <label>
                        Revisar
                    </label>

                `;


                container.appendChild(
                    div
                );

            }
        );

}


/* ==========================================
   RANKING
========================================== */

function obterDadosPerfil(
    nome
) {

    const salvo =
        localStorage.getItem(
            `nss_${nome}`
        );


    if (!salvo) {

        return criarDadosIniciais();

    }


    try {

        return {

            ...criarDadosIniciais(),

            ...JSON.parse(
                salvo
            )

        };

    } catch {

        return criarDadosIniciais();

    }

}


/* ==========================================
   RENDERIZAR RANKING
========================================== */

function renderizarRanking() {

    const container =
        document.getElementById(
            "rankingContainer"
        );


    if (!container) return;


    const ranking = [

        {

            nome: "Felipe",

            dados:
                obterDadosPerfil(
                    "Felipe"
                )

        },

        {

            nome: "Primo",

            dados:
                obterDadosPerfil(
                    "Primo"
                )

        }

    ];


    ranking.sort(
        (a, b) =>
            b.dados.xp -
            a.dados.xp
    );


    container.innerHTML = "";


    ranking.forEach(
        (perfil, index) => {

            const medalhas = [

                "🥇",

                "🥈"

            ];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "ranking-card";


            card.innerHTML = `

                <div class="ranking-position">

                    ${
                        medalhas[index]
                            || `${index + 1}º`
                    }

                </div>


                <div class="ranking-avatar">

                    👤

                </div>


                <div class="ranking-info">

                    <strong>
                        ${perfil.nome}
                    </strong>

                    <span>
                        Nível ${perfil.dados.nivel}
                        •
                        ${perfil.dados.sequencia} dias
                    </span>

                </div>


                <div class="ranking-xp">

                    ${perfil.dados.xp} XP

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================================
   MODAL DE PERFIL
========================================== */

function abrirModalPerfil() {

    atualizarDadosDosPerfis();


    const modal =
        document.getElementById(
            "profileModal"
        );


    if (!modal) return;


    modal.classList.add(
        "show"
    );

}


function fecharModal() {

    const modal =
        document.getElementById(
            "profileModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );

}


/* ==========================================
   DADOS DOS PERFIS NO MODAL
========================================== */

function atualizarDadosDosPerfis() {

    const perfis = [

        "Felipe",

        "Primo"

    ];


    perfis.forEach(
        nome => {

            const dados =
                obterDadosPerfil(
                    nome
                );


            const elemento =
                document.getElementById(
                    `profileXP${nome}`
                );


            if (!elemento) return;


            elemento.textContent =
                `${dados.xp} XP • Nível ${dados.nivel}`;

        }
    );

}


/* ==========================================
   TROCAR PERFIL
========================================== */

function trocarPerfil(
    nome
) {

    if (
        !profiles[nome]
    ) return;


    if (
        nome === activeProfile
    ) {

        fecharModal();


        mostrarToast(

            "Perfil já selecionado",

            `Você já está usando ${nome}.`

        );


        return;

    }


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

    renderizarRanking();

    atualizarDadosDosPerfis();


    fecharModal();


    mostrarToast(

        "Perfil carregado! ✓",

        `Bem-vindo de volta, ${nome}!`

    );

}


/* ==========================================
   TOAST
========================================== */

function mostrarToast(
    titulo,
    mensagem
) {

    const toast =
        document.getElementById(
            "profileToast"
        );


    const toastTitle =
        document.getElementById(
            "toastTitle"
        );


    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    if (!toast) return;


    if (toastTitle) {

        toastTitle.textContent =
            titulo;

    }


    if (toastMessage) {

        toastMessage.textContent =
            mensagem;

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.profileToastTimer
    );


    window.profileToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* ==========================================
   FECHAR MODAL CLICANDO FORA
========================================== */

if (
    profileModal
) {

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
   BOTÕES DE PERFIL
========================================== */

if (
    switchProfile
) {

    switchProfile.addEventListener(

        "click",

        abrirModalPerfil

    );

}


if (
    profileSelector
) {

    profileSelector.addEventListener(

        "click",

        abrirModalPerfil

    );

}


if (
    topProfile
) {

    topProfile.addEventListener(

        "click",

        abrirModalPerfil

    );

}


/* ==========================================
   REDAÇÃO
========================================== */

const redacao =
    document.getElementById(
        "redacaoArea"
    );


if (redacao) {

    const texto =
        dadosPerfil.redacao || "";


    redacao.value =
        texto;


    redacao.addEventListener(
        "input",
        () => {

            dadosPerfil.redacao =
                redacao.value;


            salvarDados();

        }
    );

}


/* ==========================================
   RESETAR PERFIL
========================================== */

function resetarPerfil() {

    const confirmar =
        confirm(

            `⚠️ ATENÇÃO!\n\n` +

            `Você está prestes a apagar TODO o progresso do perfil ${activeProfile}.\n\n` +

            `Isso inclui:\n` +

            `• XP\n` +

            `• Nível\n` +

            `• Questões\n` +

            `• Assuntos concluídos\n` +

            `• Revisões\n` +

            `• Redação\n` +

            `• Tempo de estudo\n` +

            `• Sequência\n\n` +

            `Essa ação não poderá ser desfeita.\n\n` +

            `Deseja realmente continuar?`

        );


    if (
        !confirmar
    ) return;


    dadosPerfil =
        criarDadosIniciais();


    salvarDados();


    atualizarPerfil();

    atualizarDashboard();

    renderizarMaterias();

    renderizarDesempenho();

    renderizarRanking();

    atualizarDadosDosPerfis();


    mostrarToast(

        "Progresso resetado! ✓",

        `O perfil ${activeProfile} voltou ao nível 1.`

    );

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

atualizarPerfil();

atualizarDashboard();

renderizarMaterias();

renderizarDesempenho();

renderizarRanking();

renderizarRevisoesDashboard();


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
