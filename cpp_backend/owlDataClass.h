#ifndef OWLDATACLASS_H
#define OWLDATACLASS_H
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
    // maybe make a default > operator, we'll see what we need
    owlDataClass();
    // owlDataClass(string& date, int& id, string& map, string& player, string& team, string& hero, string& stat, double& statVal);
};

vector<owlDataClass> readData(const string& file);
vector<owlDataClass> filterData(const vector<owlDataClass>& data, const string& stat, const string& player, const string& map, const string& team, const string& hero); // filter by a specific stat
void sortData(vector<owlDataClass>& data, bool usingMergeSort); // call one of the sorts on the data
// Merge sort
void mergeSort(vector<owlDataClass>& arr, int left, int right);
void merge(vector<owlDataClass>& arr, int left, int mid, int right);
// Quick sort
void quickSort(vector<owlDataClass>& arr, int low, int high);
int partition(vector<owlDataClass>& arr, int low, int high);

#endif //OWLDATACLASS_H
