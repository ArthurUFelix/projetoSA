var banco = getBanco();

$(document).ready(function() {
    // Erro vem por default escondido
    $('#error-div').hide();

    // Se houver parâmetro de erro
    if(location.search.substring(1)) {
        alert("Você precisa estar logado para acessar esta página!");
        location = location.href.split('?')[0];
    }

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
                    location = location.href.replace('login.html', 'loja/index.html');
                }
            }
        });

        //  Se chegar até aqui, é porque não conseguiu se logar, apresenta um erro
        $('#error-div').slideToggle().delay(5000).slideToggle();
    });
});

// Função que verifica se o usuário esta logado, caso não, redireciona-o para a tela de login
// Função deve ser chamada quando for necessário tal validação
function verifyAuth() {
    var rootPath = location.href.split("pages");
    var loginPath = rootPath[0] + "pages/login.html?authError";

    if(!sessionStorage.getItem('auth')) {
        window.open(loginPath, "_self");
    }
}