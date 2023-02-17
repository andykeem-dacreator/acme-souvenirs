const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_souvenirs');

const Person = conn.define('person', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Thing = conn.define('thing', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Place = conn.define('place', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

const Souvenir = conn.define('souvenir', {
});

Souvenir.belongsTo(Person);
Person.hasMany(Souvenir);

Souvenir.belongsTo(Thing);
Thing.hasMany(Souvenir);

Souvenir.belongsTo(Place);
Place.hasMany(Souvenir);

module.exports = {
  conn,
  Person,
  Souvenir,
  Thing,
  Place
}



