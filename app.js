// ==========================================
// GESTIÓN DE DATOS Y ESTADO
// ==========================================

// Estructura de inventario: 4 aromas x 2 tipos (Case y Recarga)
const inventarioInicial = {
    '1': { 'Case': 0, 'Recarga': 0 },
    '2': { 'Case': 0, 'Recarga': 0 },
    '3': { 'Case': 0, 'Recarga': 0 },
    '4': { 'Case': 0, 'Recarga': 0 }
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
    navigateTo('menu-principal');
});

// Cargar datos del localStorage o usar valores iniciales
function cargarDatos() {
    const datosGuardados = localStorage.getItem('inventario');
    if (datosGuardados) {
        inventario = JSON.parse(datosGuardados);
    } else {
        inventario = JSON.parse(JSON.stringify(inventarioInicial));
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
    }
}

// ==========================================
// GESTIÓN DE INVENTARIO
// ==========================================

function cargarInventarioTabla() {
    const tbody = document.querySelector('#tabla-inventario tbody');
    tbody.innerHTML = '';

    // Crear filas para cada combinación de aroma y tipo
    Object.keys(inventario).forEach(aroma => {
        ['Case', 'Recarga'].forEach(tipo => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';

            const tipoClass = tipo === 'Case' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

            tr.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900">N°${aroma}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tipoClass}">
                        ${tipo}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <input type="number"
                           min="0"
                           value="${inventario[aroma][tipo]}"
                           data-aroma="${aroma}"
                           data-tipo="${tipo}"
                           class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onchange="actualizarInventarioTemporal(this)">
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function actualizarInventarioTemporal(input) {
    const aroma = input.dataset.aroma;
    const tipo = input.dataset.tipo;
    const valor = parseInt(input.value) || 0;
    inventario[aroma][tipo] = valor;
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

    // Construir array de aromas seleccionados
    const aromas = [];
    for (let i = 0; i < spin1; i++) aromas.push('1');
    for (let i = 0; i < spin2; i++) aromas.push('2');
    for (let i = 0; i < spin3; i++) aromas.push('3');
    for (let i = 0; i < spin4; i++) aromas.push('4');

    const total = aromas.length;

    // Validar según tipo de pack
    if (tipoPack === 'unitario-case' || tipoPack === 'unitario-recarga') {
        if (total !== 1) {
            alert('⚠️ La venta unitaria es de 1 solo producto');
            return;
        }
    } else if (tipoPack === 'bipack') {
        if (total !== 2) {
            alert('⚠️ Un Bipack debe tener exactamente 2 aromas');
            return;
        }
    } else if (tipoPack === 'tripack') {
        if (total !== 3) {
            alert('⚠️ Un Tripack debe tener exactamente 3 aromas');
            return;
        }
    }

    // Agregar pedido
    const pedido = {
        id: Date.now(),
        tipo: tipoPack,
        aromas: aromas
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

        // Formatear nombre del tipo
        let tipoNombre = '';
        switch(pedido.tipo) {
            case 'unitario-case': tipoNombre = 'Unitario - Case'; break;
            case 'unitario-recarga': tipoNombre = 'Unitario - Recarga'; break;
            case 'bipack': tipoNombre = 'Bipack'; break;
            case 'tripack': tipoNombre = 'Tripack'; break;
        }

        tr.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${tipoNombre}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${pedido.aromas.join(', ')}</td>
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

    // Simular el procesamiento para mostrar qué se necesita
    const stockSimulado = JSON.parse(JSON.stringify(inventario));
    let html = '<div class="space-y-3">';
    let hayProblemas = false;

    pedidosActuales.forEach((pedido, index) => {
        const resultado = simularPedido(pedido, stockSimulado);

        if (resultado.exito) {
            html += `<div class="text-sm text-green-700 bg-green-50 p-2 rounded">
                <b>Pedido ${index + 1}:</b> ${resultado.componentes.join(', ')}
            </div>`;

            // Aplicar descuentos al stock simulado
            resultado.descuentos.forEach(desc => {
                stockSimulado[desc.aroma][desc.tipo] -= 1;
            });
        } else {
            html += `<div class="text-sm text-red-700 bg-red-50 p-2 rounded">
                <b>Pedido ${index + 1}:</b> ❌ ${resultado.error}
            </div>`;
            hayProblemas = true;
        }
    });

    html += '</div>';

    if (hayProblemas) {
        html = '<p class="text-red-700 font-semibold mb-2">⚠️ Hay problemas con el stock:</p>' + html;
    } else {
        html = '<p class="text-green-700 font-semibold mb-2">✓ Todos los pedidos pueden procesarse:</p>' + html;
    }

    instruccionesDiv.innerHTML = html;
}

function simularPedido(pedido, stock) {
    const tipo = pedido.tipo;
    const aromas = pedido.aromas;
    const componentes = [];
    const descuentos = [];

    if (tipo === 'unitario-case') {
        const aroma = aromas[0];
        if (stock[aroma]['Case'] > 0) {
            componentes.push(`Case N°${aroma}`);
            descuentos.push({ aroma: aroma, tipo: 'Case' });
            return { exito: true, componentes, descuentos };
        } else {
            return { exito: false, error: `Sin stock de Case N°${aroma}` };
        }
    } else if (tipo === 'unitario-recarga') {
        const aroma = aromas[0];
        if (stock[aroma]['Recarga'] > 0) {
            componentes.push(`Recarga N°${aroma}`);
            descuentos.push({ aroma: aroma, tipo: 'Recarga' });
            return { exito: true, componentes, descuentos };
        } else {
            return { exito: false, error: `Sin stock de Recarga N°${aroma}` };
        }
    } else {
        // Bipack o Tripack
        // Seleccionar el aroma con más Cases disponibles
        let maxCases = -1;
        let aromaParaCase = null;

        const aromasUnicos = [...new Set(aromas)];
        aromasUnicos.forEach(aroma => {
            if (stock[aroma]['Case'] > maxCases) {
                maxCases = stock[aroma]['Case'];
                aromaParaCase = aroma;
            }
        });

        if (maxCases <= 0) {
            return { exito: false, error: 'Sin Cases disponibles' };
        }

        // Usar ese aroma como Case
        componentes.push(`Case N°${aromaParaCase}`);
        descuentos.push({ aroma: aromaParaCase, tipo: 'Case' });

        // Los demás aromas como Recargas
        const aromasParaRecarga = aromas.filter(a => a !== aromaParaCase);

        for (let aroma of aromasParaRecarga) {
            if (stock[aroma]['Recarga'] > 0) {
                componentes.push(`Recarga N°${aroma}`);
                descuentos.push({ aroma: aroma, tipo: 'Recarga' });
                // Descontar temporalmente para la simulación
                stock[aroma]['Recarga'] -= 1;
            } else {
                return { exito: false, error: `Sin stock de Recarga N°${aroma}` };
            }
        }

        // Restaurar el stock de recargas ya que esto es simulación
        aromasParaRecarga.forEach(aroma => {
            stock[aroma]['Recarga'] += 1;
        });

        return { exito: true, componentes, descuentos };
    }
}

function procesarPedidos() {
    if (pedidosActuales.length === 0) {
        alert('⚠️ No hay pedidos para procesar');
        return;
    }

    // Confirmar procesamiento
    if (!confirm('¿Está seguro de procesar estos pedidos y descontar del stock?')) {
        return;
    }

    // Copiar inventario para procesamiento
    const stockTrabajo = JSON.parse(JSON.stringify(inventario));
    const resultados = [];
    let hayErrores = false;

    // Procesar cada pedido
    pedidosActuales.forEach((pedido, index) => {
        const resultado = simularPedido(pedido, stockTrabajo);

        if (resultado.exito) {
            // Aplicar descuentos
            resultado.descuentos.forEach(desc => {
                stockTrabajo[desc.aroma][desc.tipo] -= 1;
            });
            resultados.push({ pedido: index + 1, exito: true, componentes: resultado.componentes });
        } else {
            hayErrores = true;
            resultados.push({ pedido: index + 1, exito: false, error: resultado.error });
        }
    });

    if (hayErrores) {
        alert('⚠️ No se pudo procesar. Hay problemas de stock. Revise las instrucciones.');
        return;
    }

    // Si todo salió bien, actualizar inventario real
    inventario = stockTrabajo;
    guardarDatos();

    // Generar reporte
    let reporte = '✅ Pedidos procesados exitosamente:\n\n';
    resultados.forEach(r => {
        reporte += `Pedido ${r.pedido}: ${r.componentes.join(', ')}\n`;
    });

    alert(reporte);

    // Limpiar pedidos
    pedidosActuales = [];
    cargarTablaPedidos();
    actualizarInstrucciones();
}

// ==========================================
// DISPONIBILIDAD SHOPIFY
// ==========================================

function calcularDisponibilidadShopify() {
    const tbody = document.querySelector('#tabla-shopify tbody');
    tbody.innerHTML = '';

    const resultados = [];

    // Generar todas las combinaciones posibles
    const aromas = ['1', '2', '3', '4'];

    // Bipacks: combinaciones con repetición de 2 aromas
    const combinacionesBipack = generarCombinacionesConRepeticion(aromas, 2);
    combinacionesBipack.forEach(combo => {
        const stock = calcularMaximoPacks(combo, inventario);
        resultados.push({
            tipo: 'Bipack',
            combo: combo,
            stock: stock
        });
    });

    // Tripacks: combinaciones con repetición de 3 aromas
    const combinacionesTripack = generarCombinacionesConRepeticion(aromas, 3);
    combinacionesTripack.forEach(combo => {
        const stock = calcularMaximoPacks(combo, inventario);
        resultados.push({
            tipo: 'Tripack',
            combo: combo,
            stock: stock
        });
    });

    // Ordenar por tipo y stock
    resultados.sort((a, b) => {
        if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo);
        return b.stock - a.stock;
    });

    // Mostrar en la tabla
    resultados.forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';

        const stockClass = r.stock === 0 ? 'bg-red-100 text-red-800' :
                          r.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800';

        tr.innerHTML = `
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${r.tipo}</td>
            <td class="px-6 py-4 text-sm text-gray-700">N°${r.combo.join(', N°')}</td>
            <td class="px-6 py-4 text-sm">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${stockClass}">
                    ${r.stock} packs
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function generarCombinacionesConRepeticion(arr, size) {
    const result = [];

    function backtrack(start, combo) {
        if (combo.length === size) {
            result.push([...combo]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            combo.push(arr[i]);
            backtrack(i, combo);
            combo.pop();
        }
    }

    backtrack(0, []);
    return result;
}

function calcularMaximoPacks(aromas, stockReal) {
    // Simular cuántos packs de esta combinación se pueden hacer
    const stockSimulado = JSON.parse(JSON.stringify(stockReal));
    let contador = 0;

    while (true) {
        // Encontrar el aroma con más Cases disponibles
        let maxCases = -1;
        let aromaParaCase = null;

        const aromasUnicos = [...new Set(aromas)];
        aromasUnicos.forEach(aroma => {
            if (stockSimulado[aroma]['Case'] > maxCases) {
                maxCases = stockSimulado[aroma]['Case'];
                aromaParaCase = aroma;
            }
        });

        if (maxCases <= 0) {
            break;
        }

        // Descontar el Case
        stockSimulado[aromaParaCase]['Case'] -= 1;

        // Intentar descontar las Recargas
        const aromasParaRecarga = aromas.filter(a => a !== aromaParaCase);
        let puedoHacerPack = true;

        for (let aroma of aromasParaRecarga) {
            if (stockSimulado[aroma]['Recarga'] > 0) {
                stockSimulado[aroma]['Recarga'] -= 1;
            } else {
                puedoHacerPack = false;
                break;
            }
        }

        if (puedoHacerPack) {
            contador++;
        } else {
            break;
        }
    }

    return contador;
}

function recalcularDisponibilidad() {
    cargarDatos(); // Recargar datos del localStorage
    calcularDisponibilidadShopify();
    alert('✅ Disponibilidad recalculada');
}

// ==========================================
// UTILIDADES
// ==========================================

// Función para exportar datos
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

// Función para importar datos
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

// Función para resetear inventario
function resetearInventario() {
    if (confirm('⚠️ ¿Está seguro? Esto eliminará todos los datos del inventario.')) {
        inventario = JSON.parse(JSON.stringify(inventarioInicial));
        guardarDatos();
        cargarInventarioTabla();
        alert('✅ Inventario reseteado');
    }
}
