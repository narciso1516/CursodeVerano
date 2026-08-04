# Backend seguro para revisar oraciones manuscritas

La plataforma principal es:

`Plataforma_Oraciones_Guiadas_por_Grado.html`

El backend está en:

`api/revisar-oracion.js`

## Despliegue en Vercel

1. Importa el repositorio `narciso1516/CursodeVerano` en Vercel.
2. En **Project Settings → Environment Variables**, crea `OPENAI_API_KEY` y pega ahí la clave creada de forma segura.
3. Opcional: crea `OPENAI_MODEL`. Si no se define, el backend usa `gpt-4o`.
4. Despliega el proyecto.
5. Copia el dominio HTTPS asignado por Vercel, por ejemplo `https://mi-proyecto.vercel.app`.
6. En `Plataforma_Oraciones_Guiadas_por_Grado.html`, configura la constante del frontend para apuntar a:

   `https://mi-proyecto.vercel.app/api/revisar-oracion`

## Seguridad

- Nunca guardes `OPENAI_API_KEY` dentro del HTML.
- Nunca subas la clave al repositorio.
- El endpoint solo permite peticiones desde `https://narciso1516.github.io`.
- El código no persiste las fotografías en el repositorio.
- La fotografía se usa para solicitar la revisión y devolver retroalimentación al alumno.
