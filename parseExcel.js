import fs from 'fs';
import xlsx from 'xlsx';

const workbook = xlsx.readFile('Planilha (1).xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data', { recursive: true });
}
fs.writeFileSync('src/data/apoiadores.json', JSON.stringify(data, null, 2));
console.log('Parsed successfully. Found ' + data.length + ' rows.');
