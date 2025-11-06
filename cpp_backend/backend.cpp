#include "owlDataClass.h"
#include <fstream>
#include <sstream>
#include <emscripten/bind.h>
using namespace std;

owlDataClass::owlDataClass() { // default constructor, values should be updated immediately when data is read and parsed
    matchDate = "", matchId = 0, mapName = "", playerName = "", teamName = "", heroName = "", statName = "", statValue = 0;
}

// idk if we need a non-default constructor since I'm updating the values in readData()
// owlDataClass::owlDataClass(string& date, int& id, string& map, string& player, string& team, string& hero, string& stat, double& statVal) {
//     matchDate = date, matchId = id, mapName = map, playerName = player, teamName = team, heroName = hero, statName = stat, statValue = statVal;
// }

//I wouldn't imagine so lol

vector<owlDataClass> readData(const string& file) {
    vector<owlDataClass> data;
    ifstream ifs(file);
    string line;
    getline(ifs, line); // reads first line to skip the header (just titles)
    while (getline(ifs, line)) { // reads next line
        stringstream ss(line);
        owlDataClass newData;
        string element;
        getline(ss, newData.matchDate, ' '); // date is formatted mm/dd/yyyy hh:mm, we want the day not the time so we read up to the space
        getline(ss, element, ','); // read to the next comma and skip it
        getline(ss, element, ',');
        newData.matchId = stoi(element); // read number into element then stoi()
        getline(ss, element, ','); // skip the stage/game type
        getline(ss, element, ','); // skip the map type
        getline(ss, newData.mapName, ',');
        getline(ss, newData.playerName, ',');
        getline(ss, newData.teamName, ',');
        getline(ss, newData.statName, ',');
        getline(ss, newData.heroName, ',');
        getline(ss, element, ',');
        newData.statValue = stod(element); // read number/decimal into element then stod()
        data.push_back(newData);
    }
    return data;
}

vector<owlDataClass> filterData(const vector<owlDataClass>& data, const string& stat, const string& player, const string& map, const string& team, const string& hero) {
    // based on user input, returns a filtered vector based on the data vector e.g. containing only stats from a single player
    // function arguments temporary, depends what we want to take as input on front end
    vector<owlDataClass> filteredData;
    // func definition
    return filteredData;
}

void sortData(vector<owlDataClass>& data, bool usingMergeSort) { // sorts data vector, passed in bool based on user input selected merge or quick sort
    if (data.empty()) return;
    if (usingMergeSort) {
        mergeSort(data, 0, static_cast<int>(data.size()) - 1);
    } else {
        quickSort(data, 0, static_cast<int>(data.size()) - 1);
    }
}



// For JavaScript processing
vector<owlDataClass> getProcessedData(string filePath, string team, string player, string hero, string map, string stat, bool useMergeSort) {
	vector<owlDataClass> allData = readData(filePath);
	if (allData.empty()) {
		return vector<owlDataClass>();
	}

	vector<owlDataClass> filtered = filterData(allData, stat, player, map, team, hero);

	sortData(filtered, useMergeSort);

	return filtered;
}

EMSCRIPTEN_BINDINGS(my_module) {
	emscripten::class_<owlDataClass>("owlDataClass").constructor<>()
	.property("matchData", &owlDataClass::matchDate)
	.property("matchId", &owlDataClass::matchId)
	.property("mapName", &owlDataClass::mapName)
	.property("playerName", &owlDataClass::playerName)
	.property("teamName", &owlDataClass::teamName)
	.property("heroName", &owlDataClass::heroName)
	.property("statName", &owlDataClass::statName)
	.property("statValue", &owlDataClass::statValue);

	emscripten::register_vector<owlDataClass>("VectorData");


  emscripten::function("getProcessedData", &getProcessedData);
}



// Merge sort
void mergeSort(vector<owlDataClass>& arr, int left, int right) {}

void merge(vector<owlDataClass>& arr, int left, int mid, int right) {}

// Quick sort (Andrew)
void quickSort(vector<owlDataClass>& arr, int low, int high) {
    if (low < high) {
      int pivot = partition(arr, low, high);
      quickSort(arr, low, pivot - 1);
      quickSort(arr, pivot + 1, high);
    }
}

int partition(vector<owlDataClass>& arr, int low, int high) {
    int pivot = arr[low];
    int up = low;
    int down = high;
    while (up < down) {
      for (int j = up; j < high; j++) {
        if(array[up].statValue > pivot) {
          break;
        }
        up++;
    }
    for (int j = high; j > low; j--) {
      if (array[down].statValue < pivot) {
        break;
      }
      down--;
    }
    if (up < down) {
      swap(&arr[up], &arr[down]);
    }
    swap(&arr[low], &arr[high]);
    return down;
}



