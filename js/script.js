let info;
let nomeUsuario;
const main = document.querySelector("main");
pedirInfo();
entrarNaSala();
setInterval(pedirInfo, 3000);
setInterval(reenviarDadosUsuario, 5000);

function entrarNaSala() {
	nomeUsuario = prompt("Qual é o seu apelido?");
	const dadosUsuario = {
		name: nomeUsuario,
	};
	const requisicao = axios.post(
		"https://mock-api.driven.com.br/api/v4/uol/participants",
		dadosUsuario
	);

	requisicao.then(validarUsuario);
	requisicao.catch(erroValidarUsuario);
}

function validarUsuario(resposta) {
	console.log(resposta);
}

function erroValidarUsuario(erro) {
	console.log(erro.response);
	alert("Apelido já existente\nDigite outro apelido");
	nomeUsuario = prompt("Qual é o seu apelido?");
	const dadosUsuario = {
		name: nomeUsuario,
	};
	const requisicao = axios.post(
		"https://mock-api.driven.com.br/api/v4/uol/participants",
		dadosUsuario
	);

	requisicao.then(validarUsuario);
	requisicao.catch(erroValidarUsuario);
}

function reenviarDadosUsuario() {
	const statusUsuario = {
		name: nomeUsuario,
	};
	const requisicao = axios.post(
		"https://mock-api.driven.com.br/api/v4/uol/status",
		statusUsuario
	);
}

function enviarMensagem() {
	const input = document.querySelector("input").value;
	console.log(input);
	if (input === "") {
		alert("Digite uma mensagem válida");
	} else {
		const InfoMensagemEnviada = {
			from: nomeUsuario,
			to: "Todos",
			text: input,
			type: "message",
		};
		const requisicao = axios.post(
			"https://mock-api.driven.com.br/api/v4/uol/messages",
			InfoMensagemEnviada
		);
		requisicao.then(pedirInfo);
		requisicao.catch(recarregarPagina);
	}
}

function recarregarPagina() {
	window.location.reload();
}

function pedirInfo() {
	const promise = axios.get(
		"https://mock-api.driven.com.br/api/v4/uol/messages"
	);

	promise.then(pegarInfo);
}

function pegarInfo(informacao) {
	info = informacao.data;
	mostrarMensagens();
}

function mostrarMensagens() {
	main.innerHTML = "";
	for (let i = 0; i < info.length; i++) {
		if (info[i].type === "status") {
			main.innerHTML += ` 
    <div class="container-mensagem status_msg">
        <div class="mensagem">
            <small>(${info[i].time})</small><span>${info[i].from}</span> ${info[i].text}
        </div>
    </div>
    
    `;
		} else if (info[i].type === "message") {
			main.innerHTML += ` 
    <div class="container-mensagem ">
        <div class="mensagem">
            <small>(${info[i].time})</small><span>${info[i].from}</span> para <span>${info[i].to}:</span> ${info[i].text}
        </div>
    </div>
    
    `;
		} else if (info[i] === "private_message") {
			main.innerHTML += ` 
    <div class="container-mensagem private_msg">
        <div class="mensagem">
            <small>(${info[i].time})</small><span>${info[i].from}</span> reservadamente para <span>${info[i].to}:</span> ${info[i].text}
        </div>
    </div>
    `;
		}
	}
	mostrarUltimaMensagem();
}

function mostrarUltimaMensagem() {
	const mensagens = document.querySelectorAll(".container-mensagem");
	mensagens[mensagens.length - 1].scrollIntoView();
}
