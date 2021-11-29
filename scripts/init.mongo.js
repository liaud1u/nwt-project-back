
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

// Insert people array
db.getCollection('collections').insertMany([
  {
    amount: 1,
    idUser: "61a386bb334ac0413ea10011",
    idCard: "61a3c03e334ac0413ea10013"
  },
  {
    amount: 2,
    idUser: "61a386bb334ac0413ea10011",
    idCard: "61a3c03e334ac0413ea10014"
  },
]);

// display the final initial data
db.getCollection('collections').find({});

// Insert people array
db.getCollection('notifications').insertMany([
  {
    read: false,
    accepted: false,
    type: "notif",
    idUser: "61a386bb334ac0413ea10011",
    content: "Bonjour, je suis une notif !",
    creationTime: new Timestamp()
  },
  {
    read: false,
    accepted: false,
    type: "notif",
    idUser: "61a386bb334ac0413ea10011",
    content: "Bonjour, je suis une notif 2 !",
    creationTime: new Timestamp()
  },
]);

// display the final initial data
db.getCollection('notifications').find({});