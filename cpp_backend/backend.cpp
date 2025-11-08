#include "backend.h"
#include <fstream>
#include <sstream>
#include <emscripten/bind.h>
using namespace std;


owlDataClass::owlDataClass() { // default constructor, values should be updated immediately when data is read and parsed
    matchDate = "", matchId = 0, mapName = "", playerName = "", teamName = "", heroName = "", statName = "", statValue = 0;
}


vector<owlDataClass> readData(const string& file) {
    vector<owlDataClass> data;
    ifstream ifs(file);
    string line;
    if(!ifs.is_open()) {
      return data;
    }
    getline(ifs, line); // reads first line to skip the header (just titles)
    while (getline(ifs, line)) { // reads next line
      if (line.empty()) {
        continue;
        }
        try {

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
        } catch (...) {
          continue;
        }
    }

    return data;
}

vector<owlDataClass> readMultipleCSVs(const vector<string>& files) {
    vector<owlDataClass> combinedData;
    for (const string& file : files) {
      vector<owlDataClass> dataFromOne = readData(file);
      combinedData.insert(combinedData.end(), dataFromOne.begin(), dataFromOne.end());
      }

    return combinedData;
}


vector<owlDataClass> filterData(const vector<owlDataClass>& data, const string& stat, const string& player, const string& map, const string& team, const string& hero) {
    // based on user input, returns a filtered vector based on the data vector e.g. containing only stats from a single player
    vector<owlDataClass> filteredData;
    for (auto item : data) {    // Could make this code shorter i.e. one big if (... && ... && ...)
        if (stat != "" && stat != "All Stats" && item.statName != stat ) {
            continue;
        }
        if (player != "" && item.playerName != player) {
            continue;
        }
        if (map != "" && item.mapName != map) {
            continue;
        }
        if (team != "" && item.teamName != team) {
            continue;
        }
        if (hero != "" && item.heroName != hero) {
            continue;
        }
        filteredData.push_back(item);
    }
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
vector<owlDataClass> getProcessedData(vector<string> filePaths, string team, string player, string hero, string map, string stat, bool useMergeSort) {
    vector<owlDataClass> allData = readMultipleCSVs(filePaths);
    if (allData.empty()) {
        return vector<owlDataClass>();
    }


    vector<owlDataClass> filtered = filterData(allData, stat, player, map, team, hero);


    sortData(filtered, useMergeSort);


    return filtered;
}


EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::class_<owlDataClass>("owlDataClass").constructor<>()
    .property("matchDate", &owlDataClass::matchDate)
    .property("matchId", &owlDataClass::matchId)
    .property("mapName", &owlDataClass::mapName)
    .property("playerName", &owlDataClass::playerName)
    .property("teamName", &owlDataClass::teamName)
    .property("heroName", &owlDataClass::heroName)
    .property("statName", &owlDataClass::statName)
    .property("statValue", &owlDataClass::statValue);


    emscripten::register_vector<owlDataClass>("VectorData");
    emscripten::register_vector<string>("VectorString");




  emscripten::function("getProcessedData", &getProcessedData);
}




// Merge sort (Josh) - mergeSort & merge based on class slides
void mergeSort(vector<owlDataClass>& arr, int left, int right) {
   if (left < right) {
       int mid = left + (right - left) / 2;
       // create subarrays and recursively sort/create more
       mergeSort(arr, left, mid);
       mergeSort(arr, mid + 1, right);
       // merge sorted subarrays
       merge(arr, left, mid, right);
   }
}


void merge(vector<owlDataClass>& arr, int left, int mid, int right) {
   // creating two subarrays from arr
   int n1 = mid - left + 1;
   int n2 = right - mid;
   vector<owlDataClass> X, Y;
   for (int i = 0; i < n1; ++i) {
       X.push_back(arr[left + i]);
   }
   for (int j = 0; j < n2; ++j) {
       Y.push_back(arr[mid + 1 + j]);
   }
   // merging the two subarrays back into arr but sorted
   int i = 0;
   int j = 0;
   int k = left;
   while ( i < n1 && j < n2) {
       if (X[i].statValue >= Y[j].statValue) {
           arr[k] = X[i];
           ++i;
       } else {
           arr[k] = Y[j];
           ++j;
       }
       ++k;
   }
   // if either X or Y is out of elements, append the remaining elements to arr
   while (i < n1) {
       arr[k] = X[i];
       ++i;
       ++k;
   }
   while (j < n2) {
       arr[k] = Y[j];
       ++j;
       ++k;
   }
}


// Quick sort (Andrew)
void quickSort(vector<owlDataClass>& arr, int low, int high) {
   if (low < high) {
     int pivot = partition(arr, low, high); // pivot index
     quickSort(arr, low, pivot - 1);
     quickSort(arr, pivot + 1, high);
   }
}


int partition(vector<owlDataClass>& arr, int low, int high) {
    auto pivot = arr[low];
    int up = low + 1;
    int down = high;
    while (up <= down){
        while (up <= high && arr[up].statValue > pivot.statValue){
            up++;
        }
        while (down > low && arr[down].statValue <= pivot.statValue){
            down--;
        }
        if (up < down){
            std::swap(arr[up], arr[down]);
        }
    }
    std::swap(arr[low], arr[down]);
    return down;


}



