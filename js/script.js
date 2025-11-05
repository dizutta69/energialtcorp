// ======================================================
// ENERGIALT S.A.S. - Frontend Script
// Funciones: tema claro/oscuro, animaciones, y envío real del formulario de contacto
// ======================================================

document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const toggle = document.getElementById('toggle-theme');

  // === Tema claro / oscuro ===
  if (localStorage.getItem('theme') === 'dark') body.classList.add('dark');
  else body.classList.add('light');

  toggle.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      body.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  // === Animaciones en scroll ===
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll('.card, .section-title, .headline, .sust-text, .gallery img')
    .forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
});

// ======================================================
//  FORMULARIO DE CONTACTO (VERSIÓN CORREGIDA - SIN no-cors)
// ======================================================

async function handleContact(e) {
  e.preventDefault();
  const form = e.target;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  if (!data.name || !data.email || !data.message) {
    alert("⚠️ Por favor completa todos los campos antes de enviar.");
    return false;
  }

  // Mostrar loading
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Enviando...";
  submitBtn.disabled = true;

  try {
    // URL de Google Apps Script
    const scriptURL = "https://script.google.com/macros/s/AKfycbw0W9p_79UF4F1ep0pVr7Hvu7DLWCg-JyR05rnaCFlPMBfrumJelHFkw_k3X98LX2De/exec";
    
    // ENVIAR COMO JSON (sin mode: 'no-cors')
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    // ✅ AHORA SÍ PODEMOS LEER LA RESPUESTA
    const result = await response.json();

    if (result.ok) {
      alert("✅ Tu mensaje fue enviado correctamente. ¡Gracias por contactarnos!");
      form.reset();
    } else {
      alert("❌ Error: " + result.msg + "\n\nPor favor contáctanos directamente por WhatsApp.");
    }

  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    alert("⚠️ No se pudo conectar con el servidor. Error: " + err.message + "\n\nPor favor contáctanos directamente por WhatsApp o email.");
  } finally {
    // Restaurar botón
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}
