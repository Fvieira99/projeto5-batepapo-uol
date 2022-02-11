let info;
let nomeUsuario;
const main = document.querySelector("main");
const telaLogin = document.querySelector(".container-login");

document.querySelector(".input-login").onkeydown = function (e) {
	if (e.key === "Enter") {
		entrarNaSala();
	}
};

function entrarNaSala() {
	nomeUsuario = document.querySelector(".input-login").value;
	console.log(nomeUsuario);
	const dadosUsuario = {
		name: nomeUsuario,
	};
	const requisicao = axios.post(
		"https://mock-api.driven.com.br/api/v4/uol/participants",
		dadosUsuario
	);
	telaLogin.innerHTML = `
	<img src="./assets/logo_Uol.svg" alt="Logo Uol" />
	
	<img class="gif-carregamento" src="./assets/Spinner.gif" alt="Gif de Carregamento" />
	
	<p>Entrando...</p>
	`;

	requisicao.then(setTimeout(validarUsuario, 2000));
	requisicao.catch(erroValidarUsuario);
}

function validarUsuario(resposta) {
	telaLogin.classList.add("desabilitado");
	pedirInfo();
	setInterval(pedirInfo, 3000);
	setInterval(reenviarDadosUsuario, 5000);
}

function erroValidarUsuario(erro) {
	alert("Apelido inválido ou já existente\nDigite outro apelido");
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
		<div class="container-mensagem status_msg" data-identifier="message">
			<div class="mensagem">
				<small>(${info[i].time})</small><span>${info[i].from}</span> ${info[i].text}
			</div>
		</div>
	
		`;
		} else if (info[i].type === "message") {
			main.innerHTML += ` 
		<div class="container-mensagem" data-identifier="message">
			<div class="mensagem">
				<small>(${info[i].time})</small><span>${info[i].from}</span> para <span>${info[i].to}:</span> ${info[i].text}
			</div>
		</div>
	
		`;
		} else if (
			info[i].type === "private_message" &&
			info[i].to === nomeUsuario
		) {
			main.innerHTML += ` 
		<div class="container-mensagem private_msg" data-identifier="message">
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

function reenviarDadosUsuario() {
	const statusUsuario = {
		name: nomeUsuario,
	};
	const requisicao = axios.post(
		"https://mock-api.driven.com.br/api/v4/uol/status",
		statusUsuario
	);
}

document.querySelector(".input-mensagem").onkeydown = function (e) {
	if (e.key === "Enter") {
		enviarMensagem();
	}
};

function enviarMensagem() {
	let input = document.querySelector("input").value;
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
		document.querySelector("input").value = "";
		requisicao.then(pedirInfo);
		requisicao.catch(recarregarPagina);
	}
}

function recarregarPagina() {
	window.location.reload();
}
