// Função para habilitar a edição de uma linha diretamente na tabela
function editarAlunoInline(alunoId) {
    const row = document.querySelector(`#aluno-${alunoId}`);
    
    // Pega os dados atuais da linha
    const nomeCell = row.querySelector('.nome');
    const dataNascimentoCell = row.querySelector('.dataNascimento');
    const modalidadeCell = row.querySelector('.modalidade');
    const faixaCell = row.querySelector('.faixa');
    const horarioCell = row.querySelector('.horario');
    const tipoCell = row.querySelector('.tipo');
    const generoCell = row.querySelector('.genero');

    // Torna os campos editáveis
    nomeCell.innerHTML = `<input type="text" value="${nomeCell.textContent}">`;
    dataNascimentoCell.innerHTML = `<input type="date" value="${dataNascimentoCell.dataset.value}">`;
    modalidadeCell.innerHTML = `
        <select>
            <option value="Karaté" ${modalidadeCell.textContent === 'Karaté' ? 'selected' : ''}>Karaté</option>
            <option value="Hidroginástica" ${modalidadeCell.textContent === 'Hidroginástica' ? 'selected' : ''}>Hidroginástica</option>
            <option value="Natação" ${modalidadeCell.textContent === 'Natação' ? 'selected' : ''}>Natação</option>
        </select>`;
    faixaCell.innerHTML = `<input type="text" value="${faixaCell.textContent}">`;
    horarioCell.innerHTML = `<input type="time" value="${horarioCell.textContent.replace('h', '')}">`;
    tipoCell.innerHTML = `
        <select>
            <option value="Particular" ${tipoCell.textContent === 'Particular' ? 'selected' : ''}>Particular</option>
            <option value="Projeto" ${tipoCell.textContent === 'Projeto' ? 'selected' : ''}>Projeto</option>
        </select>`;
    generoCell.innerHTML = `
        <select>
            <option value="Masculino" ${generoCell.textContent === 'Masculino' ? 'selected' : ''}>Masculino</option>
            <option value="Feminino" ${generoCell.textContent === 'Feminino' ? 'selected' : ''}>Feminino</option>
            <option value="Outro" ${generoCell.textContent === 'Outro' ? 'selected' : ''}>Outro</option>
        </select>`;

    // Troca o botão "Editar" para "Salvar"
    const editarBtn = row.querySelector('.editar');
    editarBtn.textContent = 'Salvar';
    editarBtn.onclick = function () {
        salvarEdicaoInline(alunoId, row);
    };
}

function salvarEdicaoInline(alunoId, row) {
    // Coleta os valores dos campos editáveis
    const nome = row.querySelector('.nome input').value.toUpperCase();
    const dataNascimento = row.querySelector('.dataNascimento input').value;
    const modalidade = row.querySelector('.modalidade select').value;
    const faixa = row.querySelector('.faixa input').value;
    const horario = row.querySelector('.horario input').value;
    const tipo = row.querySelector('.tipo select').value;
    const genero = row.querySelector('.genero select').value;

    // Monta o objeto de aluno atualizado
    const alunoAtualizado = {
        nome,
        dataNascimento,
        idade: calcularIdade(dataNascimento), // Calcula a idade
        modalidade,
        faixa: modalidade === 'Karaté' ? faixa : '', // Se não for Karaté, não precisa de faixa
        horario,
        tipo,
        genero
    };

    // Envia os dados para o backend
    fetch(`http://localhost:3000/alunos/${alunoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(alunoAtualizado),
    })
    .then(response => {
        if (response.ok) {
            alert('Aluno atualizado com sucesso!');
            exibirAlunos();  // Atualiza a lista de alunos
        } else {
            alert('Erro ao atualizar aluno.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar aluno:', error);
    });
}
