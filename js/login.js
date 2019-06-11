var banco = getBanco();


$(document).ready(function() {
    $('#error-div').hide();
    
    $('#login-form').submit(function(event) {
        event.preventDefault();

        // Busca os valores dos campos
        let cod = $('#login-form #cod').val();
        let name = $('#login-form #name').val();

        // Verifica se o dado recebido bate com algum dado na tabela de funcionários
        let funcionarios = banco[0].funcionarios;
        funcionarios.forEach(function(item, index) {
            if(item.cod == cod) {
                if(item.name == name) {
                    // Se o CÓDIGO e o NOME for igual, autentica o usuário e verifica se ele é administrador
                    let auth = {
                        valid: true,
                        userData: item,
                        admin: false
                    }
                    sessionStorage.setItem('auth', JSON.stringify(auth));
                    window.location = window.location.href.replace('login.html', 'loja/index.html');
                }
            }
        });

        //  Se chegar até aqui, é porque não conseguiu se logar
        // Apresentar erro
        $('#error-div').slideToggle().delay(5000).slideToggle();

    });
});