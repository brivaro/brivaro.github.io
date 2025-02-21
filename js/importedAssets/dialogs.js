// Biblioteca de diálogos para cada pointerId
export const dialogLibrary = {
    about: `
      <h2>About</h2>
      <details>
      <summary>😎 <strong>Who am I?</strong></summary>
      <p>A technology and science enthusiast who loves tackling challenges with his team and turning ideas into reality. With a background in Computer Engineering, I specialize in Data Engineering, Big Data, AI, Machine Learning, Networking, Security, and DevOps. Whether it's developing innovative solutions, optimizing systems, or exploring the universe of technology, I'm all about making a difference! 🚀</p>
      </details>
      <details>
        <summary>🧐 <strong>What do I do?</strong></summary>
        <p>From software development and automation to cloud computing and system optimization, I create efficient and scalable solutions. I also share my passion for tech and science through my YouTube channel, where I break down mind-blowing topics in an engaging way. 💡</p>
      </details>
      <details>
        <summary>💻 <strong>Beyond the screen?</strong></summary>
        <p>When I'm not coding, I'm on the tennis court (no broken rackets yet! 🎾) or leveling up my English at the Official School of Languages 💬</p>
      </details>
    `,
    projects: `
      <h2>Projects</h2>
      <details>
        <summary>🔍 <strong>Predictive Modeling</strong></summary>
        <p>Developed and trained Machine Learning models for time series forecasting, optimizing sales planning for consumables at HP.</p>
      </details>
      <details>
        <summary>📊 <strong>Sales Forecasting App</strong></summary>
        <p>Built a Python application integrating predictive models to enhance sales projections and decision-making at HP.</p>
      </details>
      <details>
        <summary>🎓 <strong>Internal Training at HP</strong></summary>
        <p>Created video tutorials to train employees in analytical tools like Power BI and ThoughtSpot, boosting autonomy in data analysis.</p>
      </details>
      <details>
        <summary>🛠️ <strong>Kubernetes Cluster with Ansible</strong></summary>
        <p>Automated the configuration and deployment of a Kubernetes cluster on AlmaLinux 9 using Ansible, with Calico, MetalLB, and Metrics Server.</p>
      </details>
      <details>
        <summary>🌦️ <strong>PlouTerreta - Weather App</strong></summary>
        <p>Developed a weather application for the Comunidad Valenciana, providing real-time forecasts, alerts, and climatological data visualization.</p>
      </details>
      <details>
        <summary>💬 <strong>Collaborative Chat CLI with NATS</strong></summary>
        <p>Created a simple command-line chat application in Go, using NATS for real-time messaging.</p>
      </details>
      <details>
        <summary>🚀 <strong>FaaS with Go</strong></summary>
        <p>Implemented a Functions-as-a-Service (FaaS) platform using Go, leveraging Docker containers, NATS for messaging, and APISIX for reverse proxy management.</p>
      </details>
      <details>
        <summary>📝 <strong>To-Do App with Go & Docker</strong></summary>
        <p>Developed a web-based to-do list application using Go (Gin framework), containerized with Docker and orchestrated with Docker Compose.</p>
      </details>
      <details>
        <summary>🖥️ <strong>C Compiler</strong></summary>
        <p>Designed and implemented a compiler for a simplified version of the C programming language.</p>
      </details>
      <details>
        <summary>🗺️ <strong>Kartomapp - Navigation Study App</strong></summary>
        <p>Developed an educational tool for ship navigation students, featuring interactive maps and test-based learning.</p>
      </details>
      <details>
        <summary>🧬 <strong>Genomic Data Analysis</strong></summary>
        <p>Analyzed genomic datasets at VRAIN using Apache NiFi to streamline data processing and extract insights from ClinVar.</p>
      </details>
      <details>
        <summary>🎥 <strong>Science Communication on YouTube</strong></summary>
        <p>Running a science and tech YouTube channel with 17K+ subscribers, exploring AI, space exploration, and cutting-edge innovations.</p>
      </details>
    `,
    experience: `
      <h2>Experience</h2>
      <details>
        <summary>💼 <strong>HP | Big Data & AI Engineer | Valencia, España</strong></summary>
        <p><strong>Jan. 2024 – Jul. 2024</strong></p>
        <ul>
          <li>Implemented and trained ML models for time series forecasting, optimizing sales planning.</li>
          <li>Developed a Python application to integrate predictive models, enhancing decision-making.</li>
          <li>Conducted data engineering and analysis using Python, Databricks, and SQL, improving Power BI visualizations.</li>
          <li>Created video tutorials for training in analytics tools like Power BI and ThoughtSpot.</li>
          <li>Fine-tuned LLMs using H2O Studio for internal tasks.</li>
        </ul>
      </details>
      <details>
        <summary>💼 <strong>NTT DATA | AI Engineer | Valencia, España</strong></summary>
        <p><strong>Sep. 2023 – Dec. 2023</strong></p>
        <ul>
          <li>Trained neural networks to classify Jira tickets, optimizing response times.</li>
          <li>Automated repetitive tasks with Azure AI Services (OCR, Whisper, OpenAI).</li>
          <li>Built applications with Microsoft PowerPlatform to enhance internal processes.</li>
        </ul>
      </details>
      <details>
        <summary>💼 <strong>VRAIN | Researcher | Valencia, España</strong></summary>
        <p><strong>Apr. 2023 – Jul. 2023</strong></p>
        <ul>
          <li>Integrated ClinVar genomic data for research analysis.</li>
          <li>Automated genetic data extraction with Apache NiFi and JOLT.</li>
        </ul>
      </details>
    `,
    contact: `
    <h2>Contact</h2>
    <ul style="margin: 0; padding-left: 5px; list-style-position: inside;">
        <li>📧 Email: <a href="mailto:brian.1613.bv@gmail.com">brian.1613.bv@gmail.com</a></li>
        <li>🔗 LinkedIn: <a href="https://www.linkedin.com/in/brian-valiente-rodenas/" target="_blank">brian-valiente-rodenas</a></li>
        <li>🐙 GitHub: <a href="https://github.com/brivaro" target="_blank">brivaro</a></li>
        <li>📰 Download CV: <a href="cv/CV BRIAN es.pdf" download>Here</a></li>
        <li>🎥 YouTube Channel: <a href="https://www.youtube.com/@mrryanoficial" target="_blank">Mr Ryan</a></li>
    </ul>
    `
};

