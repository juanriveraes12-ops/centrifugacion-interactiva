# Centrifugación — Sedimentación radial de partículas
## Compilación del contenido trabajado en el chat

## 1. Enunciado del ejercicio

Un equipo de centrifugación con radio interno de 3,52 mm, radio externo de 6,58 mm y altura de 185 mm se utiliza para clarificar tres suspensiones con diferentes viscosidades:

- μ₁ = 1820 cP
- μ₂ = 750 cP
- μ₃ = 425 cP

Las partículas dispersas presentan un diámetro de 8,85 × 10⁻² mm. Se suministran una densidad de 1256 kg/m³ y una densidad de la fase líquida de 968 kg/m³. El equipo gira a 12 900 rph.

Se solicita calcular:

- velocidad de flujo, en m³/s,
- velocidad de sedimentación, en m/s,
- tiempo de sedimentación, en s,
- análisis de los cambios observados.

---

## 2. Interpretación de datos

Para aplicar el modelo de sedimentación centrífuga se interpretó:

- ρₚ = 1256 kg/m³ como densidad de las partículas,
- ρₗ = 968 kg/m³ como densidad del líquido.

Entonces:

Δρ = ρₚ − ρₗ = 1256 − 968 = **288 kg/m³**

> Si 1256 kg/m³ corresponde realmente a la densidad global de la suspensión y no a la de la partícula, faltaría la densidad del sólido y el ejercicio debería recalcularse.

---

## 3. Conversión de unidades

### Radios

- r₁ = 3,52 mm = **3,52 × 10⁻³ m**
- r₂ = 6,58 mm = **6,58 × 10⁻³ m**

Radio medio:

rₘ = (r₁ + r₂)/2

rₘ = (3,52 + 6,58)/2 = **5,05 mm = 5,05 × 10⁻³ m**

### Altura

L = 185 mm = **0,185 m**

### Diámetro de partícula

dₚ = 8,85 × 10⁻² mm = 0,0885 mm = **8,85 × 10⁻⁵ m**

### Viscosidades

Como 1 cP = 10⁻³ Pa·s:

- μ₁ = 1820 cP = **1,820 Pa·s**
- μ₂ = 750 cP = **0,750 Pa·s**
- μ₃ = 425 cP = **0,425 Pa·s**

---

## 4. Velocidad de rotación

El dato se interpretó literalmente como:

N = 12 900 rph

En rev/s:

N = 12 900 / 3600 = **3,58333 rev/s**

Equivalente a:

**215 rpm**

Velocidad angular:

ω = 2πN

ω = 2π(3,58333)

**ω = 22,5147 rad/s**

y:

**ω² = 506,914 s⁻²**

### Observación importante

Si el dato correcto fuera 12 900 rpm en lugar de 12 900 rph:

- ω sería 60 veces mayor,
- ω² sería 3600 veces mayor,
- la velocidad de sedimentación sería 3600 veces mayor,
- el caudal sería 3600 veces mayor,
- el tiempo sería 3600 veces menor.

---

## 5. Modelo de sedimentación centrífuga

Para partículas esféricas en régimen de Stokes:

**uᵣ = dₚ²(ρₚ − ρₗ)ω²r / (18μ)**

Se definió:

**K = dₚ²(ρₚ − ρₗ)ω² / (18μ)**

Por tanto:

**uᵣ = Kr**

donde:

- uᵣ = velocidad radial de sedimentación, m/s
- dₚ = diámetro de partícula, m
- ρₚ = densidad de partícula, kg/m³
- ρₗ = densidad del líquido, kg/m³
- ω = velocidad angular, rad/s
- r = posición radial, m
- μ = viscosidad dinámica, Pa·s
- K = constante de sedimentación, s⁻¹

---

## 6. Tiempo de sedimentación

Como:

dr/dt = Kr

se obtiene:

dt = dr/(Kr)

Integrando desde un radio inicial rᵢ hasta el radio externo r₂:

**t = (1/K) ln(r₂/rᵢ)**

o:

**t = [18μ/(dₚ²Δρω²)] ln(r₂/rᵢ)**

---

## 7. Volumen útil del equipo

El volumen anular es:

V = πL(r₂² − r₁²)

Sustituyendo:

V = π(0,185)[(6,58 × 10⁻³)² − (3,52 × 10⁻³)²]

**V = 1,79624 × 10⁻⁵ m³**

Equivale aproximadamente a:

**17,962 mL**

---

## 8. Dos criterios de cálculo

### 8.1 Criterio conservador

La partícula inicia en r₁ y llega a r₂.

Entonces:

**t_cons = (1/K) ln(r₂/r₁)**

Con:

ln(r₂/r₁) = ln(6,58/3,52) = **0,625574**

El caudal se calcula como:

**Q_cons = V/t_cons**

Este criterio exige que la partícula recorra toda la capa líquida.

### 8.2 Criterio de diámetro de corte

La partícula inicia en el radio medio:

rₘ = (r₁+r₂)/2

Entonces:

**t_corte = (1/K) ln(r₂/rₘ)**

Con:

ln(r₂/rₘ) = ln(6,58/5,05) ≈ **0,26465**

El caudal es:

**Q_corte = V/t_corte**

Este criterio produce menor tiempo y mayor caudal admisible.

---

## 9. Velocidad local y velocidad media

La velocidad radial depende del radio:

uᵣ = Kr

Por tanto, no es constante.

### Velocidad local en el radio externo

**u(r₂) = Kr₂**

Es la velocidad máxima durante el recorrido.

### Velocidad media efectiva

**ū = (r₂ − rᵢ)/t**

Representa una velocidad promedio asociada al recorrido entre el radio inicial y el radio externo.

---

## 10. Revisión del caso μ₁ = 1820 cP

El usuario obtuvo aproximadamente:

- tiempo = 17 930,49 s
- velocidad = 2,29 × 10⁻⁷ m/s
- caudal = 2,3681 × 10⁻⁹ m³/s

La revisión mostró:

### Constante

**K₁ = 3,49035 × 10⁻⁵ s⁻¹**

### Tiempo conservador

t₁ = (1/K₁) ln(r₂/r₁)

**t₁ = 17 922,94 s**

El valor 17 930,49 s del usuario es prácticamente igual; la pequeña diferencia se atribuyó al redondeo.

### Velocidad local en r₂

u(r₂) = K₁r₂

**u(r₂) = 2,2967 × 10⁻⁷ m/s**

Coincide con el valor del usuario de aproximadamente 2,29 × 10⁻⁷ m/s.

### Velocidad media conservadora

ū = (r₂-r₁)/t

**ū ≈ 1,7073 × 10⁻⁷ m/s**

La diferencia se debe a que este valor es una velocidad media, mientras que 2,2967 × 10⁻⁷ m/s es la velocidad local en r₂.

### Caudal conservador

**Q₁,cons ≈ 1,0022 × 10⁻⁹ m³/s**

### Caudal con criterio de diámetro de corte

**Q₁,corte ≈ 2,3690 × 10⁻⁹ m³/s**

Este último coincide con el resultado del usuario de 2,3681 × 10⁻⁹ m³/s.

### Tiempo asociado al diámetro de corte

**t₁,corte ≈ 7582,23 s**

---

## 11. Resultados para μ₂ = 750 cP

μ₂ = **0,750 Pa·s**

### Constante

**K₂ = 8,46992 × 10⁻⁵ s⁻¹**

### Velocidad local en r₂

u(r₂) = K₂r₂

**u(r₂) = 5,5732 × 10⁻⁷ m/s**

### Criterio conservador

Tiempo:

**t₂,cons = 7385,83 s = 2,052 h**

Velocidad media:

**ū₂,cons = 4,1431 × 10⁻⁷ m/s**

Caudal:

**Q₂,cons = 2,4320 × 10⁻⁹ m³/s**

### Criterio de diámetro de corte

Tiempo:

**t₂,corte = 3124,54 s = 0,868 h**

