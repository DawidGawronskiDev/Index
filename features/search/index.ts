import { search } from "./utils";
import { invertedIndex, documentLookup } from "./corpus";

const query = process.argv.slice(2).join(" ");

if (!query) {
  console.error('Usage: npx tsx search.ts "your search query"');
  process.exit(1);
}

const results = search(query, invertedIndex, documentLookup);

if (results.length === 0) {
  console.log("No results.");
} else {
  results.forEach((result, i) => {
    console.log(`${i + 1}. ${result.title} (${result.score.toFixed(4)})`);
    console.log(`   ${result.url}`);
  });
}
