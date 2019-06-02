var banco = getBanco();

/**************
    create.html
***************/
$(document).ready(function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    $('#add-client-form').submit(function(event){
        if($('#add-client-form').is(':valid')) {
            event.preventDefault();

            // formata os dados e insere no banco
            let dados = {
                name: $('#clientName').val(),
                address: $('#clientAddress').val(),
                phone: $('#clientPhone').val(),
                email: $('#clientEmail').val()
            };
            bancoInsert("clientes", dados);
    
            // redireciona o usuário para a tela de estoque
            alert("Dps redirecionar user");
        }
    });
});

/**************
    index.html
***************/
$(document).ready(function(){
    if(banco) {
        let clientes = banco[0].clientes;
        let tabelaClientes = $('#tabelaClientes tbody');

        tabelaClientes.text('');
        clientes.forEach(function(item, index){
            tabelaClientes.append("<tr><th scope='row'>"+item.name+"</th><td>"+item.address+"</td><td>"+item.phone+"</td><td>"+item.email+"</td><td><i class='material-icons color-red'>delete</i><i class='material-icons color-blue'>border_color</i></td></tr>");
        });
    }
});