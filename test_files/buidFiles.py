import json

# Load the original JSON file
with open('en20news.json', 'r') as file:
    data = json.load(file)

# Get the "News" dictionary
news = data['News']

# Get the first news item as a template
template = list(news.values())[0]

# Create a new dictionary with unique keys
new_news = {}
for i in range(1, 2000+1):  # Replace 201 with the desired number of news items
    new_key = f'Example{i}'
    new_item = template.copy()
    new_item['Identifier'] = new_key
    new_news[new_key] = new_item

# Replace the old "News" dictionary with the new one
data['News'] = new_news

# Write the modified data to a new JSON file
with open('en1000news.json', 'w') as file:
    json.dump(data, file, indent=2)