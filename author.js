const fs = require("fs").promises;
const path = require("path");

async function writeFile(file, data) {
  try {
    const filePath = path.join(__dirname, "json", file);
    await fs.writeFile(filePath, data);

    return `${filePath} Edited Successfully`;
  } catch (error) {
    throw error;
  }
}

async function fetchAuthorData(authorName) {
  try {
    const authorUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(authorName)}`;
    const response = await fetch(authorUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function extractAuthorData(data) {
  try {
    const authors = data.docs.map((author) => ({
      name: author.author_name ? author.author_name[0] : "Unknown",
      works: author.title || "No title available",
      publish_date: author.first_publish_year || "Unknown",
    }));

    return authors;
  } catch (error) {
    throw error;
  }
}

async function fetchAuthors(file) {
  try {
    const bookData = await fs.readFile(path.join(__dirname, "json", "book.json"), "utf-8");
    const books = JSON.parse(bookData);
    const authorNames = [
      ...new Set(
        books.map((book) => book.author).filter((name) => name !== "Unknown"),
      ),
    ];

    const authorDataPromises = authorNames.map(async (authorName) => {
      const authorData = await fetchAuthorData(authorName);
      const extractedData = await extractAuthorData(authorData);
      return {
        authorName,
        books: extractedData,
      };
    });

    const allAuthorsData = await Promise.all(authorDataPromises);
    const jsonData = JSON.stringify(allAuthorsData, null, 2);
    const result = await writeFile(file, jsonData);

    return result;
  } catch (error) {
    throw error;
  }
}

fetchAuthors("author.json")
  .then((res) => console.log(res))
  .catch((error) => {
    console.error(`Error occurred while processing: ${error}`);
  });
