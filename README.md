# Sistema de Gestión de Inventario Le Juste

Aplicación web moderna para la gestión de inventario y armado de pedidos, migrada desde Qt Designer a una interfaz web con JavaScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Inventario**: Administra el stock de 4 aromas diferentes
- **Armar Pedidos**: Crea pedidos personalizados con diferentes tipos de packs
- **Disponibilidad Shopify**: Calcula automáticamente la disponibilidad máxima para cada tipo de pack
- **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- **Persistencia Local**: Los datos se guardan automáticamente en el navegador

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias
- Funciona completamente offline después de la primera carga

## 🎯 Cómo usar

### Opción 1: Abrir directamente

1. Simplemente abre el archivo `index.html` en tu navegador
2. La aplicación funcionará inmediatamente

### Opción 2: Servidor local (recomendado para desarrollo)

Si tienes Python instalado:

```bash
# Python 3
python -m http.server 8000

# O Python 2
python -m SimpleHTTPServer 8000
```

Luego abre tu navegador en: `http://localhost:8000`

Si tienes Node.js instalado:

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server
```

## 📱 Funcionalidades por Vista

### Menú Principal
- Navegación a todas las secciones del sistema
- Diseño centrado con logo de la empresa
- Botones de acceso rápido

### Gestión de Inventario
- **Ver stock actual**: Visualiza las cantidades disponibles de cada aroma
- **Editar stock**: Modifica las cantidades directamente en la tabla
- **Guardar cambios**: Persiste los cambios en el navegador

**Cómo usar:**
1. Ingresa a "Gestión de Inventario"
2. Modifica los valores de stock en los campos numéricos
3. Haz clic en "Guardar Cambios"
4. Los datos se guardan automáticamente en el navegador

### Armar Pedidos
- **Crear pedidos**: Selecciona el tipo de pack y la cantidad de cada aroma
- **Validación automática**: Verifica que la suma coincida con el tipo de pack
- **Lista de pedidos**: Visualiza todos los pedidos antes de procesarlos
- **Verificación de stock**: Muestra si hay suficiente inventario

**Cómo usar:**
1. Selecciona el tipo de pedido (Pack de 4, 6 u 8)
2. Ingresa las cantidades de cada aroma (N°1, N°2, N°3, N°4)
3. La suma debe coincidir con el número del pack
4. Haz clic en "Agregar a la lista"
5. Repite para agregar más pedidos
6. Revisa las instrucciones (muestra si hay stock suficiente)
7. Haz clic en "Procesar y Descontar Stock" para finalizar

**Validaciones:**
- La suma de aromas debe coincidir con el tipo de pack
- No se permite procesar si no hay stock suficiente
- Los valores no pueden ser negativos

### Disponibilidad Shopify
- **Cálculo automático**: Muestra cuántos packs de cada tipo se pueden armar
- **Indicadores visuales**: Códigos de color según disponibilidad
  - 🟢 Verde: Más de 10 packs disponibles
  - 🟡 Amarillo: Entre 5 y 10 packs
  - 🔴 Rojo: Menos de 5 packs

**Cómo usar:**
1. Ingresa a "Ver Disponibilidad Shopify"
2. La tabla muestra automáticamente la disponibilidad
3. Haz clic en "Recalcular Disponibilidad" para actualizar

## 💾 Almacenamiento de Datos

Los datos se guardan en el `localStorage` del navegador:

- **Persistencia**: Los datos permanecen incluso después de cerrar el navegador
- **Por navegador**: Cada navegador mantiene sus propios datos
- **Limpieza**: Limpiar el caché del navegador eliminará los datos

### Resetear datos

Para volver a empezar con inventario en cero:

1. Abre la consola del navegador (F12)
2. Ejecuta: `localStorage.clear()`
3. Recarga la página

## 🎨 Personalización

### Colores

La aplicación usa Tailwind CSS. Los colores principales son:

- **Azul**: Inventario
- **Verde**: Armar Pedidos / Acciones positivas
- **Morado**: Shopify
- **Rojo**: Cerrar sesión / Eliminar
- **Gris**: Volver/Cancelar

### Logo

Coloca tu archivo de logo como `le-juste-with-subline-4-1.jpg` en la misma carpeta que `index.html`.

## 🔧 Estructura del Proyecto

```
inventory_manager/
├── index.html          # Interfaz principal con todas las vistas
├── app.js             # Lógica de la aplicación
├── README.md          # Este archivo
└── le-juste-with-subline-4-1.jpg  # Logo (opcional)
```

## 📊 Algoritmo de Disponibilidad Shopify

El cálculo de disponibilidad considera:

1. **Stock total**: Suma de todos los aromas
2. **Stock mínimo**: El aroma con menor cantidad
3. **Distribución equitativa**: Asume que cada pack necesita una proporción similar de cada aroma

La disponibilidad es el mínimo entre:
- Stock total ÷ unidades por pack
- (Stock mínimo × 4) ÷ unidades por pack

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que tu navegador permita localStorage
- Algunos navegadores en modo privado no persisten datos

### La página no carga correctamente
- Verifica que todos los archivos estén en la misma carpeta
- Abre la consola del navegador (F12) para ver errores

### El logo no aparece
- Verifica que el archivo de imagen esté en la misma carpeta
- Verifica que el nombre del archivo coincida exactamente

## 🚀 Próximas Mejoras Sugeridas

- [ ] Integración con API de Shopify
- [ ] Exportar/Importar datos a Excel
- [ ] Historial de pedidos procesados
- [ ] Gráficos de estadísticas
- [ ] Sistema de usuarios y autenticación
- [ ] Notificaciones de stock bajo
- [ ] Backup automático en la nube

## 📝 Notas de Migración desde Qt

Esta aplicación web replica la funcionalidad de las siguientes vistas Qt:

- `menu_principal.ui` → Vista principal
- `gestion_inventario.ui` → Gestión de Inventario
- `armar_pedidos.ui` → Armar Pedidos
- `calculo_shopify.ui` → Disponibilidad Shopify

### Diferencias principales:

✅ **Mejoras:**
- Interfaz responsiva (funciona en móviles y tablets)
- No requiere instalación
- Actualización en tiempo real
- Diseño moderno con Tailwind CSS

⚠️ **Consideraciones:**
- Los datos se guardan localmente en cada navegador
- No hay base de datos centralizada (puede agregarse)
- La imagen del logo debe agregarse manualmente

## 📄 Licencia

Proyecto privado para Le Juste

## 👤 Autor

Desarrollado para Le Juste - Sistema de Gestión de Inventario
