/* eslint-disable no-console */
// scripts/populateComics.ts

import axios from "axios";
import mongoose from "mongoose";
import { config } from "../src/config";
import { comicDBModel } from "../src/datasources/comicsAPI/ComicsDBModel";

const API_KEY = config.COMIC_VINE_API_KEY;
const MONGODB_URI = config.MONGO_DB_URI;

if (!API_KEY || !MONGODB_URI) {
  console.error("Faltan variables de entorno necesarias.");
  process.exit(1);
}

const fetchComics = async (offset: number) => {
  const url = `https://comicvine.gamespot.com/api/issues/`;
  try {
    const response = await axios.get(url, {
      params: {
        api_key: API_KEY,
        format: "json",
        field_list:
          "name,person_credits,description,image,issue_number,cover_date,volume",
        limit: 100,
        offset: offset,
        sort: "cover_date:desc",
      },
      headers: {
        "User-Agent": "ComicDataCollector/1.0",
      },
    });

    if (response.data.error !== "OK") {
      console.error(`Error en la API: ${response.data.error}`);
      return [];
    }

    return response.data.results;
  } catch (error) {
    console.error("Error al obtener datos de la API:", error);
    return [];
  }
};

const saveComics = async (comicsData: any[]) => {
  const comics = comicsData.map((comicData) => {
    return {
      name: comicData.name || "Sin título",
      person_credits: comicData.person_credits
        ? comicData.person_credits.map((person: any) => person.name).join(", ")
        : "Desconocido",
      description: comicData.description || "Sin descripción",
      image: comicData.image ? comicData.image.original_url : "",
      issue_number: parseInt(comicData.issue_number) || 0,
      cover_date: comicData.cover_date
        ? new Date(comicData.cover_date)
        : new Date(),
      volume: comicData.volume ? comicData.volume.id : 0,
      publisher:
        comicData.volume && comicData.volume.publisher
          ? comicData.volume.publisher.name
          : "Desconocido",
    };
  });

  try {
    await comicDBModel.insertMany(comics);
    console.log(`Se han guardado ${comics.length} cómics en la base de datos.`);
  } catch (error) {
    console.error("Error al guardar cómics en la base de datos:", error);
  }
};

const main = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a la base de datos MongoDB.");

    let totalComicsFetched = 0;
    const totalComicsToFetch = 200;
    const limitPerRequest = 100;

    while (totalComicsFetched < totalComicsToFetch) {
      const offset = totalComicsFetched;
      const comicsData = await fetchComics(offset);
      if (comicsData.length === 0) {
        console.log("No se obtuvieron más cómics de la API.");
        break;
      }

      await saveComics(comicsData);

      totalComicsFetched += comicsData.length;

      // Espera 1 segundo entre solicitudes para respetar el rate limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Proceso completado.");
    process.exit(0);
  } catch (error) {
    console.error("Error en el proceso principal:", error);
    process.exit(1);
  }
};

main();