Velocidad media:

**ū₂,corte = 4,8967 × 10⁻⁷ m/s**

Caudal:

**Q₂,corte = 5,7488 × 10⁻⁹ m³/s**

---

## 12. Resultados para μ₃ = 425 cP

μ₃ = **0,425 Pa·s**

### Constante

**K₃ = 1,49469 × 10⁻⁴ s⁻¹**

### Velocidad local en r₂

u(r₂) = K₃r₂

**u(r₂) = 9,8351 × 10⁻⁷ m/s**

### Criterio conservador

Tiempo:

**t₃,cons = 4185,30 s = 1,163 h**

Velocidad media:

**ū₃,cons = 7,3113 × 10⁻⁷ m/s**

Caudal:

**Q₃,cons = 4,2918 × 10⁻⁹ m³/s**

### Criterio de diámetro de corte

Tiempo:

**t₃,corte = 1770,58 s = 0,492 h**

Velocidad media:

**ū₃,corte = 8,6413 × 10⁻⁷ m/s**

Caudal:

**Q₃,corte = 1,0145 × 10⁻⁸ m³/s**

---

## 13. Tabla completa

| Viscosidad | Criterio | Tiempo (s) | Velocidad media (m/s) | Velocidad local en r₂ (m/s) | Caudal (m³/s) |
|---:|---|---:|---:|---:|---:|
| 1820 cP | Conservador | 17 922,94 | 1,7073 × 10⁻⁷ | 2,2967 × 10⁻⁷ | 1,0022 × 10⁻⁹ |
| 1820 cP | Diámetro de corte | 7582,23 | — | 2,2967 × 10⁻⁷ | 2,3690 × 10⁻⁹ |
| 750 cP | Conservador | 7385,83 | 4,1431 × 10⁻⁷ | 5,5732 × 10⁻⁷ | 2,4320 × 10⁻⁹ |
| 750 cP | Diámetro de corte | 3124,54 | 4,8967 × 10⁻⁷ | 5,5732 × 10⁻⁷ | 5,7488 × 10⁻⁹ |
| 425 cP | Conservador | 4185,30 | 7,3113 × 10⁻⁷ | 9,8351 × 10⁻⁷ | 4,2918 × 10⁻⁹ |
| 425 cP | Diámetro de corte | 1770,58 | 8,6413 × 10⁻⁷ | 9,8351 × 10⁻⁷ | 1,0145 × 10⁻⁸ |

---

## 14. Tendencias físicas

Manteniendo constantes las demás variables:

**u ∝ 1/μ**

**Q ∝ 1/μ**

**t ∝ μ**

Por tanto, cuando disminuye la viscosidad:

- disminuye la resistencia viscosa,
- aumenta la velocidad de sedimentación,
- disminuye el tiempo de sedimentación,
- aumenta el caudal admisible.

---

## 15. Comparaciones entre suspensiones

### Suspensión 1 vs suspensión 2

1820/750 ≈ **2,427**

Por tanto, aproximadamente:

- la velocidad aumenta 2,43 veces,
- el caudal aumenta 2,43 veces,
- el tiempo disminuye en la proporción inversa.

### Suspensión 1 vs suspensión 3

1820/425 ≈ **4,282**

Por tanto, aproximadamente:

- la velocidad aumenta 4,28 veces,
- el caudal aumenta 4,28 veces,
- el tiempo cae a aproximadamente el 23,4 % del valor de la suspensión 1.

---

## 16. Régimen de Stokes

Se verificó conceptualmente mediante:

Reₚ = ρₗuᵣdₚ/μ

Los valores resultan mucho menores que 1:

**Reₚ << 1**

Por tanto, la aplicación de la ley de Stokes es coherente para los datos empleados.

---

## 17. Interpretación del criterio de diámetro de corte

El criterio de diámetro de corte supone que la partícula crítica inicia en la mitad de la capa líquida:

rₘ = (r₁+r₂)/2

y alcanza la pared externa.

Esto produce:

- menor distancia efectiva,
- menor tiempo,
- mayor caudal admisible.

