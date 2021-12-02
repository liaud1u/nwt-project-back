/**
 * This script is to create data inside the collections of the database nwt
 * You can use it with mongo-shell or a tool like Robo3T
 */
// Insert users array
db.getCollection('users').insertMany([
  {
    password: '$2b$10$RogYBFwjpVQXEq09mF8d2.GZu7fShzqFJTXVRHWKZoLw.q1QNEOsu',
    username: 'vander',
    photo: 'https://randomuser.me/api/portraits/men/34.jpg',
    firstname: 'vanderito',
    lastname: 'alod',
    birthDate: 126316800,
    email: 'vanderito.alod@mail.com',
    lastRollDate: 126316800,
  },
  {
    password: '$2b$10$RogYBFwjpVQXEq09mF8d2.GZu7fShzqFJTXVRHWKZoLw.q1QNEOsu',
    username: 'jean',
    photo: 'https://randomuser.me/api/portraits/men/40.jpg',
    firstname: 'Jean',
    lastname: 'Cristho',
    birthDate: 915235200,
    email: 'jean.cristho@gmail.com',
    lastRollDate: 915235200,
  }
]);

// display the final initial data
db.getCollection('users').find({});

// Insert cards array
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
  {
    name: "Zerator",
    description: "Streamer Français",
    level: 4,
    image: "https://yt3.ggpht.com/dXnqPVBbQzCzv7D4BG5_TkQHvvNsO4ndWqka2BXjE8BAS5XGARahVQUQiJRiZRYxyyzhZ5sh-Uw=s88-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Twitch",
    description: "Plateforme de streaming",
    level: 3,
    image: "https://pbs.twimg.com/profile_images/1290231731056971776/67hU0Sgv_400x400.png",
  },
  {
    name: "Firefox",
    description: "Navigateur Firefox",
    level: 1,
    image: "https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg",
  },
  {
    name: "Discord",
    description: "L'endroit pour parler",
    level: 1,
    image: "https://upload.wikimedia.org/wikipedia/fr/8/80/Logo_Discord_2015.png",
  },
  {
    name: "NestJS",
    description: "Un framework Node.js",
    level: 3,
    image: "https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg",
  },
  {
    name: "Terminal",
    description: "Le logiciel ultime",
    level: 4,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/GNOME_Terminal_icon_2019.svg/128px-GNOME_Terminal_icon_2019.svg.png",
  },
]);

// display the final initial data
db.getCollection('cards').find({});

// Create an array with cards element
var cardsData = db
  .getCollection('cards')
  .find({})
  .map(function (element) {
    return {
      _id: element._id,
      name: element.name
    };
  });

// Create an array with users element
var usersData = db
  .getCollection('users')
  .find({})
  .map(function (element) {
    return {
      _id: element._id,
      username: element.username
    };
  });

// Insert collections array
db.getCollection('collections').insertMany([
  {
    amount: 1,
    idUser: "61a386bb334ac0413ea10011",
    idCard: "61a3c03e334ac0413ea10013",
    waiting: 0
  },
  {
    amount: 2,
    idUser: "61a386bb334ac0413ea10011",
    idCard: "61a3c03e334ac0413ea10014",
    waiting: 0
  },
]);

// display the final initial data
db.getCollection('collections').find({});

var cpt = 0;

// For each element of the array ...
usersData.forEach(function (element) {
      for(i= 0; i<5; i++) {
        // update the person with the managerId
        db.getCollection('collections').insert(
          {
            amount: 1,
            idUser: (element._id.toString().split("\"")[1]),
            idCard: (cardsData[cpt]._id.toString().split("\"")[1]),
            waiting: 0
          }
        );
        cpt += 1
        cpt = cpt % 8;
      }
});

// Insert notifications array
db.getCollection('notifications').insertMany([]);

// display the final initial data
db.getCollection('notifications').find({});

// Insert trade array
db.getCollection('trades').insertMany([]);

// display the final initial data
db.getCollection('trades').find({});