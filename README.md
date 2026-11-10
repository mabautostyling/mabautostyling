# MAB Auto Styling — Sitio web completo

Sitio estático para **www.mabautostyling.com**. Incluye Linktree, página web bilingüe y calculadora de presupuestos sin servidor ni frameworks.

## Archivos

- `index.html` — Linktree original, ahora con accesos activos **MY WEBSITE** e **INSTANT QUOTE**.
- `website.html` — Página web EN/ES con portada Porsche, banner de marca, servicios, About y contacto.
- `calculator.html` — Calculadora bilingüe con precio estimado y envío por WhatsApp o SMS.
- `css/style.css`, `js/main.js` — Estilo y comportamiento del Linktree original.
- `css/website.css`, `js/site.js`, `js/website.js`, `js/calculator.js` — Web y calculadora.
- `assets/images/` — Logos y fotos proporcionadas por MAB, optimizadas en WebP.
- `assets/contact/MAB-Auto-Styling.vcf` — Contacto descargable con datos y logo.

## Cómo publicar en GitHub Pages

1. Crea un repositorio público en GitHub (por ejemplo, `mab-auto-styling`).
2. Extrae el ZIP y **sube el contenido de la carpeta**, con `index.html` en la raíz del repositorio; no subas una carpeta contenedora adicional.
3. En el repositorio abre **Settings → Pages**. En **Build and deployment**, configura **Deploy from a branch**, rama **main** y carpeta **/(root)**.
4. GitHub Pages generará una URL como `https://USUARIO.github.io/mab-auto-styling/` (sustituye `USUARIO` por tu usuario real). Los enlaces internos son relativos y funcionan en repositorios de proyecto.
5. Para conectar `www.mabautostyling.com`, comprueba primero que el dominio sea tuyo y configura un registro **CNAME** para `www` apuntando a `USUARIO.github.io` (sin protocolo, ruta ni nombre de repositorio). Después introduce `www.mabautostyling.com` en **Settings → Pages → Custom domain**; GitHub puede añadir un archivo `CNAME`. Activa **Enforce HTTPS** cuando el dominio y certificado estén listos. El sitio no queda conectado al dominio solo por haberlo escrito en el HTML.
6. Si tienes dominio raíz `mabautostyling.com`, la configuración de DNS/redirect del dominio raíz es independiente; opcionalmente configúralo según la documentación de GitHub Pages y tu proveedor de DNS.

**No se ha desplegado automáticamente ni se ha modificado tu GitHub o DNS.**

## Reglas comerciales implementadas

Servicios con precio base: Super Wash $79, Exterior Detail $99, Signature Detail $149, Deep Interior Detail $179.

Ajuste por vehículo: Sedan/Coupe $0; SUV/Crossover +$15 por servicio principal; Large SUV/Truck/Van +$30 por servicio principal.

Ajustes de condición: suciedad exterior +$25 si incluye exterior; interior extra con Deep Interior +$35; ambos +$60 si corresponde; condición severa muestra total **de referencia** y exige confirmación personalizada.

Adicionales (solo con servicio principal compatible): ozono $79; faros (par) $89; motor $59; clay bar $69; parabrisas $75; pelo de mascotas $39.

- **Solo Exterior Detail + Deep Interior Detail pueden combinarse** entre sí dentro de los servicios principales, para evitar duplicar trabajos incluidos en Super Wash y Signature Detail. Esta es una implementación conservadora de la regla aprobada de no duplicar cargos.
- Los adicionales se ocultan hasta que exista un servicio principal y según compatibilidad (ozono y pelo requieren un principal que incluya interior; clay bar, uno que incluya exterior; limpieza de motor, faros y parabrisas, cualquiera).
- Mínimo por visita $79, cubierto siempre por al menos un servicio principal. **Sin cobro móvil adicional**.
- Nombre, año, marca, modelo y ZIP requeridos para enviar el presupuesto (no se almacenan). Descripción de suciedad opcional.
- El presupuesto se envía preparado por WhatsApp o SMS; el usuario debe enviarlo manualmente. Abrir la app de SMS y prellenar el texto depende del dispositivo y navegador.
- Servicios Premium, Ultimate y especializados (corrección, coating, PPF, tint, wrap, decals) van a cotización personalizada sin precio inventado.
- Contact/Book Now solo pide servicio; el cliente explica el resto por WhatsApp/SMS. **No confirma automáticamente la cita**.

