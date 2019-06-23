$(document).ready(function() {

	// Verifica se o usuário esta logado. Caso não, o redireciona para a tela de login 
	// Ocorre em TODAS as páginas do interior da dashboard
	verifyAuth();

	// Validação de formulário fornecida pelo Bootstrap 4
	var forms = document.getElementsByClassName('needs-validation');
	var validation = Array.prototype.filter.call(forms, function(form) {
	    form.addEventListener('submit', function(event) {
	        if (form.checkValidity() === false) {
	            event.preventDefault();
	            event.stopPropagation();
	        }
	        form.classList.add('was-validated');
	    }, false);
	});
});

function gerarCodigo() {
	var r1, r2, r3, rNumber;
	var min = 10;
	var max = 99;  

	r1 = (Math.random() * (+max - +min) + +min).toFixed(0);
	r2 = (Math.random() * (+max - +min) + +min).toFixed(0);
	r3 = (Math.random() * (+max - +min) + +min).toFixed(0);
	rNumber = Number(String(r1) + String(r2) + String(r3));

	return rNumber;
}