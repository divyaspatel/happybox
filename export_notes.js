const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'server', 'data', 'notes.json');
const outputFile = path.join(__dirname, 'exported_notes.txt');

try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Format each note as "Date - NoteText"
  const exportedText = data.map(noteObj => {
    return `${noteObj.date} - ${noteObj.note}`;
  }).join('\n\n');

  fs.writeFileSync(outputFile, exportedText, 'utf8');
  console.log(`Successfully exported ${data.length} notes to exported_notes.txt`);
} catch (err) {
  console.error('Error exporting notes:', err);
}