export function showPointerDialog(pointerId) {
  // Evita abrir múltiples diálogos: si ya existe uno, no hace nada.
  if (document.getElementById("pointer-dialog")) {
    return;
  }
  // Evita abrir múltiples diálogos: si ya existe uno, no hace nada.
  if (document.getElementById("intro")) {
    return;
  }
  
  // Obtener el contenido del diálogo desde la biblioteca.
  const dialogContent = dialogLibrary[pointerId];
  if (!dialogContent) {
    console.warn("No se encontró diálogo para el pointerId:", pointerId);
    return;
  }
  
  // Crear el contenedor del diálogo.
  const dialog = document.createElement('div');
  dialog.id = "pointer-dialog";
  dialog.style.position = 'fixed';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.backgroundColor = '#fff';
  dialog.style.padding = '20px 40px'; // Vertical 20px, horizontal 40px
  dialog.style.borderRadius = '10px';
  dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  dialog.style.textAlign = 'justify';
  dialog.style.zIndex = '1000';
  dialog.style.width = (window.innerWidth / 2.5) + 'px';
  dialog.style.maxHeight = '80vh';
  dialog.style.overflowY = 'auto';
  dialog.style.fontFamily = 'Arial, sans-serif';
  dialog.style.fontSize = '16px';
  dialog.style.lineHeight = '1.5';
  dialog.style.boxSizing = 'border-box';
  
  // Insertar el contenido del diálogo.
  dialog.innerHTML = dialogContent;
  
  // Agregar un listener para actualizar el ancho al redimensionar.
  window.addEventListener("resize", () => {
    const dlg = document.getElementById("pointer-dialog");
    if (dlg) {
      dlg.style.width = (window.innerWidth / 2.5) + "px";
    }
  });
  
  // Crear un botón para cerrar el diálogo.
  const closeButton = document.createElement('button');
  closeButton.textContent = "YEAH!";
  closeButton.style.backgroundColor = "#a8e6cf";
  closeButton.style.border = "none";
  closeButton.style.padding = "10px 20px";
  closeButton.style.borderRadius = "5px";
  closeButton.style.cursor = "pointer";
  closeButton.style.marginTop = "20px";
  closeButton.addEventListener('click', () => {
    // Fade out antes de remover.
    dialog.style.transition = "opacity 0.5s ease";
    dialog.style.opacity = "0";
    dialog.addEventListener("transitionend", () => {
      dialog.remove();
    }, { once: true });
  });
  dialog.appendChild(closeButton);
  
  // Agregar el diálogo al documento.
  document.body.appendChild(dialog);
  
  // Aplicar fade in.
  dialog.style.transition = "opacity 0.5s ease";
  dialog.style.opacity = "0";
  requestAnimationFrame(() => {
    dialog.style.opacity = "1";
  });
  
  // --- TRANSICIÓN SUAVE ENTRE <details> ---
  // Buscar todos los elementos <details> dentro del diálogo.
  const detailsElements = dialog.querySelectorAll('details');
  detailsElements.forEach(detail => {
    // Obtener el <summary> dentro del <details>
    const summary = detail.querySelector('summary');
    if (!summary) return; // Si no hay summary, saltamos

    // Crear un contenedor para envolver todo lo que no sea el summary
    const wrapper = document.createElement('div');
    wrapper.classList.add('details-content-wrapper');
    wrapper.style.overflow = 'hidden';
    wrapper.style.height = '0px';
    wrapper.style.transition = 'height 0.5s ease';

    // Mover todos los nodos que no sean el summary al wrapper
    Array.from(detail.childNodes).forEach(node => {
      if (node !== summary) {
        wrapper.appendChild(node);
      }
    });
    // Agregar el wrapper al final del <details>
    detail.appendChild(wrapper);

    // Prevenir el comportamiento por defecto y manejar la apertura/cierre con animación.
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      // Si el detail no está abierto, cerrar los demás y abrir este.
      if (!detail.hasAttribute('open')) {
        detailsElements.forEach(other => {
          if (other !== detail && other.hasAttribute('open')) {
            closeDetail(other);
          }
        });
        openDetail(detail);
      } else {
        closeDetail(detail);
      }
    });
  });

  // Función para abrir un <details> con animación.
  function openDetail(detail) {
    detail.setAttribute('open', ''); // Marcar como abierto.
    const wrapper = detail.querySelector('.details-content-wrapper');
    // Se calcula la altura natural del contenido
    const targetHeight = wrapper.scrollHeight;
    wrapper.style.height = targetHeight + "px";
  }

  // Función para cerrar un <details> con animación.
  function closeDetail(detail) {
    const wrapper = detail.querySelector('.details-content-wrapper');
    wrapper.style.height = "0px";
    // Al finalizar la transición, quitar el atributo open.
    wrapper.addEventListener('transitionend', function handler() {
      detail.removeAttribute('open');
      wrapper.removeEventListener('transitionend', handler);
    });
  }
}