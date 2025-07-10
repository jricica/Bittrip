// GET
fetch('http://localhost:3000/get-data')
  .then(res => res.json())
  .then(console.log);

// POST
fetch('http://localhost:3000/insert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ column1: 'value', column2: 123 })
})
  .then(res => res.json())
  .then(console.log);