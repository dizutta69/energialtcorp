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
//  FORMULARIO DE CONTACTO (SOLUCIÓN NO-CORS)
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
    const scriptURL = "https://script.google.com/macros/s/AKfycbw0W9p_79UF4F1ep0pVr7Hvu7DLWCg-JyR05rnaCFlPMBfrumJelHFkw_k3X98LX2De/exec";
    
    // 🔥 SOLUCIÓN: Usar no-cors y FormData
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('message', data.message);

    // Con no-cors, la petición se envía pero no podemos leer la respuesta
    await fetch(scriptURL, {
      method: "POST",
      body: formData,
      mode: 'no-cors' // Esto evita el error CORS
    });

    // 🔥 ASUMIMOS ÉXITO (no podemos verificar la respuesta en no-cors)
    // Pero sabemos que el Google Apps Script funciona por la prueba interna
    alert("✅ Tu mensaje fue enviado correctamente. ¡Gracias por contactarnos!\n\nTe responderemos a: " + data.email);
    form.reset();

  } catch (err) {
    console.error("Error:", err);
    // En no-cors, raramente llegamos aquí a menos que falle la conexión
    alert("⚠️ No se pudo conectar. Por favor contáctanos directamente:\n\n📧 energialt.info@gmail.com\n📱 +57 350 696 0000 (WhatsApp)");
  } finally {
    // Restaurar botón después de un breve delay
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
}
