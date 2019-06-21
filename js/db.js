// Busca o "banco" atualizado
// OBS: Caso seja adicionada uma nova tabela, a mesma deve ser adicionada no banco default
function getBanco()
{
    // Se estiver setado o localStorage (com o meu banco)
    if(localStorage.banco)
    {
        return JSON.parse(localStorage.getItem('banco'));
    } else {
        // Cria o usuário master por padrão
        return [{
            loja: [{}],
            produtos: [],
            funcionarios: [{name: "Admin", cod: "0", adDate: "1010-10-10", cargo: "Gerente", admin: "true"}],
            clientes: [],
            vendas: []
        }];
    }
}

var banco = getBanco();

// Função para adicionar dados a uma determinada tabela do banco
function bancoInsert(tabela, dados)
{
    eval("banco[0]."+tabela+".push("+JSON.stringify(dados)+")");
    localStorage.setItem('banco', JSON.stringify(banco));
}

function bancoDelete(tabela, id)
{
    let tabelaBanco = eval("banco[0]."+tabela);
    tabelaBanco.forEach(function(item, index){
        if(index == id)
            tabelaBanco.splice(index, 1);
    });
    localStorage.setItem('banco', JSON.stringify(banco));
}

function bancoUpdate(tabela, id, dados)
{
    let tabelaBanco = eval("banco[0]."+tabela);
    if(tabelaBanco[id])
    {
        tabelaBanco[id] = "";
        tabelaBanco[id] = dados;
    } else {
        console.log("Item não encontrado para edição");
    }
    localStorage.setItem('banco', JSON.stringify(banco));
}