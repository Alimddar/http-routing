const fs = require("fs").promises;
const path = require("path");
const url = "https://openlibrary.org/search.json?q=science&page=2&limit=6";

async function writeFile(file, data) {
  try {
    const filePath = path.join(__dirname , "json", file);
    await fs.writeFile(filePath, data);

    return `${filePath} Edited Sucessfully`;
  } catch (error) {
    throw error;
  }
}

async function extractData(data) {
  try {
    const books = data.docs.map((book) => ({
      tittle: book.title || "Anonym",
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      description: book.first_sentence
        ? book.first_sentence[0]
        : "No description available",
      publish_date: book.first_publish_year || "Unknown",
    }));

    books.sort((a, b) => {
      return a.publish_date - b.publish_date;
    });

    return books;
  } catch (error) {
    throw error;
  }
}

async function fetchUrl(url, file) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const sortedData = await extractData(data);
    const jsonData = JSON.stringify(sortedData, null, 2);
    const result = await writeFile(file, jsonData);

    return result;
  } catch (error) {
    throw error;
  }
}

fetchUrl(url, "book.json")
  .then((res) => console.log(res))
  .catch((error) => {
    console.error(`Error occured while process : ${error}`);
  });
