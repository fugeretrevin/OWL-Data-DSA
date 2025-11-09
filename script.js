let wasmReady = false;
let domReady = false;

Object.assign(Module, {
onRuntimeInitialized: function() {
        console.log("Files in /OWL-data:", Module.FS.readdir("/OWL-data"));

    console.log("Webassembly loaded correctly");
    wasmReady = true;
    if (domReady) {
        startup();
    }
},
postRun: function() {
    console.log("Files ready");
    
},
onAbort: function(reason) {
    console.error("WebAssembly runtime aborted:", reason);
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.textContent = "Error loading";
    }
}


});






document.addEventListener('DOMContentLoaded', () =>
{
    console.log("DOM loaded");
    domReady = true;
    if (wasmReady) {
    startup();

    }
});
function startup() {
    if (!wasmReady || !domReady) {
        return;
    }
    console.log("DOM and wasm ready, starting up");

    const teamSelect = document.getElementById("team-dropdown");
    const playerSelect = document.getElementById("player-dropdown");
    const mapSelect = document.getElementById("map-dropdown");
    const heroSelect = document.getElementById("hero-dropdown");
    if (!teamSelect || !playerSelect || !mapSelect || !heroSelect) {
        console.error("Fatal Error: Could not find one or more dropdown elements in the HTML.");
        return;
    }                 
    console.log("loading CSVS");
    
const cppFilePaths = new Module.VectorString();
[
 "/OWL-data/phs_2018_playoffs.csv",
  "/OWL-data/phs_2019_playoffs.csv",
  "/OWL-data/phs_2018_stage_1.csv",
  "/OWL-data/phs_2018_stage_2.csv",
  "/OWL-data/phs_2018_stage_3.csv",
  "/OWL-data/phs_2018_stage_4.csv",
  "/OWL-data/phs_2019_stage_1.csv",
  "/OWL-data/phs_2019_stage_2.csv",
  "/OWL-data/phs_2019_stage_3.csv",
  "/OWL-data/phs_2019_stage_4.csv"
].forEach(path => cppFilePaths.push_back(path));

Module.loadAllData(cppFilePaths);
cppFilePaths.delete();
console.log("CSVs loaded successfully");

    fetch("./teams.json")
        .then(response => {
            
            if (!response.ok) {
                throw new Error (`HTTP error, status: ${response.status}`);
            }
            return response.json();
        })

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
                    //const filePaths = ["/OWL-data/phs_2018_playoffs.csv", "/OWL-data/phs_2019_playoffs.csv", "/OWL-data/phs_2018_stage_1.csv", "/OWL-data/phs_2018_stage_2.csv", "/OWL-data/phs_2018_stage_3.csv", "/OWL-data/phs_2018_stage_4.csv", "/OWL-data/phs_2019_stage_1.csv", "/OWL-data/phs_2019_stage_2.csv", "/OWL-data/phs_2019_stage_3.csv", "/OWL-data/phs_2019_stage_4.csv"];

                    const sortAlgName = useMergeSort ? "Merge Sort" : "Quick Sort";
                    const startTime = performance.now();
                    
                   // const cppFilePaths = new Module.VectorString();
                    //filePaths.forEach(path => cppFilePaths.push_back(path));


                    const cppVector = Module.getProcessedData(teamInput.value, playerInput.value, heroInput.value, mapInput.value, statInput.value, useMergeSort);
                     //cppFilePaths.delete();
                    
                    const jsArray = [];
                    const vectorSize = cppVector.size();
                    if (vectorSize === 0) {
                        results.textContent = "No results found";
                        cppVector.delete();
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
                    const endTime = performance.now();
                    const timeInMs = (endTime - startTime).toFixed(2);
                    cppVector.delete();
                   

                    const topResults = jsArray.slice(0, 50);
                    results.innerHTML = "";
                    const head = document.createElement('h4');
                    head.classList.add('results-header');
                    head.textContent = `${jsArray.length} results found. Showing top ${topResults.length}`;
                    results.appendChild(head);
                   // results.:<pre>${JSON.stringify(topResults, null, 2)}</pre>


                   const timerText = document.createElement('p');
                   timerText.classList.add('timer-text');
                   timerText.textContent = `Search took ${timeInMs}ms using ${sortAlgName}`;
                   results.appendChild(timerText);

                    const list = document.createElement('div');
                    list.classList.add('results-list');
                    results.appendChild(list);

                    topResults.forEach(item => {
                        const listObj = document.createElement('div');
                        listObj.classList.add('result-item');
                        listObj.innerHTML = `
                        <div class = "result-stat">
                            <strong>${item.stat}:</strong> ${item.value}
                        </div>
                        <div class = "result-details">
                            <span><strong>Player:</strong> ${item.player}</span>
                             <span><strong>Team:</strong> ${item.team}</span>
                        </div>
                         <div class = "result-context">
                            <span><strong>Hero:</strong> ${item.hero}</span>
                             <span><strong>Map:</strong> ${item.map}</span>
                        </div>
                         <small class = "result-date">Date: ${item.date}</small>
                        `;
                        list.appendChild(listObj);
                    });
                        


                } catch (e) {
                    console.error(e);
                    results.textContent = "Error occurred";
                }
                }
            

        }


    }
}






