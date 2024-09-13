// Função para formatar o horário de forma ajustada
function formatarHorario(horario) {
    if (!horario) return ''; // Se o horário for inválido ou nulo, retorna uma string vazia

    const [horas, minutos] = horario.split(':'); // Divide o horário entre horas e minutos

    if (minutos === '00') {
        return `${horas}h`; // Se os minutos forem "00", retorna apenas as horas seguidas de "h"
    } else {
        return `${horas}h${minutos}`; // Caso contrário, retorna as horas seguidas dos minutos
    }
}

// Função para formatar a data no formato dd/mm/yyyy
function formatarData(dataISO) {
    if (!dataISO) return ''; // Se a data for inválida ou nula, retorna uma string vazia

    const data = new Date(dataISO);  // Converte a string ISO em um objeto Date
    const dia = String(data.getUTCDate()).padStart(2, '0');  // Obtém o dia e adiciona zero à esquerda se necessário
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');  // Meses começam em 0, então adiciona 1
    const ano = data.getUTCFullYear();  // Obtém o ano

    return `${dia}/${mes}/${ano}`;  // Retorna a data no formato dd/mm/yyyy
}

// Função para carregar e exportar os alunos para o Excel
function exportarParaExcel() {
    fetch('http://170.150.222.59:4000/alunos')  // Faz uma requisição para buscar todos os alunos
    .then(response => response.json())  // Converte a resposta em JSON
    .then(alunos => {
        const wb = XLSX.utils.book_new(); // Cria um novo workbook (arquivo Excel)

        // Função para adicionar uma aba no Excel com dados filtrados
        function adicionarAba(nomeAba, dados) {
            // Formata os dados dos alunos
            const dadosFormatados = dados.map(aluno => {
                // Retorna os campos obrigatórios para todos os alunos
                const alunoFormatado = {
                    nome: aluno.nome,
                    idade: aluno.idade,
                    genero: aluno.genero,
                    tipo: aluno.tipo,
                    dataNascimento: formatarData(aluno.data_nascimento),
                    horario: formatarHorario(aluno.horario)
                };

                // Se a modalidade for Karaté, adiciona o campo "faixa"
                if (aluno.modalidade === 'Karaté') {
                    alunoFormatado.faixa = aluno.faixa;
                }

                return alunoFormatado;
            });

            const ws = XLSX.utils.json_to_sheet(dadosFormatados); // Converte os dados JSON para um formato de planilha
            XLSX.utils.book_append_sheet(wb, ws, nomeAba); // Adiciona a aba no workbook
        }

        // Modalidades para organizar as abas
        const modalidades = ['Karaté', 'Hidroginástica', 'Natação'];

        // Agrupar horários de acordo com os que estão no banco de dados
        const horariosAgrupados = {}; // Objeto para armazenar os horários filtrados

        // Filtrar os alunos por modalidade e horário
        modalidades.forEach(modalidade => {
            alunos.forEach(aluno => {
                if (aluno.modalidade === modalidade) {
                    const horarioFormatado = formatarHorario(aluno.horario);

                    // Verifica se o horário já existe no objeto, se não, cria
                    if (!horariosAgrupados[`${modalidade} ${horarioFormatado}`]) {
                        horariosAgrupados[`${modalidade} ${horarioFormatado}`] = [];
                    }

                    // Adiciona o aluno no grupo de horários
                    horariosAgrupados[`${modalidade} ${horarioFormatado}`].push(aluno);
                }
            });
        });

        // Adiciona uma aba no Excel para cada combinação de modalidade e horário
        for (const [nomeAba, alunosFiltrados] of Object.entries(horariosAgrupados)) {
            if (alunosFiltrados.length > 0) {
                adicionarAba(nomeAba, alunosFiltrados); // Cria a aba com os dados filtrados
            }
        }

        // Por fim, faz o download do arquivo Excel com as abas criadas
        XLSX.writeFile(wb, 'alunos_cadastrados_por_horario.xlsx');
    })
    .catch(error => {
        console.error('Erro ao buscar alunos:', error); // Exibe erro caso haja problema com a requisição
    });
}

// Evento para o botão de exportação
document.getElementById('exportarExcel').addEventListener('click', exportarParaExcel);
