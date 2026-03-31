const yearEl = document.getElementById('year');
const projectGrid = document.getElementById('projectGrid');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const isLiveServerPreview = ['5500', '5501'].includes(window.location.port);
const apiBase = isLiveServerPreview ? 'http://localhost:3000' : '';

const fallbackProjects = [
  {
    title: 'Nebula Commerce',
    description: 'A premium e-commerce experience with cinematic transitions and a futuristic brand interface.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    accent: 'Aurora'
  },
  {
    title: 'Pulse Analytics',
    description: 'A sleek dashboard concept focused on elegant data storytelling and responsive UI motion.',
    tags: ['APIs', 'UX Motion', 'Charts'],
    accent: 'Quantum'
  },
  {
    title: 'Orbit Studio',
    description: 'A modern creator platform concept designed for speed, clarity, and immersive visuals.',
    tags: ['Express', 'Neon DB', 'UI Systems'],
    accent: 'Nova'
  }
];

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function renderProjects(projects) {
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="badge">${project.accent}</div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-list">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join('')}
          </div>
        </article>
      `
    )
    .join('');
}

async function loadProjects() {
  try {
    const response = await fetch(`${apiBase}/api/projects`);

    if (!response.ok) {
      throw new Error('API unavailable');
    }

    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    renderProjects(fallbackProjects);
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = Object.fromEntries(new FormData(contactForm).entries());
    formStatus.textContent = 'Transmitting your message...';
    formStatus.dataset.state = '';

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to submit the form.');
      }

      formStatus.textContent = data.message;
      formStatus.dataset.state = 'success';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = isLiveServerPreview
        ? 'Live Server preview is working. Run the Node app on localhost:3000 for Neon DB saving.'
        : error.message;
      formStatus.dataset.state = 'error';
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

loadProjects();