## Fotografía y derechos

Se usan fotografías enviadas por MAB (vehículos, banner y trabajo de la persona) y una foto del parabrisas editada a partir del material proporcionado. No se incluyen las imágenes de terceros pendientes de autorización de `Ceramic Coating.jfif`, `Clay Bar.jfif`, `Headlight Restoration.jpg` y `Ozone.jpg`, porque su licencia comercial no fue verificada.

## Verificaciones antes de publicar

- Revisar si los servicios, descripciones y fotografías finales reflejan exactamente lo que se ofrece.
- Probar WhatsApp, SMS, descarga VCF y menús en iPhone/Android reales; SMS prellenado no se comporta igual en todos los navegadores.
- Verificar que Facebook (`https://www.facebook.com/share/1FHX7uxnk7/?mibextid=wwXIfr`) abre la página correcta y que TikTok (`https://www.tiktok.com/@mabautostyling`) existe.
- Google Business Profile permanece deshabilitado en el Linktree, pendiente de URL.
- El año «© 2020» se conserva según aprobación del usuario.
- Revisar tarifas e impuestos aplicables antes de ofrecer presupuestos definitivos. Los importes se indican como estimados.

## Cambios futuros

Para editar precios y textos de servicios: `js/site.js` (arreglos `services` y `addons`). Para reglas: `js/calculator.js`. Para enlaces de redes y contacto: `index.html`, `website.html`, `calculator.html` y el `.vcf`.

## Pruebas realizadas

- Validación estática de referencias a rutas internas y compilación sintáctica de scripts JS.
- Se intentó ejecutar Chromium para verificación interactiva, pero el entorno bloqueó la navegación automatizada. La revisión funcional manual en navegador real queda pendiente.

## Actualización: Boat Detailing + opciones Premium/Ultimate

- Se incorporó **Boat Detailing** a `Services` y al selector de `Contact / Book Now`. Solo recibe **cotizaciones personalizadas**, sin precios automáticos; el alcance se confirma según dimensiones, estado y trabajo solicitado. En la calculadora hay un acceso directo a solicitarlo por WhatsApp.
- **Premium Detail** y **Ultimate Detail** aparecen ahora dentro de la calculadora como opciones de gama superior, seleccionables de forma excluyente. El resultado indica **Custom quote required** y prepara un mensaje bilingüe por WhatsApp o SMS con los datos del vehículo, sin inventar un precio.
- Para conseguir el efecto de referencia de precios altos buscado por MAB, **es necesario aprobar importes iniciales reales** para Premium y Ultimate. Hasta entonces, esta versión destaca esos servicios, pero no muestra cifras superiores.
- No se ha modificado el cálculo de los cuatro servicios con precio, los seis adicionales ni el mínimo de $79.


## Actualización: cinco servicios Marine & Boat Detailing

Estos cinco servicios **están disponibles solo por cotización**: Exterior Boat Wash, Interior Boat Detailing, Full Boat Detailing, Gelcoat Oxidation Removal & Polishing y Marine Ceramic Coating. En la sección Services aparecen por separado bajo **Boat Detailing**, y cada uno abre WhatsApp con el nombre del servicio seleccionado. También se incluyen en Contact / Book Now y en el selector marino de `calculator.html` (sin precio automático, sin pedir datos de automóvil). La página dispone de textos en inglés y español. No se añadió ninguna foto externa de embarcaciones.

El usuario debe confirmar tamaño, condición, ubicación y alcance del bote durante la conversación. Ningún importe o duración de trabajo marino se presenta como confirmado.


## Latest update
- Added Boat Detailing photo to Our Services.
- Added Premium Detail ($249) and Ultimate Detail ($399) to the services page and calculator.
- Marine services remain quote-only via WhatsApp.
