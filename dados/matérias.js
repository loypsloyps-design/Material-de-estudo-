/* ==========================================
   NSS-PMES
   ESTRUTURA DE MATÉRIAS
========================================== */

const materiasPMES = [

    {
        id: "portugues",
        nome: "Língua Portuguesa",
        icone: "📖",
        cor: "purple",
        progresso: 0,

        assuntos: [
            "Interpretação de textos",
            "Compreensão textual",
            "Ortografia",
            "Acentuação gráfica",
            "Classes de palavras",
            "Pronomes",
            "Verbos",
            "Concordância verbal",
            "Concordância nominal",
            "Regência verbal",
            "Regência nominal",
            "Crase",
            "Pontuação",
            "Sintaxe",
            "Semântica"
        ]
    },

    {
        id: "raciocinio-logico",
        nome: "Raciocínio Lógico",
        icone: "🧠",
        cor: "blue",
        progresso: 0,

        assuntos: [
            "Proposições",
            "Conectivos lógicos",
            "Tabela-verdade",
            "Negação",
            "Equivalências lógicas",
            "Implicação lógica",
            "Argumentação lógica",
            "Conjuntos",
            "Problemas lógicos",
            "Sequências"
        ]
    },

    {
        id: "matematica",
        nome: "Matemática",
        icone: "🔢",
        cor: "purple",
        progresso: 0,

        assuntos: [
            "Operações fundamentais",
            "Frações",
            "Números inteiros",
            "Números naturais",
            "Números racionais",
            "Razão e proporção",
            "Regra de três",
            "Porcentagem",
            "Equações",
            "Sistemas de equações",
            "Geometria",
            "Área e perímetro",
            "Média aritmética"
        ]
    },

    {
        id: "geografia",
        nome: "Geografia",
        icone: "🌎",
        cor: "green",
        progresso: 0,

        assuntos: [
            "Localização geográfica",
            "Coordenadas geográficas",
            "Movimentos da Terra",
            "Fusos horários",
            "Relevo",
            "Clima",
            "Vegetação",
            "Hidrografia",
            "População",
            "Urbanização",
            "Industrialização",
            "Economia brasileira",
            "Geografia do Espírito Santo"
        ]
    },

    {
        id: "historia",
        nome: "História",
        icone: "🏛️",
        cor: "yellow",
        progresso: 0,

        assuntos: [
            "Brasil Colonial",
            "Independência do Brasil",
            "Primeiro Reinado",
            "Período Regencial",
            "Segundo Reinado",
            "República Velha",
            "Era Vargas",
            "República Populista",
            "Ditadura Militar",
            "Nova República",
            "História do Espírito Santo"
        ]
    }

];


/* ==========================================
   FUNÇÃO PARA CALCULAR PROGRESSO
========================================== */

function calcularProgressoMateria(materia, progresso) {

    if (!materia.assuntos || materia.assuntos.length === 0) {
        return 0;
    }

    let concluidos = 0;

    materia.assuntos.forEach((assunto, index) => {

        const chave =
            `${materia.id}_assunto_${index}`;

        if (progresso[chave]?.concluido === true) {
            concluidos++;
        }

    });

    return Math.round(
        (concluidos / materia.assuntos.length) * 100
    );
}
