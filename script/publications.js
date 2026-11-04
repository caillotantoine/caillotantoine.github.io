const orcidId = '0000-0002-6843-7255';
const orcidBase = 'https://pub.orcid.org/v3.0/' + orcidId;

// Additional project-page links are maintained here, independently from ORCID.
const publicationProjects = {
    '10.1109/humanoids65713.2025.11203080': 'humanoids2025.html'
};

function orcidJSON(url) {
    return fetch(url, { headers: { Accept: 'application/json' } })
        .then(response => {
            if (!response.ok) throw new Error('ORCID request failed: ' + response.status);
            return response.json();
        });
}

function externalId(work, type) {
    const ids = work['external-ids']?.['external-id'] || [];
    return ids.find(item => item['external-id-type']?.toLowerCase() === type)?.['external-id-value'];
}

function appendPublication(target, work) {
    const list = document.getElementById(target);
    if (!list) return;

    const title = work.title?.title?.value || 'Untitled publication';
    const year = work['publication-date']?.year?.value || 'n.d.';
    const venue = work['journal-title']?.value || '';
    const authors = (work.contributors?.contributor || [])
        .map(item => item['credit-name']?.value)
        .filter(Boolean)
        .join(', ');
    const doi = externalId(work, 'doi');
    const paperUrl = doi ? 'https://doi.org/' + encodeURIComponent(doi) : work.url?.value;
    const projectUrl = doi ? publicationProjects[doi.toLowerCase()] : null;

    const item = document.createElement('li');
    item.className = 'publicationItem';

    const heading = document.createElement('h3');
    heading.textContent = title;

    const meta = document.createElement('p');
    meta.className = 'publicationMeta';
    meta.textContent = [authors, venue, year].filter(Boolean).join(' · ');

    const links = document.createElement('div');
    links.className = 'publicationLinks';
    if (projectUrl) {
        const projectLink = document.createElement('a');
        projectLink.href = projectUrl;
        projectLink.textContent = 'Project';
        links.appendChild(projectLink);
    }
    if (paperUrl) {
        const paperLink = document.createElement('a');
        paperLink.href = paperUrl;
        paperLink.textContent = 'Paper';
        paperLink.target = '_blank';
        paperLink.rel = 'noopener noreferrer';
        links.appendChild(paperLink);
    }

    item.append(heading, meta, links);
    list.appendChild(item);
}

function loadPublications() {
    const message = document.getElementById('publicationsStatus');
    orcidJSON(orcidBase + '/works')
        .then(data => {
            const summaries = (data.group || []).flatMap(group => group['work-summary'] || []);
            const applicable = summaries.filter(item =>
                ['journal-article', 'conference-paper', 'dissertation-thesis'].includes(item.type)
            );
            // Fetch details concurrently but render in a predictable publication-date order.
            return Promise.all(applicable.map(item =>
                orcidJSON(orcidBase + '/work/' + item['put-code'])
                    .catch(error => {
                        console.warn('Skipping an unavailable ORCID record', error);
                        return null;
                    })
            ));
        })
        .then(works => {
            const unique = new Map();
            works.filter(Boolean).forEach(work => {
                const doi = externalId(work, 'doi');
                const key = doi?.toLowerCase() || work.title?.title?.value || String(work['put-code']);
                if (!unique.has(key)) unique.set(key, work);
            });
            const sorted = [...unique.values()].sort((a, b) => {
                const date = work => {
                    const d = work['publication-date'];
                    return [d?.year?.value || '0000', d?.month?.value || '01', d?.day?.value || '01'].join('-');
                };
                return date(b).localeCompare(date(a));
            });

            for (const target of ['journal', 'conference', 'thesis']) {
                document.getElementById(target).replaceChildren();
            }
            const types = {
                'journal-article': 'journal',
                'conference-paper': 'conference',
                'dissertation-thesis': 'thesis'
            };
            sorted.forEach(work => appendPublication(types[work.type], work));
            if (message) message.textContent = sorted.length ? '' : 'No publications found. See my ORCID profile.';
        })
        .catch(error => {
            console.error(error);
            if (message) message.textContent = 'Publications could not be loaded. Please see my ORCID profile.';
        });

    orcidJSON(orcidBase + '/fundings')
        .then(data => {
            const list = document.getElementById('grant');
            list.replaceChildren();
            (data.group || []).forEach(group => {
                const funding = group['funding-summary']?.[0];
                if (!funding) return;
                const item = document.createElement('li');
                item.className = 'publicationItem';

                const title = document.createElement('h3');
                title.textContent = funding.title?.title?.value || 'Funding';
                const meta = document.createElement('p');
                meta.className = 'publicationMeta';
                meta.textContent = [funding.organization?.name, funding['start-date']?.year?.value]
                    .filter(Boolean).join(' · ');
                item.append(title, meta);
                list.appendChild(item);
            });
        })
        .catch(error => {
            console.error(error);
            const message = document.getElementById('fundingsStatus');
            if (message) message.textContent = 'Funding data is temporarily unavailable on ORCID.';
        });
}
