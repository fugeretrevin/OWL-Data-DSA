let Module;
createModule().then(mod => Module = mod);


document.addEventListener('DOMContentLoaded', () =>
{
    const teamSelect = document.getElementById("team-dropdown");
    const playerSelect = document.getElementById("player-dropdown");
    const mapSelect = document.getElementById("map-dropdown");
    const heroSelect = document.getElementById("hero-dropdown");


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
    fetch("./maps.json")
        .then(response => response.json())

        .then(data => {
            data.forEach(mapObj => {
                const option = document.createElement("option");
                option.value = mapObj;
                option.textContent = mapObj;
                mapSelect.appendChild(option);
            });


        })
    fetch("./heros.json")
        .then(response => response.json())

        .then(data => {
            data.forEach(heroObj => {
                const option = document.createElement("option");
                option.value = heroObj;
                option.textContent = heroObj;
                heroSelect.appendChild(option);
            });


        })



    const resultsContainer = document.getElementById('results-container');
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
        results.textContent = "Tags: " + filters.textContent;
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

        apply();



        resultsContainer.style.display = 'flex'

    }
    function addTag(value, container) {
        const playerInput = document.getElementById('player-dropdown');
        const heroInput = document.getElementById('hero-dropdown');
        const mapInput = document.getElementById('map-dropdown');
        const teamInput = document.getElementById('team-dropdown');
        const statInput = document.getElementById('stat-dropdown');

        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.textContent = value;
        tag.addEventListener('click', () => {
            tag.remove();
            const alertText = document.createElement('h6');
            const resultsHeader = document.getElementById('results-header');
            if (tag.textContent.startsWith("Team: ")) {
                teamInput.selectedIndex = 0;
            }
            if (tag.textContent.startsWith("Player: ")) {
                playerInput.selectedIndex = 0;
            }
            if (tag.textContent.startsWith("Map: ")) {
                mapInput.selectedIndex = 0;
            }
            if (tag.textContent.startsWith("Hero: ")) {
                heroInput.selectedIndex = 0;
            }
            if (tag.textContent.startsWith("Stat: ")) {
                statInput.selectedIndex = 0;
            }
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
        const playerInput = document.getElementById('player-dropdown');
        const heroInput = document.getElementById('hero-dropdown');
        const mapInput = document.getElementById('map-dropdown');
        const teamInput = document.getElementById('team-dropdown');
        const statInput = document.getElementById('stat-dropdown');
        const sortChoice = document.querySelector('input[name="sortAlg"]:checked').value;
        let useMergeSort = false;

        if (sortChoice === 'merge') {
            useMergeSort = true;
        }
        const existingAlert = resultsHeader.querySelector('.alert-text');
        if (existingAlert) {
            existingAlert.remove();
        }
        if (filters.children.length < 2) {
            results.textContent = 'Team and one other filter required.';

        }
        else {
            results.textContent = 'Applied, tags are ';
            let teamSelected = false;

            for (const tag of filters.children) {
                if (tag.textContent.trim() !== "") {
                    if (tag.textContent.startsWith("Team: ")) {
                        teamSelected = true;
                    }

                    results.textContent += tag.textContent + ' ';
                }
            }

            if (!teamSelected) {
                results.textContent = "Team and one other filter required.";
            }
            //Actually search

            if (Module) {
                try {
                    const filePath = "./OWL-data/phs_2018_playoffs.csv";
                    const cppVector = Module.getProcessedData(filePath, teamInput.value, playerInput.value, heroInput.value, mapInput.value, statInput.value, useMergeSort);
                    const jsArray = [];
                    const vectorSize = cppVector.size();
                    if (vectorSize === 0) {
                        results.textContent = "No results found";
                        return;
                    }
                    for (let i = 0; i < vectorSize; i++) {
                        const item = cppVector.get(i);
                        jsArray.push({
                            player: item.playerName,
                            team: item.teamName,
                            hero: item.heroName,
                            map: item.mapName,
                            stat: item.statName,
                            value: item.statValue,
                            date: item.matchDate
                        });

                    }

                    const topResults = jsArray.slice(0, 50);
                    results.textContent = `${jsArray.length} results found. Showing top ${topResults.length} results.:${JSON.stringify(topResults, null, 2)}`;
                    cppVector.delete();
                } catch (e) {
                    console.error(e);
                    results.textContent = "Error occurred";
                }
            }

        }


    }



});


