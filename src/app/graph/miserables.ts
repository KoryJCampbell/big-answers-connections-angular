export let test = {
  'nodes': [
    {'id': 'Alice', 'group': 2},
    {'id': 'Bob', 'group': 3},
    {'id': 'Cathy', 'group': 4}
  ],
  'links': [
    {'source': 'Alice', 'target': 'Bob', 'value': 2},
    {'source': 'Bob', 'target': 'Cathy', 'value': 4},
    {'source': 'Cathy', 'target': 'Alice', 'value': 6},
  ]
}
