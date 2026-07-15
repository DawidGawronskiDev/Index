import fs from "fs/promises";

/**
 * Retrieves the list of document filenames from the "documents" directory.
 *
 * @returns A Promise that resolves to an array of filenames (strings) of the documents.
 * @throws An error if the "documents" directory cannot be read.
 */
export const getDocumentFilenames = async (): Promise<string[]> => {
  try {
    const files = await fs.readdir("documents");
    return files.filter((filename) => filename.endsWith(".json"));
  } catch (error) {
    console.error("Error reading documents directory:", error);
    throw error;
  }
};
