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

// Função para formatar a data de nascimento (de ISO para DD/MM/YYYY)
function formatarData(dataISO) {
    if (!dataISO) return '';  // Se a data for inválida ou nula, retorna uma string vazia
    const dataObj = new Date(dataISO);  // Converte o formato ISO para um objeto Date
    const dia = String(dataObj.getUTCDate()).padStart(2, '0');  // Pega o dia no formato correto
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');  // Mês começa em 0, por isso +1
    const ano = dataObj.getUTCFullYear();  // Pega o ano no formato UTC
    return `${dia}/${mes}/${ano}`;  // Retorna a data formatada como DD/MM/YYYY
}

// Função para formatar o horário, exibindo apenas as horas seguidas de "h"
function formatarHorario(horario) {
    if (!horario) return '';  // Se o horário for inválido ou nulo, retorna uma string vazia
    const [horas] = horario.split(':');  // Divide o horário pelos ":" e pega apenas as horas
    console.log(`Horário original: ${horario}, Horário formatado: ${horas}h`);  // Log para verificar a formatação
    return `${horas}h`;  // Retorna as horas seguidas de "h"
}
