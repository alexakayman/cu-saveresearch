import { importGrantsFromCSV } from "../lib/import-grants";

const csvFilePath = process.argv[2] || "./data/grants.csv";

importGrantsFromCSV(csvFilePath)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to import grants:", error);
    process.exit(1);
  });
