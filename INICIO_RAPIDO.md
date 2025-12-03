# 🚀 Inicio Rápido - Le Juste Inventory Manager

## Pasos para comenzar a usar la aplicación

### 1. Abrir la aplicación

**Opción más simple:**
- Haz doble clic en `index.html`
- Se abrirá en tu navegador predeterminado
- ¡Listo! Ya puedes usar la aplicación

### 2. Configurar el inventario inicial

El sistema maneja **8 líneas de inventario**:
- 4 Aromas (N°1, N°2, N°3, N°4)
- 2 Tipos por aroma (Case y Recarga)

**Pasos:**
1. Haz clic en "Gestión de Inventario"
2. Ingresa las cantidades para cada combinación:
   ```
   N°1 Case:    ___
   N°1 Recarga: ___
   N°2 Case:    ___
   N°2 Recarga: ___
   N°3 Case:    ___
   N°3 Recarga: ___
   N°4 Case:    ___
   N°4 Recarga: ___
   ```
3. Haz clic en "Guardar Cambios"

### 3. Crear tu primer pedido

**Ejemplo: Bipack (1 Case + 1 Recarga)**

1. Vuelve al menú principal
2. Haz clic en "Armar Pedidos"
3. Selecciona "Bipack (1 Case + 1 Recarga)"
4. Ingresa cantidades de aromas:
   ```
   N°1: 1
   N°2: 1
   N°3: 0
   N°4: 0
   Total: 2 ✓
   ```
5. Haz clic en "Agregar a la lista"

**Ejemplo: Tripack (1 Case + 2 Recargas)**

1. Selecciona "Tripack (1 Case + 2 Recargas)"
2. Ingresa cantidades:
   ```
   N°1: 1
   N°2: 1
   N°3: 1
   N°4: 0
   Total: 3 ✓
   ```
3. Haz clic en "Agregar a la lista"

### 4. Procesar pedidos

1. Revisa la sección **"Instrucciones para armar cada pedido"**
   - Verás qué componente (Case o Recarga) se usará de cada aroma
   - El sistema elige automáticamente el aroma con más Cases disponibles

   **Ejemplo de instrucciones:**
   ```
   ✓ Todos los pedidos pueden procesarse:

   Pedido 1: Case N°2, Recarga N°1
   Pedido 2: Case N°3, Recarga N°1, Recarga N°2
   ```

2. Si todo está bien (marcas ✓ verdes), haz clic en **"Procesar y Descontar Stock"**
3. Los componentes se descontarán automáticamente del inventario

### 5. Verificar disponibilidad Shopify

1. Vuelve al menú principal
2. Haz clic en "Ver Disponibilidad Shopify"
3. Verás **todas las combinaciones posibles** con su stock disponible:
   - 🟢 Verde: Stock bueno (5+ packs)
   - 🟡 Amarillo: Stock bajo (1-4 packs)
   - 🔴 Rojo: Sin stock (0 packs)

## 🧠 Lógica Inteligente del Sistema

El sistema optimiza automáticamente el uso del inventario:

### Para Bipacks y Tripacks:
- **Selecciona el aroma con más Cases disponibles** como Case
- Los demás aromas se usan como Recargas
- Esto maximiza las opciones futuras de armado

**Ejemplo práctico:**
```
Stock actual:
N°1: 10 Cases, 5 Recargas
N°2: 3 Cases, 8 Recargas
N°3: 7 Cases, 6 Recargas

Pedido: Tripack con N°1, N°2, N°3

Decisión automática:
✓ Case N°1 (tiene más Cases: 10)
✓ Recarga N°2
✓ Recarga N°3
```

## 💡 Consejos

### Gestión de Inventario
- Los datos se guardan automáticamente en tu navegador
- No necesitas conexión a Internet después de la primera carga
- Puedes editar el stock en cualquier momento

### Armar Pedidos
- Agrega varios pedidos antes de procesar
- Revisa siempre la sección "Instrucciones" antes de procesar
- Si hay problemas de stock, verás mensajes ❌ en rojo

### Disponibilidad Shopify
- Muestra 30 combinaciones: 10 Bipacks + 20 Tripacks
- Haz clic en "Recalcular" después de procesar pedidos
- Útil para actualizar tu tienda online

## ⚠️ Importante

### Validaciones automáticas:
- **Unitarios**: Debes seleccionar exactamente 1 aroma
- **Bipack**: Debes seleccionar exactamente 2 aromas (pueden ser del mismo tipo)
- **Tripack**: Debes seleccionar exactamente 3 aromas

### Tipos de componentes:
- **Case** 🔵: Estuche completo (cada pack necesita 1 Case)
- **Recarga** 🟢: Repuesto (Bipack necesita 1, Tripack necesita 2)

### Stock insuficiente:
Si intentas procesar pedidos sin stock suficiente:
1. Verás un mensaje de error en "Instrucciones"
2. El botón de procesar no hará cambios
3. Debes aumentar el stock o eliminar pedidos

## 🔄 Flujo Completo de Ejemplo

```
1. INVENTARIO INICIAL
   N°1 Case: 10, N°1 Recarga: 15
   N°2 Case: 8,  N°2 Recarga: 12
   N°3 Case: 5,  N°3 Recarga: 20
   N°4 Case: 12, N°4 Recarga: 18

2. CREAR PEDIDOS
   Pedido 1: Bipack (N°1, N°2)
   Pedido 2: Tripack (N°1, N°3, N°4)

3. INSTRUCCIONES GENERADAS
   Pedido 1: Case N°2, Recarga N°1
   Pedido 2: Case N°4, Recarga N°1, Recarga N°3

4. PROCESAR
   ✓ Pedidos procesados exitosamente

5. INVENTARIO DESPUÉS
   N°1 Case: 10, N°1 Recarga: 13 (-2)
   N°2 Case: 7,  N°2 Recarga: 12 (-1 Case)
   N°3 Case: 5,  N°3 Recarga: 19 (-1)
   N°4 Case: 11, N°4 Recarga: 18 (-1 Case)

6. VERIFICAR SHOPIFY
   Ver disponibilidad actualizada de todas las combinaciones
```

## 🆘 ¿Necesitas ayuda?

- Consulta el archivo `README.md` para documentación completa
- Incluye explicación detallada del algoritmo inteligente
- Ejemplos de todas las funcionalidades

## 🔧 Resetear la Aplicación

Si quieres empezar de cero:

1. Abre la consola del navegador (F12)
2. Escribe: `localStorage.clear()`
3. Recarga la página
4. El inventario volverá a 0 en todas las líneas

## 📊 Datos Clave

- **8 líneas de inventario** (4 aromas × 2 tipos)
- **4 tipos de productos** (2 unitarios + 2 packs)
- **30 combinaciones Shopify** (10 Bipacks + 20 Tripacks)
- **Algoritmo inteligente** de selección de componentes

¡Ya estás listo para usar el sistema! 🎉
