#!/usr/bin/env node
/**
 * ETL: Food_Display_Table.xlsx → public/foods.json
 *
 * Usage:
 *   node scripts/convert.js <path-to-xlsx>
 *   node scripts/convert.js Food_Display_Table.xlsx
 *
 * Output: public/foods.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = process.argv[2] || path.join(__dirname, '..', 'Food_Display_Table.xlsx');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'foods.json');

if (!fs.existsSync(INPUT_FILE)) {
  console.error(`Error: file not found: ${INPUT_FILE}`);
  console.error('Usage: node scripts/convert.js <path-to-Food_Display_Table.xlsx>');
  process.exit(1);
}

console.log(`Reading: ${INPUT_FILE}`);

const workbook = XLSX.readFile(INPUT_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

let skipped = 0;

const foods = rows
  .map((row, index) => {
    const calories = parseFloat(row['Calories']);
    const portionAmount = parseFloat(row['Portion_Amount']);

    // Skip rows with missing or invalid core data
    if (!row['Display_Name'] || isNaN(calories) || calories < 0) {
      skipped++;
      return null;
    }

    const portionLabel = row['Portion_Display_Name']
      ? String(row['Portion_Display_Name']).trim()
      : '';

    const portionDisplay =
      !isNaN(portionAmount) && portionAmount > 0
        ? `${portionAmount} ${portionLabel}`.trim()
        : portionLabel || 'serving';

    return {
      id: index + 1,
      code: String(row['Food_Code'] ?? '').trim(),
      name: String(row['Display_Name']).trim(),
      portion: portionDisplay,
      calories: Math.round(calories),
    };
  })
  .filter(Boolean);

// Sort alphabetically by name for consistent ordering
foods.sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(foods, null, 2), 'utf-8');

console.log(`Done.`);
console.log(`  Total rows read : ${rows.length}`);
console.log(`  Skipped (invalid): ${skipped}`);
console.log(`  Foods exported  : ${foods.length}`);
console.log(`  Output          : ${OUTPUT_FILE}`);
