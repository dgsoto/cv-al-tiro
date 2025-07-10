document.addEventListener('DOMContentLoaded', function() {

    // --- Scroll Suave para Enlaces Internos ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Excluir enlaces de WhatsApp u otros que no sean IDs de sección
            if (this.getAttribute('href').length > 1 && this.getAttribute('href') !== '#') {
                 e.preventDefault(); // Previene el salto instantáneo

                const targetId = this.getAttribute('href').substring(1); // Obtiene el ID (sin el #)
                const targetElement = document.getElementById(targetId); // Busca el elemento por ID

                if (targetElement) {
                    // Desplaza la ventana suavemente hasta el elemento
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Opcional: Añadir el ID a la URL sin saltar (para compatibilidad o si el usuario lo comparte)
                    // window.history.pushState(null, null, `#${targetId}`);
                }
            }
        });
    });


    // --- Manejo de Formulario de Contacto (Usando Formspree) ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) { // Asegura que el formulario existe en la página
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previene la recarga de la página

            formStatus.textContent = 'Enviando mensaje...';
            formStatus.className = ''; // Limpia clases previas
            formStatus.style.color = '#555'; // Color neutro mientras envía

            const formData = new FormData(form); // Captura los datos del formulario
            const actionUrl = form.getAttribute('action'); // Obtiene la URL de Formspree

            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Indica a Formspree que esperamos JSON
                    }
                });

                if (response.ok) {
                    formStatus.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
                    formStatus.className = 'success'; // Clase para estilo de éxito
                    form.reset(); // Limpia el formulario
                } else {
                     // Si la respuesta no es OK, intenta leer el error de Formspree
                    const data = await response.json();
                    if (data.errors) {
                         formStatus.textContent = 'Error al enviar el mensaje. Por favor, intenta de nuevo o contacta por WhatsApp. (Error: ' + data.errors.map(error => error.message).join(', ') + ')';
                    } else {
                         formStatus.textContent = 'Error al enviar el mensaje. Por favor, intenta de nuevo o contacta por WhatsApp.';
                    }
                    formStatus.className = 'error'; // Clase para estilo de error
                }
            } catch (error) {
                // Manejo de errores de red (ej: sin conexión)
                console.error('Error de red:', error);
                formStatus.textContent = 'Hubo un problema de conexión. Por favor, verifica tu internet o contacta por WhatsApp.';
                formStatus.className = 'error'; // Clase para estilo de error
            }

            // Limpiar mensaje de estado después de unos segundos (opcional)
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = '';
            }, 10000); // Limpiar después de 10 segundos

        });
    }
});