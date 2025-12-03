# Sistema de Gestión de Inventario Le Juste

Aplicación web moderna para la gestión de inventario y armado de pedidos, migrada desde Qt Designer/Python a una interfaz web con JavaScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Inventario**: Administra el stock de 4 aromas, cada uno con 2 tipos de componentes (Case y Recarga)
- **Armar Pedidos**: Crea pedidos con lógica inteligente de asignación de componentes
- **Disponibilidad Shopify**: Calcula todas las combinaciones posibles de packs y su disponibilidad
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- **Persistencia Local**: Los datos se guardan automáticamente en el navegador

## 📋 Estructura del Inventario

El sistema maneja **8 registros de inventario**:

- **4 Aromas**: N°1, N°2, N°3, N°4
- **2 Tipos por aroma**:
  - **Case** (Estuche): Componente principal con presentación completa
  - **Recarga**: Repuesto sin estuche

**Total**: 4 aromas × 2 tipos = 8 líneas de inventario

## 🎯 Tipos de Productos

### Productos Unitarios
- **Unitario - Case**: 1 Case de un aroma
- **Unitario - Recarga**: 1 Recarga de un aroma

### Packs Combinados
- **Bipack**: 1 Case + 1 Recarga (2 productos, pueden ser del mismo aroma o diferentes)
- **Tripack**: 1 Case + 2 Recargas (3 productos en total)

## 🧠 Lógica de Armado de Pedidos (Algoritmo Inteligente)

### Para Unitarios:
- Simple: Se descuenta 1 unidad del tipo y aroma seleccionado

### Para Bipacks y Tripacks:
El sistema usa un **algoritmo inteligente** para optimizar el uso del inventario:

1. **Selección del Case**:
   - De todos los aromas en el pedido, el sistema elige el aroma con **mayor stock de Cases disponibles**
   - Esto maximiza las futuras opciones de armado

2. **Asignación de Recargas**:
   - Los demás aromas del pedido se asignan como Recargas
   - Se verifica que haya stock suficiente de cada Recarga

3. **Ejemplo Práctico**:
   ```
   Pedido: Tripack con N°1, N°2, N°3

   Stock actual:
   - N°1: 10 Cases, 5 Recargas
   - N°2: 3 Cases, 8 Recargas
   - N°3: 7 Cases, 6 Recargas

   Decisión del sistema:
   ✓ Usa N°1 como Case (tiene más Cases disponibles: 10)
   ✓ Usa N°2 como Recarga
   ✓ Usa N°3 como Recarga

   Resultado: Case N°1 + Recarga N°2 + Recarga N°3
   ```

Este algoritmo **maximiza la vida útil del inventario** al preservar Cases cuando es posible.

## 📱 Cómo usar

### Opción 1: Abrir directamente (más simple)
Simplemente abre `index.html` en tu navegador. Funciona inmediatamente sin instalación.

### Opción 2: Servidor local (recomendado para desarrollo)

**Con Python:**
```bash
python -m http.server 8000
```

**Con Node.js:**
```bash
npm install -g http-server
http-server
```

Luego abre: `http://localhost:8000`

## 📊 Funcionalidades por Vista

### 1. Menú Principal
- Navegación a todas las secciones
- Diseño centrado con logo de la empresa

### 2. Gestión de Inventario

**Funcionalidad:**
- Visualiza y edita el stock de las 8 líneas de inventario (4 aromas × 2 tipos)
- Badges de color:
  - 🔵 Azul: Case
  - 🟢 Verde: Recarga

**Cómo usar:**
1. Ingresa a "Gestión de Inventario"
2. Modifica los valores de stock en los campos numéricos
3. Haz clic en "Guardar Cambios"
4. Los datos se persisten en el navegador

### 3. Armar Pedidos

**Funcionalidad:**
- Crea pedidos de diferentes tipos
- Validación automática de cantidades
- Vista previa de componentes antes de procesar
- Verificación de stock en tiempo real

