// ==========================================
// GESTIÓN DE DATOS Y ESTADO
// ==========================================

// Datos iniciales del inventario
const inventarioInicial = {
    'N°1': 0,
    'N°2': 0,
    'N°3': 0,
    'N°4': 0
};

// Estado de la aplicación
let inventario = {};
let pedidosActuales = [];

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    cargarInventarioTabla();
    navegateTo('menu-principal');
});

// Cargar datos del localStorage o usar valores iniciales
function cargarDatos() {
    const datosGuardados = localStorage.getItem('inventario');
    if (datosGuardados) {
        inventario = JSON.parse(datosGuardados);
    } else {
        inventario = { ...inventarioInicial };
        guardarDatos();
    }
}

// Guardar datos en localStorage
function guardarDatos() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function navigateTo(vista) {
    // Ocultar todas las vistas
    const vistas = ['menu-principal', 'gestion-inventario', 'armar-pedidos', 'calculo-shopify'];
    vistas.forEach(v => {
        document.getElementById(v).classList.add('hidden');
    });

    // Mostrar la vista solicitada
    document.getElementById(vista).classList.remove('hidden');

    // Cargar datos específicos según la vista
    switch(vista) {
        case 'gestion-inventario':
            cargarInventarioTabla();
            break;
        case 'armar-pedidos':
            cargarTablaPedidos();
            actualizarInstrucciones();
            break;
        case 'calculo-shopify':
            calcularDisponibilidadShopify();
            break;
    }
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        alert('Sesión cerrada exitosamente');
        // Aquí podrías redirigir a una página de login si existiera
    }
}

// ==========================================
// GESTIÓN DE INVENTARIO
// ==========================================

