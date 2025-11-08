#ifndef BACKEND_H
#define BACKEND_H
#include <string>
#include <vector>
using namespace std;

class owlDataClass {
public:
    string matchDate;
    int matchId;
    string mapName;
    string playerName;
    string teamName;
    string heroName;
    string statName;
    double statValue;
    owlDataClass();
};

vector<owlDataClass> readData(const string& file);
vector<vector<owlDataClass>> readMultipleCSVs(const vector<string>& files);
vector<owlDataClass> filterData(const vector<owlDataClass>& data, const string& stat, const string& player, const string& map, const string& team, const string& hero); // filter by a specific stat
void sortData(vector<owlDataClass>& data, bool usingMergeSort); // call one of the sorts on the data
// For JS processing:
vector<owlDataClass> getProcessedData(string filePath, string team, string player, string hero, string map, string stat, bool useMergeSort);
// Merge sort
void mergeSort(vector<owlDataClass>& arr, int left, int right);
void merge(vector<owlDataClass>& arr, int left, int mid, int right);
// Quick sort
void quickSort(vector<owlDataClass>& arr, int low, int high);
int partition(vector<owlDataClass>& arr, int low, int high);

#endif //BACKEND_H
