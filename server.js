// const { urlencoded } = require('express');
const express = require('express');
const app = express();
const db = require('./db');
const { Thing, Place, Souvenir, Person, conn } = db;

app.use(express.urlencoded({ extended:false }));
app.use(require('method-override')('_method'));


app.get('/', async(req, res, next) => {
  try {
    const people = await Person.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    const souvenirs = await Souvenir.findAll({
      include: [
        Person, 
        Thing, 
        Place 
      ]
    });
    res.send(`
    <html>
      <head>
        <title>Acme Souvenirs</title>
      </head>
      <body>
        <h1>Acme Souvenirs</h1>
        <h2>People</h2>
          <ul>
          ${
            people.map( person => {
              return `
              <li>
                ${ person.name }
              </li>
              `;
            }).join('')
          }
          </ul>
          <h2>Places</h2>
          <ul>
          ${
            places.map( place => {
              return `
              <li>
                ${ place.name }
              </li>
              `;
            }).join('')
          }
          </ul>
          <h2>Things</h2>
          <ul>
          ${
            things.map( thing => {
              return `
              <li>
                ${ thing.name }
              </li>
              `;
            }).join('')
          }
          </ul>
          <h2>Souvenirs</h2>
          <form method='POST' action='/souvenirs'>
            <select name = 'personId'>
              ${
                people.map( person => {
                  return `
                  <option value = '${ person.id}'>${ person.name }</option>
                  `;
                }).join('')
              }
            </select>  
            <select name = 'thingId'>
              ${
                things.map( thing => {
                  return `
                  <option value = '${ thing.id}'>${ thing.name }</option>
                  `;
                }).join('')
              }
            </select>  
            <select name = 'placeId'>
              ${
                places.map( place => {
                  return `
                  <option value = '${ place.id }'>${ place.name }</option>
                  `;
                }).join('')
              }
            </select>  
            <button>Submit</button>
          </form>
          <ul>
          ${
            souvenirs.map( souvenir => {
              return `
              <li>
                ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
                <form method='POST' action='/souvenirs/${ souvenir.id }?_method=delete'>
                  <button>x</button>
                </form>
              </li>
              `;
            }).join('')
          }
          </ul>
      </body>
    `)
  }
  catch(ex) {
    next(ex);
  }
});

app.post('/souvenirs', async (req, res, next)=> {
  try {
    await Souvenir.create(req.body);
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/souvenirs/:id', async(req, res, next)=> {
  try {
    const souvenir = await Souvenir.findByPk(req.params.id);
    await souvenir.destroy();
    res.redirect('/');
  }
  catch(ex){
    next(ex);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    const [ andy, jeff, minky, antoine ] = await Promise.all([
      Person.create({ name: 'Andy' }),
      Person.create({ name: 'Jeff' }),
      Person.create({ name: 'Minky' }),
      Person.create({ name: 'Antoine' }),
    ]);

    const [ tequila, watch, toy, ramen ] = await Promise.all ([
      Thing.create({ name: 'tequila' }),
      Thing.create({ name: 'watch' }),
      Thing.create({ name: 'toy' }),
      Thing.create({ name: 'ramen' })
    ]);

    const [ tulum, zurich, seoul, japan ] = await Promise.all ([
      Place.create({ name: 'Tulum' }),
      Place.create({ name: 'Zurich'}),
      Place.create({ name: 'Seoul' }),
      Place.create({ name: 'Japan' })
    ])

    await Promise.all([
      Souvenir.create({ personId: andy.id, thingId: tequila.id, placeId: tulum.id}),
      Souvenir.create({ personId: jeff.id, thingId: watch.id, placeId: zurich.id}),
      Souvenir.create({ personId: minky.id, thingId: toy.id, placeId: seoul.id}),
      Souvenir.create({ personId: antoine.id, thingId: ramen.id, placeId: japan.id}),
    ]);
  }
  catch(ex){
    console.log(ex);
  }
});


// <li>
//   ${souvenier.thing ? souvenir.thing.name:"nothing"}
//   owned by  ${souvenir.person ? souvenir.person.name:"nobody"}
//   bought at ${souvenir.place ? souvenir.place.name:"nowhere"}
// </li>