// Função para calcular a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

// Atualiza a idade automaticamente ao escolher a data de nascimento
document.getElementById('dataNascimento').addEventListener('change', function () {
    const dataNascimento = this.value;
    const idade = calcularIdade(dataNascimento);
    document.getElementById('idade').textContent = idade;  // Exibe a idade calculada
});

// Exibe ou oculta o campo de faixa com base na modalidade selecionada
document.getElementById('modalidade').addEventListener('change', function () {
    const modalidadeSelecionada = this.value;
    const faixaField = document.getElementById('faixaField');

    if (modalidadeSelecionada === 'Karaté') {
        faixaField.style.display = 'block';  // Exibe o campo de faixa
        document.getElementById('faixa').required = true;  // Torna o campo de faixa obrigatório
    } else {
        faixaField.style.display = 'none';  // Oculta o campo de faixa
        document.getElementById('faixa').required = false;  // Remove a obrigatoriedade
    }
});

// Função para lidar com o envio do formulário
document.getElementById('formCadastro').addEventListener('submit', function (e) {
    e.preventDefault();

    // Captura os dados do formulário
    const nome = document.getElementById('nome').value.toUpperCase();
    const dataNascimento = document.getElementById('dataNascimento').value;
    const idade = calcularIdade(dataNascimento);
    const modalidade = document.getElementById('modalidade').value;
    const genero = document.getElementById('genero').value;
    const horario = document.getElementById('horario').value;
    const tipo = document.getElementById('tipo').value;

    // Captura o valor da faixa apenas se a modalidade for Karaté
    let faixa = '';
    if (modalidade === 'Karaté') {
        faixa = document.getElementById('faixa').value;
        if (faixa === '') {
            alert('Por favor, selecione a faixa para Karaté.');
            return;
        }
    }

    // Cria o objeto aluno com os dados capturados
    const aluno = {
        nome,
        dataNascimento,
        idade,
        modalidade,
        faixa,  // Inclui a faixa apenas para Karaté
        horario,
        tipo,
        genero
    };

    // Envia os dados do aluno ao backend
    fetch('http://localhost:4000/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
    })
    .then(response => {
        if (response.ok) {
            alert('Aluno cadastrado com sucesso!');
            document.getElementById('formCadastro').reset();  // Reseta o formulário após o cadastro
            document.getElementById('faixaField').style.display = 'none';  // Oculta o campo de faixa após cadastro
            document.getElementById('idade').textContent = '0';  // Reseta a idade exibida
        } else {
            alert('Erro ao cadastrar aluno.');
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar aluno:', error);
    });
});
