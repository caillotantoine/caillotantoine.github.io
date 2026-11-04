function loadProjects() {
    const research = document.getElementById('researchProjects');
    const personal = document.getElementById('personalProjects');
    const status = document.getElementById('projectsStatus');
    if (!research || !personal) return;

    fetch('./content/projects.json')
        .then(response => {
            if (!response.ok) throw new Error('Unable to load projects');
            return response.json();
        })
        .then(data => {
            research.replaceChildren();
            personal.replaceChildren();

            data.projects.forEach(project => {
                const article = document.createElement('article');
                article.className = 'projectCard';

                const period = document.createElement('p');
                period.className = 'projectPeriod';
                period.textContent = project.period;

                const title = document.createElement('h3');
                title.textContent = project.title;

                const description = document.createElement('p');
                description.className = 'projectDescription';
                description.textContent = project.description;

                const tags = document.createElement('p');
                tags.className = 'projectTags';
                tags.textContent = project.tags.join(' · ');

                const links = document.createElement('div');
                links.className = 'projectLinks';
                project.links.forEach(link => {
                    const anchor = document.createElement('a');
                    anchor.href = link.url;
                    anchor.textContent = link.label;
                    if (/^https?:\/\//.test(link.url)) {
                        anchor.target = '_blank';
                        anchor.rel = 'noopener noreferrer';
                    }
                    links.appendChild(anchor);
                });

                article.append(period, title, description, tags, links);
                (project.category === 'personal' ? personal : research).appendChild(article);
            });

            if (status) status.textContent = '';
        })
        .catch(error => {
            console.error(error);
            if (status) status.textContent = 'Projects are temporarily unavailable.';
        });
}
