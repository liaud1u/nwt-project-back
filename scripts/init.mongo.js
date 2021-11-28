
// Insert people array
db.getCollection('users').insertMany([
  {
    password: '$2b$10$RogYBFwjpVQXEq09mF8d2.GZu7fShzqFJTXVRHWKZoLw.q1QNEOsu',
    username: 'bonjourJeSuisNicolas',
    photo: 'https://randomuser.me/portraits/women/59.jpg',
    firstname: 'Nicolas',
    lastname: 'Sarkozy',
    birthDate: 126316800,
    email: 'Nicolas.Sarkozy@ARGENT.com'
  },
  {
    password: '$2b$10$RogYBFwjpVQXEq09mF8d2.GZu7fShzqFJTXVRHWKZoLw.q1QNEOsu',
    username: 'JeanCristhobaldo',
    photo: 'https://randomuser.me/portraits/women/58.jpg',
    firstname: 'Jean',
    lastname: 'Cristhobaldo',
    birthDate: 915235200,
    email: 'Jean.Cristho@gmail.com'
  }
]);

// display the final initial data
db.getCollection('users').find({});
