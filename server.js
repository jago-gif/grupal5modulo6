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

let pokeinfo = [];
let pokemones = [];

const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/componentes");

app.get("/", async (req, res) => {
  try {
    await getAllpokemon();
    await getPokemones();
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
  pokeinfo.push(data.results);
}
async function getPokemones() {
  for (let i = 0; i < pokeinfo[0].length; i++) {
    await getPokemon(pokeinfo[0][i].url);
  }
}

async function getPokemon(url) {
  const response = await fetch(`${url}`);
  const data = await response.json();
  pokemones.push({ nombre: data.name, imagen: data.sprites.front_default });
}

app.listen(PORT, () => {
  console.log("Server on port " + PORT);
});
