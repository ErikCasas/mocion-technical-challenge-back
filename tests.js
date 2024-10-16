const axios = require("axios");

const apiKey = "4c6d8955233e117396523b389659016675e94323"; // Reemplaza con tu clave de API
const url = "https://comicvine.gamespot.com/api/issues/"; // Endpoint para obtener información de cómics

const params = {
  api_key: apiKey,
  format: "json",
  filter: "name:Spider-Man", // Puedes cambiar el filtro por el cómic que desees
  field_list: "",
};

axios
  .get(url, { params })
  .then((response) => {
    const issues = response.data.results;
    issues.forEach((issue) => {
      console.log(`Título: ${issue.name}`);
      if (issue.publisher) {
        console.log(`Editora: ${issue.publisher.name}`);
      } else {
        console.log("Editora no disponible");
      }
      console.log("-------------------------");
    });
  })
  .catch((error) => {
    console.error("Error al realizar la solicitud:", error);
  });
