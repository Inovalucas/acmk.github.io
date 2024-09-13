// Função para exibir ou esconder a coluna "Faixa" com base na modalidade selecionada
function atualizarVisibilidadeColunaFaixa() {
    const modalidade = document.getElementById('filtroModalidade').value;
    const faixaHeader = document.getElementById('faixaHeader');
    const faixaCells = document.querySelectorAll('.faixaCell');

    if (modalidade === 'Karaté' || modalidade === '') {
        // Mostra a coluna Faixa se a modalidade for "Karaté" ou "Todas as Modalidades"
        faixaHeader.style.display = '';
        faixaCells.forEach(cell => cell.style.display = '');
    } else {
        // Esconde a coluna Faixa para "Hidroginástica" ou "Natação"
        faixaHeader.style.display = 'none';
        faixaCells.forEach(cell => cell.style.display = 'none');
    }
}

// Função para exibir os alunos com base nos filtros selecionados
function exibirAlunos() {
    const filtroModalidade = document.getElementById('filtroModalidade').value;
    const filtroTipo = document.getElementById('filtroTipo').value;
    const filtroHorario = document.getElementById('filtroHorario').value;

    // Atualiza a visibilidade da coluna Faixa com base na modalidade
    atualizarVisibilidadeColunaFaixa();

    // Faz uma requisição GET para buscar todos os alunos do backend
    fetch(`http://localhost:4000/alunos?modalidade=${filtroModalidade}&tipo=${filtroTipo}&horario=${filtroHorario}`)
        .then(response => response.json())
        .then(alunos => {
            const listaAlunosTbody = document.getElementById('listaAlunos');
            listaAlunosTbody.innerHTML = '';  // Limpa a tabela antes de renderizar novamente

            // Se não houver alunos, exibe uma mensagem
            if (alunos.length === 0) {
                listaAlunosTbody.innerHTML = '<tr><td colspan="8">Nenhum aluno encontrado com os filtros selecionados.</td></tr>';
                return;
            }

            // Exibe os alunos filtrados na tabela
            alunos.forEach(aluno => {
                const alunoRow = document.createElement('tr');
                alunoRow.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.modalidade}</td>
                    <td class="faixaCell">${aluno.modalidade === 'Karaté' ? aluno.faixa : '-'}</td>
                    <td>${formatarHorario(aluno.horario)}</td>
                    <td>${formatarData(aluno.data_nascimento)}</td>
                    <td>${aluno.tipo}</td>
                    <td>${aluno.genero}</td>
                    
                <td><a href="editar.html?id=${aluno.id}" class="btn-editar">Editar</a></td>
                    
                `;
                listaAlunosTbody.appendChild(alunoRow);
            });

            // Atualiza a visibilidade da coluna Faixa após os alunos serem carregados
            atualizarVisibilidadeColunaFaixa();
        })
        .catch(error => {
            console.error('Erro ao buscar alunos:', error);
        });
}

// Captura o evento de submissão do formulário de filtros e exibe os alunos
document.getElementById('filtroAlunos').addEventListener('submit', function (e) {
    e.preventDefault();
    exibirAlunos();  // Exibe os alunos apenas após o clique no botão "Filtrar"
});

// Função para ocultar/exibir a coluna "Faixa" ao mudar a modalidade no filtro
document.getElementById('filtroModalidade').addEventListener('change', atualizarVisibilidadeColunaFaixa);