**Cómo usar:**
1. Selecciona el tipo de pedido
2. Ingresa las cantidades de cada aroma:
   - Unitarios: 1 aroma en total
   - Bipack: 2 aromas en total
   - Tripack: 3 aromas en total
3. Haz clic en "Agregar a la lista"
4. Repite para agregar más pedidos
5. Revisa la sección "Instrucciones" que muestra:
   - ✅ Qué componentes se usarán (Case o Recarga de cada aroma)
   - ❌ Problemas de stock si los hay
6. Haz clic en "Procesar y Descontar Stock" para finalizar

**Validaciones:**
- Cantidad total debe coincidir con el tipo de pack
- No se procesa si falta stock de algún componente
- Los valores no pueden ser negativos

**Ejemplo de Instrucciones:**
```
✓ Todos los pedidos pueden procesarse:

Pedido 1: Case N°1, Recarga N°2
Pedido 2: Case N°3, Recarga N°1, Recarga N°4
```

### 4. Disponibilidad Shopify

**Funcionalidad:**
- Calcula **todas las combinaciones posibles** de aromas para cada tipo de pack
- Muestra cuántos packs de cada combinación se pueden armar
- Indicadores visuales por color:
  - 🔴 Rojo: Sin stock (0 packs)
  - 🟡 Amarillo: Stock bajo (1-4 packs)
  - 🟢 Verde: Stock bueno (5+ packs)

**Combinaciones mostradas:**
- **Bipacks**: 10 combinaciones posibles
  - Ejemplos: (N°1, N°1), (N°1, N°2), (N°1, N°3), ..., (N°4, N°4)
- **Tripacks**: 20 combinaciones posibles
  - Ejemplos: (N°1, N°1, N°1), (N°1, N°1, N°2), ..., (N°4, N°4, N°4)

**Total**: 30 líneas de disponibilidad

**Cómo usar:**
1. Ingresa a "Ver Disponibilidad Shopify"
2. La tabla muestra automáticamente todas las combinaciones
3. Haz clic en "Recalcular Disponibilidad" para actualizar después de procesar pedidos

## 💾 Almacenamiento de Datos

Los datos se guardan en el `localStorage` del navegador:

```javascript
Estructura de datos:
{
  "1": { "Case": 10, "Recarga": 15 },
  "2": { "Case": 8, "Recarga": 12 },
  "3": { "Case": 5, "Recarga": 20 },
  "4": { "Case": 12, "Recarga": 18 }
}
```

- **Persistencia**: Los datos permanecen después de cerrar el navegador
- **Por navegador**: Cada navegador mantiene sus propios datos
- **Limpieza**: Limpiar el caché eliminará los datos

### Resetear datos

**Desde la consola del navegador (F12):**
```javascript
localStorage.clear()
location.reload()
```

## 🎨 Personalización

### Logo
Coloca tu archivo de logo como `le-juste-with-subline-4-1.svg` o `.jpg` en la misma carpeta.

### Colores Tailwind
Los colores principales son:
- **Azul** (blue-600): Cases, Inventario
- **Verde** (green-600): Recargas, Armar Pedidos
- **Morado** (purple-600): Shopify
- **Rojo** (red-600): Errores, Eliminar

## 🔧 Estructura del Proyecto

```
inventory_manager/
├── index.html              # Interfaz con todas las vistas
├── app.js                  # Lógica de negocio completa
├── README.md              # Este archivo
├── INICIO_RAPIDO.md       # Guía de inicio
├── package.json           # Configuración del proyecto
├── .gitignore            # Archivos a ignorar
└── le-juste-with-subline-4-1.svg  # Logo
```

## 📐 Algoritmo de Disponibilidad Shopify

Para cada combinación de aromas:

1. **Identificar aromas únicos** en la combinación
2. **Seleccionar el aroma con más Cases** como componente principal
3. **Verificar stock de Recargas** para los demás aromas
4. **Simular descuentos** hasta que se agote algún componente
5. **Contar** cuántos packs se pudieron armar

**Ejemplo:**
```
Combinación: Bipack (N°1, N°2)

Stock:
- N°1: 5 Cases, 10 Recargas
- N°2: 8 Cases, 3 Recargas

Proceso:
1. N°2 tiene más Cases (8 > 5) → Se usará como Case
2. N°1 se usará como Recarga
3. Limitantes:
   - Cases N°2: 8 disponibles
   - Recargas N°1: 10 disponibles
4. Se pueden armar 8 Bipacks (limitado por Cases N°2)
```

## 🔄 Flujo de Trabajo Típico

### Configuración Inicial
```
1. Gestión de Inventario → Cargar stock inicial
2. Guardar cambios
```

### Procesamiento de Pedidos
```
1. Armar Pedidos → Seleccionar tipo
2. Ingresar aromas → Agregar a lista
3. Verificar instrucciones → Revisar componentes
4. Procesar → Stock se descuenta automáticamente
```

### Verificación para Shopify
```
1. Ver Disponibilidad Shopify
2. Revisar combinaciones disponibles
3. Identificar cuáles productos actualizar en tienda online
```

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que tu navegador permita localStorage
- Navegadores en modo privado no persisten datos

### Error al procesar pedidos
- Revisa la sección "Instrucciones" para ver el problema específico
- Verifica que haya stock suficiente de Cases y Recargas

### La tabla Shopify está vacía
- Asegúrate de tener stock en el inventario
- Haz clic en "Recalcular Disponibilidad"

## 🆚 Diferencias vs. Versión Qt/Python

### ✅ Ventajas de la versión web:
- No requiere instalación
- Funciona en cualquier dispositivo (móvil, tablet, desktop)
- Interfaz moderna y responsiva
- Sin dependencias de Python/Qt
- Actualización en tiempo real

### ⚠️ Consideraciones:
- Los datos son locales al navegador (no hay DB centralizada)
- Para compartir datos entre dispositivos, necesitarías implementar un backend
- La versión Python usaba MySQL, esta usa localStorage

### 🔄 Próximos pasos sugeridos:
- [ ] Conectar a base de datos MySQL (requiere backend)
- [ ] Implementar API REST con Node.js/Python
- [ ] Sistema de usuarios y autenticación
- [ ] Historial de pedidos procesados
- [ ] Exportar reportes a Excel
- [ ] Integración con API de Shopify

## 📝 Equivalencia de Archivos

| Qt/Python Original | Web JavaScript |
|-------------------|----------------|
| `menu_principal.ui` | Vista "menu-principal" en index.html |
| `gestion_inventario.ui` | Vista "gestion-inventario" en index.html |
| `armar_pedidos.ui` | Vista "armar-pedidos" en index.html |
| `calculo_shopify.ui` | Vista "calculo-shopify" en index.html |
| `main.py` | app.js (toda la lógica) |
| MySQL Database | localStorage (navegador) |

## 🗄️ Migración desde la Versión Python

Si vienes de la versión Python con MySQL, puedes migrar los datos:

1. Exporta desde MySQL:
```sql
SELECT id_aroma, nombre_tipo, cantidad
FROM tbl_inventario
JOIN tbl_aromas ON ...
```

2. Convierte al formato JSON:
```json
{
  "1": { "Case": 10, "Recarga": 15 },
  "2": { "Case": 8, "Recarga": 12 },
  "3": { "Case": 5, "Recarga": 20 },
  "4": { "Case": 12, "Recarga": 18 }
}
```

3. Carga en la aplicación web mediante la consola del navegador

## 📄 Licencia

Proyecto privado para Le Juste

## 👤 Autor

Desarrollado para Le Juste - Sistema de Gestión de Inventario
Migrado de Qt/Python a Web JavaScript con Tailwind CSS