La velocidad local en r₂ no cambia entre ambos criterios para una misma viscosidad, porque depende de K y de r₂, no del radio de partida.

---

## 18. Recurso HTML interactivo creado

Se generó el archivo:

**centrifugacion_sedimentacion_interactiva.html**

Incluye:

- selección de las tres viscosidades,
- valor de viscosidad personalizado,
- comparación de ambos criterios,
- animación radial de una partícula,
- resolución paso a paso,
- gráfico de velocidad radial,
- comparación de caudales,
- tabla completa,
- escenario alternativo de 12 900 rpm frente a 12 900 rph,
- diseño adaptable a computador, tableta y celular,
- opción de imprimir o guardar como PDF,
- funcionamiento sin dependencias externas.

---

## 19. Recurso PowerPoint creado

Se generó también:

**centrifugacion_sedimentacion_interactiva_PPT.pptx**

como adaptación del contenido para uso docente en presentación.

---

## 20. Publicación del HTML en internet

Se discutieron tres opciones.

### Netlify

Recomendado para publicar rápidamente un único recurso.

Procedimiento:

1. Descargar el HTML.
2. Crear una carpeta.
3. Renombrar el archivo como `index.html`.
4. Colocarlo dentro de la carpeta.
5. Usar el despliegue manual de Netlify.
6. Arrastrar la carpeta.
7. Obtener una URL pública.
8. Compartirla con los estudiantes.

### GitHub Pages

Recomendado si se quiere construir una biblioteca de recursos del curso.

Posible estructura:

- Centrifugación
- Sedimentación
- Filtración
- Ciclones
- Tamizado
- Reducción de tamaño

### Cloudflare Pages

Otra alternativa válida para publicar contenido HTML estático.

---

## 21. Mejora pedagógica sugerida para el recurso web

Se propuso añadir:

- portada institucional,
- nombre de la asignatura,
- nombre del docente,
- instrucciones para estudiantes,
- navegación por secciones:
  - Datos
  - Desarrollo
  - Simulación
  - Análisis
- preguntas de reflexión,
- actividades de comprobación,
- interpretación física,
- comparación entre criterios.

---

## 22. Fuente principal utilizada

Durante la resolución se trabajó con los documentos suministrados por el docente, especialmente:

**McCabe, Smith y Harriott — Operaciones Unitarias en Ingeniería Química, 7.ª edición.**

También estaban disponibles otros textos sobre sedimentación, centrifugación, operaciones unitarias e ingeniería de alimentos.

---

## 23. Conclusiones generales

1. La viscosidad es la variable que distingue a las tres suspensiones.
2. Mayor viscosidad implica menor velocidad de sedimentación.
3. Mayor viscosidad implica mayor tiempo de sedimentación.
4. Mayor viscosidad implica menor caudal.
5. La velocidad radial aumenta con el radio: uᵣ = Kr.
6. El criterio conservador considera el recorrido completo r₁ → r₂.
7. El criterio de diámetro de corte considera el recorrido rₘ → r₂.
8. El criterio de diámetro de corte permite mayor caudal.
9. La velocidad local en r₂ es la misma para ambos criterios a una misma viscosidad.
10. El tiempo debe asociarse al radio inicial usado.
11. El dato 12 900 rph debe verificarse cuidadosamente porque equivale a 215 rpm.
12. Si el dato real fuera 12 900 rpm, los resultados cambiarían de manera muy importante.

---

## 24. Fórmulas de referencia

**Δρ = ρₚ − ρₗ**

**ω = 2πN**

**K = dₚ²Δρω²/(18μ)**

**uᵣ = Kr**

**t = (1/K) ln(r₂/rᵢ)**

**ū = (r₂-rᵢ)/t**

**V = πL(r₂²-r₁²)**

**Q = V/t**

---

## 25. Archivos generados durante el chat

- `centrifugacion_sedimentacion_interactiva.html`
- `centrifugacion_sedimentacion_interactiva_PPT.pptx`

---

## Fin de la compilación
