// Função para carregar os dados do aluno no formulário de edição
function carregarDadosAluno() {
    const alunoId = new URLSearchParams(window.location.search).get('id'); // Obtém o ID do aluno da URL

    // Busca os dados do aluno com base no ID
    fetch(`http://localhost:3000/alunos/${alunoId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do aluno.');
        }
        return response.json();
    })
    .then(aluno => {
        // Preenche o formulário com os dados do aluno
        document.getElementById('editNome').value = aluno.nome;
        document.getElementById('editDataNascimento').value = aluno.data_nascimento.split('T')[0]; // Formato de data
        document.getElementById('editModalidade').value = aluno.modalidade;
        document.getElementById('editGenero').value = aluno.genero;
        document.getElementById('editHorario').value = aluno.horario;
        document.getElementById('editTipo').value = aluno.tipo;

        if (aluno.modalidade === 'Karaté') {
            document.getElementById('editFaixaField').style.display = 'block';
            document.getElementById('editFaixa').value = aluno.faixa;
        } else {
            document.getElementById('editFaixaField').style.display = 'none';
        }

        // Adiciona o evento de submissão do formulário para salvar as alterações
        document.getElementById('formEdicao').onsubmit = function(e) {
            e.preventDefault();
            salvarAlteracoes(alunoId);
        };
    })
    .catch(error => {
        console.error('Erro ao carregar dados do aluno:', error);
    });
}

// Função para salvar as alterações do aluno
function salvarAlteracoes(alunoId) {
    // Coleta os dados atualizados do formulário
    const alunoAtualizado = {
        nome: document.getElementById('editNome').value.toUpperCase(),
        dataNascimento: document.getElementById('editDataNascimento').value,
        idade: calcularIdade(document.getElementById('editDataNascimento').value),
        modalidade: document.getElementById('editModalidade').value,
        faixa: document.getElementById('editModalidade').value === 'Karaté' ? document.getElementById('editFaixa').value : '',
        horario: document.getElementById('editHorario').value,
        tipo: document.getElementById('editTipo').value,
        genero: document.getElementById('editGenero').value
    };

    // Envia os dados atualizados ao backend
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
            window.location.href = 'alunos.html';  // Volta para a página de listagem de alunos
        } else {
            alert('Erro ao atualizar aluno.');
        }
    })
    .catch(error => {
        console.error('Erro ao atualizar aluno:', error);
    });
}

// Chama a função ao carregar a página de edição
window.addEventListener('DOMContentLoaded', carregarDadosAluno);
