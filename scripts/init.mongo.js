
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

// Insert people array
db.getCollection('cards').insertMany([
  {
    name: "Place Stanislas",
    description: "Plus belle place du monde qui se trouve à Nancy",
    level: 5,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Fontaine_de_Neptune_sur_la_Place_Stanislas.jpg/1920px-Fontaine_de_Neptune_sur_la_Place_Stanislas.jpg",
  },
  {
    name: "Fac de Science",
    description: "Université de Lorraine",
    level: 2,
    image: "https://www.crafters.fr/images/boutique/UL/Logo-boutiqueUL.png",
  },
]);

// display the final initial data
db.getCollection('cards').find({});
