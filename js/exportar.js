// Função para exportar a tabela de alunos para um arquivo Excel com múltiplas planilhas
function exportarParaExcel() {
    const wb = XLSX.utils.book_new(); // Cria um novo workbook

    // Função para adicionar uma aba ao workbook
    function adicionarAba(nomeAba, dados) {
        // Cria uma planilha a partir dos dados JSON
        const ws = XLSX.utils.json_to_sheet(dados, {
            header: ['nome', 'idade', 'modalidade', 'faixa', 'horario', 'data_nascimento', 'tipo', 'genero'],
            skipHeader: false
        });
        // Adiciona a planilha ao workbook com o nome fornecido
        XLSX.utils.book_append_sheet(wb, ws, nomeAba);
    }

    // Função para carregar os horários do backend
    function carregarHorarios() {
        return fetch('http://localhost:3000/horarios')
            .then(response => response.json())
            .then(horarios => {
                // Retorna um array de horários
                return horarios.map(horario => horario.horario);
            })
            .catch(error => {
                console.error('Erro ao carregar horários:', error);
                return [];
            });
    }

    // Função para obter e exportar dados para cada combinação de modalidade e horário
    function obterEExportarDados(horarios) {
        const modalidades = ['Karaté', 'Hidroginástica', 'Natação'];
        const fetchPromises = [];

        modalidades.forEach(modalidade => {
            horarios.forEach(horario => {
                // Cria uma promessa para buscar os dados e adicionar a aba ao workbook
                fetchPromises.push(
                    fetch(`http://localhost:3000/alunos?modalidade=${modalidade}&horario=${horario}`)
                        .then(response => response.json())
                        .then(alunos => {
                            const nomeAba = `${modalidade} ${horario}`;
                            adicionarAba(nomeAba, alunos);
                        })
                        .catch(error => {
                            console.error(`Erro ao buscar alunos para ${modalidade} ${horario}:`, error);
                        })
                );
            });
        });

        // Após todas as requisições serem resolvidas, salva o arquivo
        Promise.all(fetchPromises).then(() => {
            XLSX.writeFile(wb, 'alunos_cadastrados.xlsx');
        });
    }

    // Inicia o processo de exportação
    carregarHorarios().then(horarios => {
        obterEExportarDados(horarios);
    });
}

// Evento para o botão de exportação
document.getElementById('exportarExcel').addEventListener('click', exportarParaExcel);