function cargarInventarioTabla() {
    const tbody = document.querySelector('#tabla-inventario tbody');
    tbody.innerHTML = '';

    Object.keys(inventario).forEach(aroma => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${aroma}</td>
            <td class="px-6 py-4">
                <input type="number"
                       min="0"
                       value="${inventario[aroma]}"
                       data-aroma="${aroma}"
                       class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       onchange="actualizarInventarioTemporal(this)">
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarInventarioTemporal(input) {
    const aroma = input.dataset.aroma;
    const valor = parseInt(input.value) || 0;
    inventario[aroma] = valor;
}

function guardarCambiosInventario() {
    guardarDatos();
    alert('✅ Cambios guardados exitosamente');
    cargarInventarioTabla();
}

// ==========================================
// ARMAR PEDIDOS
// ==========================================

function agregarALista() {
    const tipoPack = document.getElementById('combo-tipo-pack').value;
    const spin1 = parseInt(document.getElementById('spin-1').value) || 0;
    const spin2 = parseInt(document.getElementById('spin-2').value) || 0;
    const spin3 = parseInt(document.getElementById('spin-3').value) || 0;
    const spin4 = parseInt(document.getElementById('spin-4').value) || 0;

    // Validaciones
    if (!tipoPack) {
        alert('⚠️ Por favor seleccione un tipo de pedido');
        return;
    }

    const total = spin1 + spin2 + spin3 + spin4;
    const cantidadRequerida = parseInt(tipoPack.replace('pack', ''));

    if (total !== cantidadRequerida) {
        alert(`⚠️ La suma de aromas debe ser ${cantidadRequerida} para un ${tipoPack}`);
        return;
    }

    if (spin1 < 0 || spin2 < 0 || spin3 < 0 || spin4 < 0) {
        alert('⚠️ Las cantidades no pueden ser negativas');
        return;
    }

    // Agregar pedido
    const pedido = {
        id: Date.now(),
        tipo: tipoPack,
        n1: spin1,
        n2: spin2,
        n3: spin3,
        n4: spin4
    };

    pedidosActuales.push(pedido);
    cargarTablaPedidos();
    actualizarInstrucciones();

    // Limpiar formulario
    document.getElementById('spin-1').value = 0;
    document.getElementById('spin-2').value = 0;
    document.getElementById('spin-3').value = 0;
    document.getElementById('spin-4').value = 0;
    document.getElementById('combo-tipo-pack').value = '';

    alert('✅ Pedido agregado a la lista');
}

function cargarTablaPedidos() {
    const tbody = document.querySelector('#tabla-pedidos tbody');
    tbody.innerHTML = '';

    if (pedidosActuales.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    No hay pedidos en la lista
                </td>
            </tr>
        `;
        return;
    }

    pedidosActuales.forEach(pedido => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${pedido.tipo}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${pedido.n1}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${pedido.n2}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${pedido.n3}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${pedido.n4}</td>
            <td class="px-4 py-3 text-sm">
                <button onclick="eliminarPedido(${pedido.id})"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition duration-200">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarPedido(id) {
    if (confirm('¿Está seguro de eliminar este pedido?')) {
        pedidosActuales = pedidosActuales.filter(p => p.id !== id);
        cargarTablaPedidos();
        actualizarInstrucciones();
    }
}

function actualizarInstrucciones() {
    const instruccionesDiv = document.getElementById('instrucciones');

    if (pedidosActuales.length === 0) {
        instruccionesDiv.innerHTML = '<p class="text-gray-500 text-center">No hay pedidos para procesar</p>';
        return;
    }

    // Calcular totales
    const totales = {
        'N°1': 0,
        'N°2': 0,
        'N°3': 0,
        'N°4': 0
    };

    pedidosActuales.forEach(pedido => {
        totales['N°1'] += pedido.n1;
        totales['N°2'] += pedido.n2;
        totales['N°3'] += pedido.n3;
        totales['N°4'] += pedido.n4;
    });

    let html = '<div class="space-y-2">';
    html += `<p class="font-semibold text-gray-800">Total de unidades necesarias:</p>`;
    html += '<ul class="space-y-1 ml-4">';

    Object.keys(totales).forEach(aroma => {
        if (totales[aroma] > 0) {
            const disponible = inventario[aroma] || 0;
            const suficiente = disponible >= totales[aroma];
            const clase = suficiente ? 'text-green-700' : 'text-red-700';
            const icono = suficiente ? '✓' : '✗';

            html += `<li class="${clase}">
                ${icono} ${aroma}: ${totales[aroma]} unidades (Disponible: ${disponible})
            </li>`;
        }
    });

    html += '</ul></div>';
    instruccionesDiv.innerHTML = html;
}

function procesarPedidos() {
    if (pedidosActuales.length === 0) {
        alert('⚠️ No hay pedidos para procesar');
        return;
    }

    // Calcular totales necesarios
    const totales = {
        'N°1': 0,
        'N°2': 0,
        'N°3': 0,
        'N°4': 0
    };

    pedidosActuales.forEach(pedido => {
        totales['N°1'] += pedido.n1;
        totales['N°2'] += pedido.n2;
        totales['N°3'] += pedido.n3;
        totales['N°4'] += pedido.n4;
    });

    // Verificar stock disponible
    let stockSuficiente = true;
    let mensajeError = 'Stock insuficiente para:\n';

    Object.keys(totales).forEach(aroma => {
        const necesario = totales[aroma];
        const disponible = inventario[aroma] || 0;

        if (necesario > disponible) {
            stockSuficiente = false;
            mensajeError += `\n${aroma}: necesita ${necesario}, disponible ${disponible}`;
        }
    });

    if (!stockSuficiente) {
        alert('⚠️ ' + mensajeError);
        return;
    }

    // Confirmar procesamiento
    if (!confirm('¿Está seguro de procesar estos pedidos y descontar del stock?')) {
        return;
    }

    // Descontar del inventario
    Object.keys(totales).forEach(aroma => {
        inventario[aroma] -= totales[aroma];
    });

    // Guardar cambios
    guardarDatos();

    // Limpiar pedidos
    pedidosActuales = [];
    cargarTablaPedidos();
    actualizarInstrucciones();

    alert('✅ Pedidos procesados exitosamente. Stock actualizado.');
}

// ==========================================
// DISPONIBILIDAD SHOPIFY
// ==========================================

function calcularDisponibilidadShopify() {
    const tbody = document.querySelector('#tabla-shopify tbody');
    tbody.innerHTML = '';

    const tiposPacks = [
        { nombre: 'Pack de 4', cantidad: 4 },
        { nombre: 'Pack de 6', cantidad: 6 },
        { nombre: 'Pack de 8', cantidad: 8 }
    ];

    tiposPacks.forEach(pack => {
        const disponibilidad = calcularMaximoPacks(pack.cantidad);

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${pack.nombre}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    disponibilidad > 10 ? 'bg-green-100 text-green-800' :
                    disponibilidad > 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }">
                    ${disponibilidad} packs
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularMaximoPacks(unidadesPorPack) {
    // Calcular el máximo de packs que se pueden hacer con el stock actual
    // asumiendo distribución equitativa de aromas

    const stockMinimo = Math.min(
        inventario['N°1'] || 0,
        inventario['N°2'] || 0,
        inventario['N°3'] || 0,
        inventario['N°4'] || 0
    );

    const stockTotal = Object.values(inventario).reduce((sum, val) => sum + val, 0);

    // El máximo de packs es el menor entre:
    // 1. Stock total / unidades por pack
    // 2. Stock mínimo * 4 / unidades por pack (considerando que necesitamos de todos)
    const maxPorTotal = Math.floor(stockTotal / unidadesPorPack);
    const maxPorMinimo = Math.floor((stockMinimo * 4) / unidadesPorPack);

    return Math.min(maxPorTotal, maxPorMinimo);
}

function recalcularDisponibilidad() {
    cargarDatos(); // Recargar datos del localStorage
    calcularDisponibilidadShopify();
    alert('✅ Disponibilidad recalculada');
}

// ==========================================
// UTILIDADES
// ==========================================

// Función para exportar datos (opcional)
function exportarDatos() {
    const datos = {
        inventario: inventario,
        fecha: new Date().toISOString()
    };

    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Función para importar datos (opcional)
function importarDatos(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datos = JSON.parse(e.target.result);
            if (datos.inventario) {
                inventario = datos.inventario;
                guardarDatos();
                cargarInventarioTabla();
                alert('✅ Datos importados exitosamente');
            }
        } catch (error) {
            alert('⚠️ Error al importar datos: ' + error.message);
        }
    };
    reader.readAsText(file);
}
