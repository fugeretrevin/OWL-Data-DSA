import pandas as pd
import numpy as np
import json

# overall purpose to manipulate data in csvs to gather unique teams and players for dropdown menus


df1 = pd.read_csv('./OWL-data/phs_2018_playoffs.csv', encoding='latin1')
df2 = pd.read_csv('./OWL-data/phs_2019_playoffs.csv', encoding='latin1')
df3 = pd.read_csv('./OWL-data/phs_2018_stage_1.csv', encoding='latin1')
df4 = pd.read_csv('./OWL-data/phs_2018_stage_2.csv', encoding='latin1')
df5 = pd.read_csv('./OWL-data/phs_2018_stage_3.csv', encoding='latin1')
df6 = pd.read_csv('./OWL-data/phs_2018_stage_4.csv', encoding='latin1')
df7 = pd.read_csv('./OWL-data/phs_2019_stage_1.csv', encoding='latin1')
df8 = pd.read_csv('./OWL-data/phs_2019_stage_2.csv', encoding='latin1')
df9 = pd.read_csv('./OWL-data/phs_2019_stage_3.csv', encoding='latin1')
df10 = pd.read_csv('./OWL-data/phs_2019_stage_4.csv', encoding='latin1')

df = pd.concat([df1, df2, df3, df4, df5, df6, df7, df8, df9, df10])
# group players by team
grouped = df.groupby('team')['player'].unique().apply(list).reset_index()
# rename for clarity
grouped.columns = ['team', 'players']

# convert to JSON
json_output = grouped.to_dict(orient='records')
with open('teams.json', 'w') as f:
    json.dump(json_output, f, indent=2)




print(json_output)


df1 = pd.read_csv('./OWL-data/phs_2018_playoffs.csv', encoding='latin1')
df2 = pd.read_csv('./OWL-data/phs_2019_playoffs.csv', encoding='latin1')
df3 = pd.read_csv('./OWL-data/phs_2018_stage_1.csv', encoding='latin1')
df4 = pd.read_csv('./OWL-data/phs_2018_stage_2.csv', encoding='latin1')
df5 = pd.read_csv('./OWL-data/phs_2018_stage_3.csv', encoding='latin1')
df6 = pd.read_csv('./OWL-data/phs_2018_stage_4.csv', encoding='latin1')
df7 = pd.read_csv('./OWL-data/phs_2019_stage_1.csv', encoding='latin1')
df8 = pd.read_csv('./OWL-data/phs_2019_stage_2.csv', encoding='latin1')
df9 = pd.read_csv('./OWL-data/phs_2019_stage_3.csv', encoding='latin1')
df10 = pd.read_csv('./OWL-data/phs_2019_stage_4.csv', encoding='latin1')


map1 = df1["map_name"].dropna().unique()
map2 = df2["map_name"].dropna().unique()
map3 = df3["map_name"].dropna().unique()
map4 = df4["map_name"].dropna().unique()
map5 = df5["map_name"].dropna().unique()
map6 = df6["map_name"].dropna().unique()
map7 = df7["map_name"].dropna().unique()
map8 = df8["map_name"].dropna().unique()
map9 = df9["map_name"].dropna().unique()
map10 = df10["map_name"].dropna().unique()



maps = sorted(set(map1) | set(map2) | set(map3) | set(map4) | set(map5) | set(map6) | set(map7) | set(map8) | set(map9) | set(map10))


with open('maps.json', 'w') as f:
    json.dump(maps, f, indent=2)



print(json_output)




df1 = pd.read_csv('./OWL-data/phs_2018_playoffs.csv', encoding='latin1')
df2 = pd.read_csv('./OWL-data/phs_2019_playoffs.csv', encoding='latin1')
df3 = pd.read_csv('./OWL-data/phs_2018_stage_1.csv', encoding='latin1')
df4 = pd.read_csv('./OWL-data/phs_2018_stage_2.csv', encoding='latin1')
df5 = pd.read_csv('./OWL-data/phs_2018_stage_3.csv', encoding='latin1')
df6 = pd.read_csv('./OWL-data/phs_2018_stage_4.csv', encoding='latin1')
df7 = pd.read_csv('./OWL-data/phs_2019_stage_1.csv', encoding='latin1')
df8 = pd.read_csv('./OWL-data/phs_2019_stage_2.csv', encoding='latin1')
df9 = pd.read_csv('./OWL-data/phs_2019_stage_3.csv', encoding='latin1')
df10 = pd.read_csv('./OWL-data/phs_2019_stage_4.csv', encoding='latin1')


hero1 = df1["hero"].dropna().unique()
hero2 = df2["hero"].dropna().unique()
hero3 = df3["hero"].dropna().unique()
hero4 = df4["hero"].dropna().unique()
hero5 = df5["hero"].dropna().unique()
hero6 = df6["hero"].dropna().unique()
hero7 = df7["hero"].dropna().unique()
hero8 = df8["hero"].dropna().unique()
hero9 = df9["hero"].dropna().unique()
hero10 = df10["hero"].dropna().unique()



heros = sorted(set(hero1) | set(hero2) | set(hero3) | set(hero4) | set(hero5) | set(hero6) | set(hero7) | set(hero8) | set(hero9) | set(hero10))

with open('heros.json', 'w') as f:
    json.dump(heros, f, indent=2)



print(json_output)



