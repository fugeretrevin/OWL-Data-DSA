document.addEventListener('DOMContentLoaded', () =>
{

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.visible = false;
    resultsContainer.style.display = 'none';
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', search);
    const applyButton = document.getElementById('apply-button');
    applyButton.addEventListener('click', apply);

    function search() {
        const playerInput = document.getElementById('player');
        const heroInput = document.getElementById('hero');
        const mapInput = document.getElementById('map');
        const matchInput = document.getElementById('MatchTypeDropdown');
        const filters = document.getElementById('filters');
        const resultsHeader = document.getElementById('results-header');
        const results = document.getElementById('results');
        results.textContent = "no data- tags are " + filters.textContent;
        filters.innerHTML = '';
        const existingAlert = resultsHeader.querySelector('.alert-text');
        if (existingAlert) {
            existingAlert.remove();
        }
        if (playerInput.value !== '') {
            addTag(playerInput.value, filters);
        }
        if (heroInput.value !== '') {
            addTag(heroInput.value, filters);
        }
        if (mapInput.value !== '') {
            addTag(mapInput.value, filters);
        }
        if (matchInput.value !== '') {
            addTag(matchInput.value, filters);
        }




        resultsContainer.style.display = 'flex'

    }
    function addTag(value, container) {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.textContent = value;
        tag.addEventListener('click', () => {
            tag.remove();
            const alertText = document.createElement('h6');
            const resultsHeader = document.getElementById('results-header');
            if (resultsHeader.children.length < 2) {
                resultsHeader.appendChild(alertText);
                alertText.classList.add('alert-text');
                alertText.innerText = "Apply Filters to update";
            }


        });
        container.appendChild(tag);
    }
    function apply() {
        const results = document.getElementById('results');
        const resultsHeader = document.getElementById('results-header');
        const filters = document.getElementById('filters');


        const existingAlert = resultsHeader.querySelector('.alert-text');
        if (existingAlert) {
            existingAlert.remove();
        }
        if (filters.children.length < 1) {
            results.textContent = 'No tags are found';

        }
        else {
            results.textContent = 'Applied, tags are ';
            for (i in filters.children) {
                if (filters.children[i].textContent != 'undefined') {
                    results.textContent += filters.children[i].textContent + ' ';

                }
            }
        }


    }



});