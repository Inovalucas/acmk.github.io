// Função para carregar os horários do backend e preencher o select de horários
function carregarHorarios() {
    fetch('http://localhost:3000/horarios')  // Faz uma requisição GET para buscar os horários do backend
    .then(response => response.json())  // Converte a resposta para JSON
    .then(horarios => {
        console.log('Horários recebidos do backend:', horarios);  // Log para verificar os horários recebidos

        const selectHorario = document.getElementById('filtroHorario');
        selectHorario.innerHTML = '<option value="">Todos os Horários</option>';  // Adiciona a opção padrão

        // Preenche o select com os horários retornados do backend, formatando-os
        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.horario;  // O valor original do horário (HH:MM:SS)
            option.textContent = formatarHorario(horario.horario);  // Formata o horário exibindo apenas as horas (HHh)
            selectHorario.appendChild(option);  // Adiciona o horário formatado ao select
        });
    })
    .catch(error => {
        console.error('Erro ao carregar horários:', error);  // Exibe erros no console do navegador
    });
}

// Carregar os horários assim que a página for carregada
window.addEventListener('DOMContentLoaded', carregarHorarios);

// Função para formatar o horário, exibindo as horas seguidas de "h" e minutos, se necessário
function formatarHorario(horario) {
    if (!horario) return '';  // Se o horário for inválido ou nulo, retorna uma string vazia
    const [horas, minutos] = horario.split(':');  // Divide o horário em horas e minutos

    // Verifica se os minutos são diferentes de "00" para decidir se exibe ou não
    if (minutos === "00") {
        return `${horas}h`;  // Exibe apenas as horas se os minutos forem "00"
    } else {
        return `${horas}h${minutos}`;  // Exibe as horas e os minutos (ex: "21h30")
    }
}
