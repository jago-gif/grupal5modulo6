import express from "express";
import hbs from "hbs";
import fetch from "node-fetch";


//recuperar ruta raiz
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//fin recuperación ruta raiz

const PORT = process.env.PORT || 3000;


const api = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=150";


const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/componentes");

app.get("/", async (req, res) => {
  try {
   const pokeinfo = await getAllpokemon();
  
   const pokemones = await getPokemones(pokeinfo);
   console.log(pokemones);
    
    res.render("index", { pokemones });
  } catch (error) {
    console.error(error);
    res.send("Error al obtener los datos"); 
  }
});

app.get("/hola", (req, res) => {
 res.send("Hola mundo"); 
 
})

async function getAllpokemon() {
  const response = await fetch(`${api}`);
  const data = await response.json();
  return(data.results);
}
async function getPokemones(pokeinfo) {
  let pokemones = [];
  for (let i = 0; i < pokeinfo.length; i++) {
    const pokemon = await getPokemon(pokeinfo[i].url);
    pokemones.push(pokemon);
  }
      return pokemones;

}

async function getPokemon(url) {
  const response = await fetch(`${url}`);
  const data = await response.json();
  const poke = { nombre: data.name, imagen: data.sprites.front_default };
  return poke;

}

app.listen(PORT, () => {
  console.log("Server on port " + PORT);
}); 
