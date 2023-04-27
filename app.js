const up = document.querySelector('#up');
const btn = document.querySelector('#btn');
const form = document.querySelector('.datos');
const btnCont = document.querySelector('.contenido .btn');
const contenido = document.querySelector('.contenido');
const btnEnviar = document.querySelector('#enviar');
const inputNombre = document.querySelector('#nombre');
const inputMascota = document.querySelector('#mascota');
const inputTiempo = document.querySelector('#tiempo');
const inputSintomas = document.querySelector('#sintomas');
const formulario = document.querySelector('.form');
const mensaje = document.querySelector('.mensaje');

// array y obj de mascota
let listaMascotas = [];
let objMascota = {
	nombre: '',
	mascota: '',
	tiempo: '',
	sintomas: '',
	id: '',
};

// Cargar LS
document.addEventListener('DOMContentLoaded', () => {
	listaMascotas = JSON.parse(localStorage.getItem('mascota')) || [];
	mostrarPacientes();
});

// Mover div
btn.addEventListener('click', function () {
	form.style.transform = 'translateX(-3000px)';
	contenido.style.transform = 'translate(-50%,0)';
});

btnCont.onclick = () => moverDiv();

function moverDiv() {
	form.style.transform = 'translate(-50%,0)';
	contenido.style.transform = 'translateX(2000px)';
}

//

// scroll hacia arriba en contenido
up.addEventListener('click', () => {
	contenido.scroll(0, 0);
});

let editando = false;

// al clickear el boton del form
btnEnviar.addEventListener('click', () => {
	validarFormulario();
});

// funciones

function validarFormulario() {
	if (
		inputNombre.value === '' ||
		inputMascota === '' ||
		inputSintomas === '' ||
		inputTiempo === ''
	) {
		textMensaje('Todos los campos son obligatorios');
		return;
	}

	if (editando) {
		editarMascota();
		textMensaje('Editado correctamente');

		editando = false;
	} else {
		objMascota.nombre = inputNombre.value;
		objMascota.mascota = inputMascota.value;
		objMascota.tiempo = inputTiempo.value;
		objMascota.sintomas = inputSintomas.value;
		objMascota.id = Date.now();
		agregarMascota();
		textMensaje('Agregado correctamente');
	}
}

function textMensaje(texto) {
	mensaje.textContent = texto;
	mensaje.style.left = '20px';
	setTimeout(() => {
		mensaje.style.left = '-1000px';
	}, 3000);
}

function agregarMascota() {
	listaMascotas.push({ ...objMascota });

	mostrarPacientes();

	sincronizarLS();

	formulario.reset();

	limpiarObjeto();
}

function sincronizarLS() {
	const guardarMascota = JSON.stringify(listaMascotas);
	localStorage.setItem('mascota', guardarMascota);
}

function limpiarObjeto() {
	objMascota.id = '';
	objMascota.nombre = '';
	objMascota.mascota = '';
	objMascota.tiempo = '';
	objMascota.sintomas = '';
}

function mostrarPacientes() {
	limpiarHTML();

	const divPacientes = document.querySelector('.pacientes');

	listaMascotas.forEach((paciente) => {
		const { id, nombre, mascota, tiempo, sintomas } = paciente;

		divPacientes.insertAdjacentHTML(
			'afterbegin',
			`
			<div class="contenedor" data-id=${id}>
				<div class="textos">
					<p><b>Nombre del dueño: </b>${nombre}</p>
					<p><b>Nombre de la mascota: </b>${mascota}</p>
					<p><b>Fecha de ingreso: </b>${tiempo}</p>
					<p><b>Sintomas de la mascota: </b>${sintomas}</p>
				</div>
				<div class="botones">
					<i class="fa-solid fa-trash-can btn-delete" onclick="eliminarPaciente(${id})"> </i>
				</div>
			</div>
		`
		);

		const i = document.createElement('i');
		i.classList.add('fa-regular', 'fa-pen-to-square', 'btn-editar');
		i.onclick = () => {
			moverDiv();
			cargarMascota(paciente);
		};
		const divBotones = document.querySelector('.botones');
		divBotones.append(i);
	});
}

function cargarMascota(paciente) {
	const { id, mascota, nombre, tiempo, sintomas } = paciente;

	inputNombre.value = nombre;
	inputMascota.value = mascota;
	inputTiempo.value = tiempo;
	inputSintomas.value = sintomas;
	objMascota.id = id;

	btnEnviar.textContent = 'Actualizar';

	editando = true;
}

function editarMascota() {
	objMascota.nombre = inputNombre.value;
	objMascota.mascota = inputMascota.value;
	objMascota.tiempo = inputTiempo.value;
	objMascota.sintomas = inputSintomas.value;

	listaMascotas.map((paciente) => {
		if (paciente.id === objMascota.id) {
			paciente.id = objMascota.id;
			paciente.nombre = objMascota.nombre;
			paciente.mascota = objMascota.mascota;
			paciente.tiempo = objMascota.tiempo;
			paciente.sintomas = objMascota.sintomas;
		}
	});

	limpiarHTML();
	sincronizarLS();
	mostrarPacientes();
	formulario.reset();

	btnEnviar.textContent = 'Agregar';

	editando = false;
}
function eliminarPaciente(id) {
	listaMascotas = listaMascotas.filter((paciente) => paciente.id !== id);
	textMensaje('Eliminado correctamente');
	limpiarHTML();
	sincronizarLS();
	mostrarPacientes();
}

function limpiarHTML() {
	const divPacientes = document.querySelector('.pacientes');
	while (divPacientes.firstChild) {
		divPacientes.removeChild(divPacientes.firstChild);
	}
}
