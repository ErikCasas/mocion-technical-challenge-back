/* eslint-disable no-console */

import axios from "axios";
import mongoose from "mongoose";
import { comicDBModel } from "../src/datasources/comicsAPI/ComicsDBModel";
import { config } from "../src/config";
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
        field_list: "name,image,issue_number,cover_date,volume,api_detail_url",
        limit: 50,
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
    console.error("Error fetching the data:", error);
    return [];
  }
};

const fetchVolumeDetails = async (volumeApiUrl: string) => {
  try {
    const response = await axios.get(volumeApiUrl, {
      params: {
        api_key: API_KEY,
        format: "json",
      },
    });

    if (response.data.error !== "OK") {
      console.error(
        `Error fetching the data of the volumen: ${response.data.error}`
      );
      return null;
    }

    return response.data.results;
  } catch (error) {
    console.error("Error fetching the data of the volumen:", error);
    return null;
  }
};

const fetchComicDetails = async (comicApiUrl: string) => {
  try {
    const response = await axios.get(comicApiUrl, {
      params: {
        api_key: API_KEY,
        format: "json",
      },
    });

    if (response.data.error !== "OK") {
      console.error(`Error fetching the comic detail: ${response.data.error}`);
      return null;
    }

    return response.data.results;
  } catch (error) {
    console.error("Error fetching the comic detail:", error);
    return null;
  }
};

const saveComics = async (comicsData: any[]) => {
  const comics: any = [];

  for (const comicData of comicsData) {
    const volumeApiUrl = comicData.volume.api_detail_url;
    const volumeDetails = await fetchVolumeDetails(volumeApiUrl);

    const publisherName =
      volumeDetails && volumeDetails.publisher && volumeDetails.publisher.name
        ? volumeDetails.publisher.name
        : "Unknow";

    const comicApiUrl = comicData.api_detail_url;
    const comicDetails = await fetchComicDetails(comicApiUrl);

    const personCredits =
      comicDetails && comicDetails.person_credits
        ? comicDetails.person_credits.map((person: any) => person.name)
        : ["Unknow"];

    const description =
      comicDetails && comicDetails.description
        ? comicDetails.description
        : "No description";

    const comicName = comicData.name
      ? comicData.name
      : volumeDetails && volumeDetails.name
      ? volumeDetails.name
      : "No title";

    const comic = {
      name: comicName,
      person_credits: personCredits,
      description: description,
      image:
        comicData.image && comicData.image.original_url
          ? comicData.image.original_url
          : "",
      issue_number: parseInt(comicData.issue_number) || 0,
      cover_date: comicData.cover_date
        ? new Date(comicData.cover_date)
        : new Date(),
      volume: comicData.volume ? comicData.volume.id : 0,
      publisher: publisherName,
    };

    comics.push(comic as never);

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  try {
    await comicDBModel.insertMany(comics);
    console.log(`${comics.length} comics in the data base`);
  } catch (error) {
    console.error("Error saving the data", error);
  }
};

const main = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connecting... ⌛⌛");

    const offset = 51;

    const comicsData = await fetchComics(offset);

    if (comicsData.length === 0) {
      console.log("Nothing 👀");
    } else {
      await saveComics(comicsData);
    }

    console.log("Succesfully 🎉🎉");
    process.exit(0);
  } catch (error) {
    console.error("Error", error);
    process.exit(1);
  }
};

main();
