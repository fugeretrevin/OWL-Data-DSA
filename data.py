import pandas as pd
import numpy as np
df = pd.read_csv('./OWL-data/phs_2018_playoffs.csv', encoding='latin1')
print(df.head())
print(df['stat_amount'].mean())
print(df.loc[(df['stat_name'] == 'All Damage Done') & (df['hero'] != 'All Heroes'), 'stat_amount'].mean())
newdf = df[(df['stat_name'] == 'All Damage Done') & (df['hero'] != 'All Heroes') ]
print(newdf.head())