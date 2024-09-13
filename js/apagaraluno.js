// Função para apagar um aluno
function apagarAluno(alunoId) {
    if (confirm('Tem certeza que deseja apagar este aluno?')) {
        fetch(`http://170.150.222.59:4000/alunos/${alunoId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Aluno apagado com sucesso!');
                exibirAlunos();  // Atualiza a lista de alunos após apagar
            } else {
                alert('Erro ao apagar aluno.');
            }
        })
        .catch(error => {
            console.error('Erro ao apagar aluno:', error);
            alert('Erro ao apagar aluno.');
        });
    }
}
