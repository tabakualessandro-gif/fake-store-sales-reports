import { mkdir, writeFile } from "node:fs/promises";
import { fetchStoreData } from "./api.js";
import { buildReports } from "./reports.js";

async function main(): Promise<void> {
  try {
    console.log("Recupero dati da Fake Store API...");
    const { products, carts, users } = await fetchStoreData();
    const { productReport, customerReport } = buildReports(products, carts, users);

    const outputDirectory = "output";
    await mkdir(outputDirectory, { recursive: true });

    await Promise.all([
      writeFile(
        `${outputDirectory}/report_prodotti.json`,
        JSON.stringify(productReport, null, 2),
        "utf8",
      ),
      writeFile(
        `${outputDirectory}/report_clienti.json`,
        JSON.stringify(customerReport, null, 2),
        "utf8",
      ),
    ]);

    console.log("\n=== REPORT PRODOTTI ===");
    console.log(JSON.stringify(productReport, null, 2));
    console.log("\n=== REPORT CLIENTI ===");
    console.log(JSON.stringify(customerReport, null, 2));
    console.log(
      `\nFile generati: ${outputDirectory}/report_prodotti.json e ${outputDirectory}/report_clienti.json`,
    );
  } catch (error) {
    console.error("Impossibile generare i report.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

await main();