import pandas as pd
import numpy as np
import json
df = pd.read_csv('./OWL-data/phs_2018_playoffs.csv', encoding='latin1')

# group by 'team' and collect players into lists
grouped = df.groupby('team')['player'].unique().apply(list).reset_index()

# rename for clarity
grouped.columns = ['team', 'players']

# convert to JSON
json_output = grouped.to_dict(orient='records')
with open('teams.json', 'w') as f:
    json.dump(json_output, f, indent=2)

df = pd.read_csv('./OWL-data/phs_2019_playoffs.csv', encoding='latin1')

# group by 'team' and collect players into lists
grouped = df.groupby('team')['player'].unique().apply(list).reset_index()

# rename for clarity
grouped.columns = ['team', 'players']

# convert to JSON
json_output = grouped.to_dict(orient='records')
with open('teams.json', 'w') as f:
    json.dump(json_output, f, indent=2)


print(json_output)



