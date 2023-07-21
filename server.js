import express from "express";
import hbs from "hbs";

//recuperar ruta raiz
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//fin recuperación ruta raiz


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
    console.log(pokemones);
    res.render("index", { pokemones }); // Renderizar la página con los Pokémones
  } catch (error) {
    console.error(error);
    res.send("Error al obtener los datos"); // En caso de error, enviar un mensaje de error
  }
});


async function getAllpokemon() {
  const response = await fetch(`${api}`);
  const data = await response.json();
  pokeinfo.push(data.results);
}
async function getPokemones() {
  for (let i = 0; i < pokeinfo[0].length; i++) {
    await getPokemon(pokeinfo[0][i].url);
  }
  console.log(pokemones);
}

async function getPokemon(url) {
  //console.log(url)
  const response = await fetch(`${url}`);
  const data = await response.json();
  pokemones.push({ nombre: data.name, imagen: data.sprites.front_default });
  console.log(pokemones);
}

app.listen(3000, () => {
  console.log("Server on port 3000");
});
