document.addEventListener('DOMContentLoaded', () =>
{
    const teamSelect = document.getElementById("team-dropdown");
    const playerSelect = document.getElementById("player-dropdown");
    fetch("./teams.json")
        .then(response => response.json())

        .then(data => {
            data.forEach(teamObj => {
                const option = document.createElement("option");
                option.value = teamObj.team;
                option.textContent = teamObj.team;
                teamSelect.appendChild(option);
            });

            teamSelect.addEventListener("change", () => {
                const selectedTeam = teamSelect.value;

                playerSelect.innerHTML = '<option value="">Select Player</option>';

                const teamData = data.find(t => t.team === selectedTeam);

                if (teamData) {
                    teamData.players.forEach(player => {
                        const option = document.createElement("option");
                        option.value = player;
                        option.textContent = player;
                        playerSelect.appendChild(option);
                    });
                }
            });
        })
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.visible = false;
    resultsContainer.style.display = 'none';
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', search);
    const applyButton = document.getElementById('apply-button');
    applyButton.addEventListener('click', apply);

    function search() {
        const playerInput = document.getElementById('player-dropdown');
        const heroInput = document.getElementById('hero-dropdown');
        const mapInput = document.getElementById('map-dropdown');
        const teamInput = document.getElementById('team-dropdown');
        const statInput = document.getElementById('stat-dropdown');

        const filters = document.getElementById('filters');
        const resultsHeader = document.getElementById('results-header');
        const results = document.getElementById('results');
        results.textContent = "no data- tags are " + filters.textContent;
        filters.innerHTML = '';
        const existingAlert = resultsHeader.querySelector('.alert-text');
        if (existingAlert) {
            existingAlert.remove();
        }
        if (teamInput.value !== '') {
            addTag("Team: " + teamInput.value, filters);
        }
        if (playerInput.value !== '') {
            addTag("Player: " + playerInput.value, filters);
        }
        if (heroInput.value !== '') {
            addTag("Hero: " + heroInput.value, filters);
        }
        if (mapInput.value !== '') {
            addTag("Map: " + mapInput.value, filters);
        }
        if (statInput.value !== '') {
            addTag("Stat: " + statInput.value, filters);
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
                if (filters.children[i].textContent !== 'undefined') {
                    results.textContent += filters.children[i].textContent + ' ';

                }
            }
        }


    }



});


