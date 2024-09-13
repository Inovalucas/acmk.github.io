document.getElementById('formCadastro')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.toUpperCase();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const idade = calcularIdade(dataNascimento);
    const modalidade = 'Natação';
    const horario = document.getElementById('horario').value;
    const tipo = document.getElementById('tipo').value;
    const genero = document.getElementById('genero').value;

    const aluno = { nome, dataNascimento, idade, modalidade, faixa: '', horario, tipo, genero };

    fetch('http://localhost:4000/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno),
    })
    .then(response => response.ok ? alert('Aluno cadastrado com sucesso!') : alert('Erro ao cadastrar aluno.'))
    .catch(error => console.error('Erro ao cadastrar aluno:', error));
});
