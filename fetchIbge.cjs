const https = require('https');
const fs = require('fs');

https.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/15/municipios', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    const municipios = JSON.parse(data);
    const map = {};
    municipios.forEach(m => {
      map[m.id.toString()] = m.nome;
    });
    fs.writeFileSync('./src/data/ibgeMap.json', JSON.stringify(map, null, 2));
    console.log('Mapping saved to src/data/ibgeMap.json');
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
