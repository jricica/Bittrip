fetch('http://localhost:3000/trips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'trip001',
    name: 'Viaje a Guatemala',
    startDate: '2025-08-01',
    endDate: '2025-08-10',
    budget: 500.00,
    userId: 'user123',
    status: 'planned'
  })
})
  .then(res => res.json())
  .then(console.log);
