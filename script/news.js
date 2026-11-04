function loadNews(limit) {
    const newsList = document.getElementById('newsList');
    const newsStatus = document.getElementById('newsStatus');
    if (!newsList) return;

    fetch('./content/news.json')
        .then(response => {
            if (!response.ok) throw new Error('Unable to load news');
            return response.json();
        })
        .then(json => {
            const news = [...json.news].sort((a, b) => b.date.localeCompare(a.date));
            const shown = typeof limit === 'number' ? news.slice(0, limit) : news;
            const dateOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };

            newsList.replaceChildren();
            shown.forEach(item => {
                const row = document.createElement('tr');
                const dateCell = document.createElement('td');
                const newsCell = document.createElement('td');

                const date = new Date(item.date + 'T12:00:00Z');
                dateCell.className = 'date';
                dateCell.textContent = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
                newsCell.className = 'newsLabel';
                // Entries in the repository are trusted HTML, including links and emphasis.
                newsCell.innerHTML = item.en;

                row.append(dateCell, newsCell);
                newsList.appendChild(row);
            });
            if (newsStatus) newsStatus.textContent = shown.length ? '' : 'No news available.';
        })
        .catch(error => {
            console.error(error);
            if (newsStatus) newsStatus.textContent = 'News are temporarily unavailable.';
        });
}
