var banco = getBanco();

// Atualiza a tabela de Relatórios
$(document).ready(function() {
    let tabela = $('#tabelaVendas tbody');
    tabela.text('');

    let vendas = banco[0].vendas;
    vendas.forEach(function(item, index) {
        let produtosString = '';
        item.produtos.forEach(function(itemPro, indexPro) {
            if(indexPro < (item.produtos.length - 1))
                produtosString += itemPro.desc + ', ';
            else
                produtosString += itemPro.desc;
        });
        tabela.append("<tr><td class='vendaData'>" + item.dataFormatada + "</td><td class='vendaLoja'>" + item.loja + "</td><td class='vendaVendedor'>" + item.funcionario.nome + "</td><td class='vendaProd'>" + produtosString + "</td><td class='vendaClient'>" + item.cliente.name + "</td><td class='vendaTotal'>R$ " + item.total + "</td></tr>");
    });

    dadosMainCard();
});

// Total
var totalValue = 0;
// Cliente
var bestCliente, clientes = [], clientesQnt = [];;
// Periodo
var bestPeriodo;
var periodos = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
var periodosQnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// Produto
var bestProductName, products = [], productsQnt = [];
// Vendedor
var bestFunc, funcionarios = [], funcionariosQnt = [];

function dadosMainCard() {
    let vendas = banco[0].vendas;
    vendas.forEach(function(item, index) {
        // Calcula melhor produto
        item.produtos.forEach(function(itemPro, indexPro) {
            if(products.includes(itemPro.desc)) {
                let productIndex = products.indexOf(itemPro.desc);
                productsQnt[productIndex] += Number(itemPro.qntVenda);
            } else {
                products.push(itemPro.desc);
                productsQnt.push(Number(itemPro.qntVenda));
            }
            totalValue += itemPro.val * itemPro.qntVenda;
        });

        // Calcula melhor vendedor
        let queryFunc = funcionarios.filter(function(f) { return f.id === item.funcionario.id; });
        if(queryFunc.length > 0) {
            let funcIndex = funcionarios.indexOf(...queryFunc);
            funcionariosQnt[funcIndex]++
        } else {
            funcionarios.push(item.funcionario);
            funcionariosQnt.push(1);
        }

        // Calcula o melhor período
        periodosQnt[new Date(item.data).getMonth()]++
        console.log(periodosQnt);

        // Calcula o melhor cliente
        let queryCliente = clientes.filter(function(f) { return f.id === item.cliente.cpf; });
        if(queryCliente.length > 0) {
            let funcIndex = clientes.indexOf(...queryCliente);
            clientesQnt[funcIndex]++
        } else {
            clientes.push(item.cliente);
            clientesQnt.push(1);
        }
    });

    bestProductName = products[productsQnt.indexOf(Math.max(...productsQnt))];
    bestFunc = funcionarios[funcionariosQnt.indexOf(Math.max(...funcionariosQnt))];
    bestPeriodo = periodos[periodosQnt.indexOf(Math.max(...periodosQnt))];
    bestCliente = clientes[clientesQnt.indexOf(Math.max(...clientesQnt))];

    // Adiciona os valores a view
    $('#totalVendasCard').text("R$ " + totalValue.toFixed(2));
    $('#bestVendedor').text("[" + bestFunc.id + "] " + bestFunc.nome);
    $('#bestProd').text(bestProductName);
    $('#bestPeriod').text(bestPeriodo);
    $('#bestClient').text(bestCliente.name + " - " + bestCliente.cpf);
}
$(document).ready(function() {
    //Chart.js -- TOTAL DE VENDAS
    var ctx = $("#chartVendas");
    var chartVendas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Vendas',
                backgroundColor: [
                'rgba(54, 162, 235, 1)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                data: periodosQnt.slice(0,6),
                fill: true,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Total de Vendas, em R$'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Mês'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'R$'
                    }
                }]
            }
        }
    });
    
    
    //Chart.js -- MELHORES VENDEDORES
    var ctx = $("#chartVendedores");
    var chartVendedores = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["vermelho", "azul", "amarelo"],
            datasets: [{
                label: "Vendas, em R$",
                data: [5, 10, 15],
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Melhores Vendedores',
                position: 'top',
            }
        }
    });
    
    //Chart.js -- MELHORES PRODUTOS
    var ctx = $("#chartProdutos");
    var chartProdutos = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["PlayStation 4 Pro", "Xbox One X", "Nintendo Switch"],
            datasets: [{
                label: "Número de vendas",
                data: [50, 70, 26],
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Produtos mais vendidos',
                position: 'top',
            }
        }
    });
});