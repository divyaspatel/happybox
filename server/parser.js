const fs = require('fs');
const path = require('path');

const RAW_FILE = path.join(__dirname, '..', 'historical_notes.txt');
const OUT_FILE = path.join(__dirname, 'data', 'notes.json');

if (!fs.existsSync(RAW_FILE)) {
  console.error("historical_notes.txt not found. Please create it in the project root.");
  process.exit(1);
}

const rawText = fs.readFileSync(RAW_FILE, 'utf8');

// Parse text blocks
const blocks = rawText.split(/\n\n+/);

const parsedNotes = [];

// Pass 1: Parse what we have
blocks.forEach((block) => {
  let text = block.trim();
  if (!text || text.startsWith('[[') || text.startsWith('Here is the list') || text.startsWith('___') || text.startsWith('<truncated')) return;
  if (/^https?:\/\//i.test(text)) return; 

  let parsedDateObj = null;
  let hasYear = false;
  let monthDayStr = null;
  let notePart = text;
  
  // 1. Has explicit Date + Year (e.g. "April 15th 2025" or "12th July 2025")
  const explicitYearMatch = text.match(/^(?:\[|)?(?:NYC\s+)?([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4}))(?:\]|)\s*[-:]\s*(.*)/i) || 
                            text.match(/^([A-Za-z]+\s+\d{4})\s*-\s*(.*)/i) ||
                            text.match(/^(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})\s*[-:]\s*(.*)/i);
  
  // 2. Has Month + Day only (e.g. "April 15th")
  const monthDayMatch = text.match(/^(?:\[|)?(?:NYC\s+)?([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)(?:\]|)\s*[-:]\s*(.*)/i);

  if (explicitYearMatch) {
    let cleanDate = explicitYearMatch[1].replace(/(\d+)(st|nd|rd|th)/, '$1');
    let d = new Date(cleanDate);
    if (!isNaN(d.getTime())) {
      parsedDateObj = d;
      hasYear = true;
      notePart = explicitYearMatch[2].trim();
    }
  } else if (monthDayMatch) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const isMonth = months.some(m => monthDayMatch[1].trim().toLowerCase().startsWith(m.toLowerCase()));
    if (isMonth) {
      monthDayStr = monthDayMatch[1].replace(/(\d+)(st|nd|rd|th)/, '$1').trim();
      notePart = monthDayMatch[2].trim();
    }
  }

  // Sanity check: no dates before 2015
  if (parsedDateObj && parsedDateObj.getFullYear() < 2015) {
    console.warn(`Warning: Found date before 2015: ${parsedDateObj}. Ignoring date.`);
    parsedDateObj = null;
    hasYear = false;
  }

  parsedNotes.push({
    note: notePart,
    parsedDateObj: parsedDateObj,
    hasYear: hasYear,
    monthDayStr: monthDayStr,
    originalText: text
  });
});

// Pass 2: Infer years for Month/Day only notes
for (let i = 0; i < parsedNotes.length; i++) {
  const note = parsedNotes[i];
  if (!note.hasYear && note.monthDayStr !== null) {
    let yearAbove = new Date().getFullYear();
    let tsAbove = Date.now();
    for (let j = i - 1; j >= 0; j--) {
      if (parsedNotes[j].parsedDateObj) {
        yearAbove = parsedNotes[j].parsedDateObj.getFullYear();
        tsAbove = parsedNotes[j].parsedDateObj.getTime();
        break;
      }
    }
    
    let yearBelow = 2015;
    let tsBelow = new Date('2015-01-01').getTime();
    for (let j = i + 1; j < parsedNotes.length; j++) {
      if (parsedNotes[j].parsedDateObj) {
        yearBelow = parsedNotes[j].parsedDateObj.getFullYear();
        tsBelow = parsedNotes[j].parsedDateObj.getTime();
        break;
      }
    }

    let inferredYear = yearAbove;
    if (yearAbove !== yearBelow) {
      let d1 = new Date(`${note.monthDayStr} ${yearAbove}`);
      let d2 = new Date(`${note.monthDayStr} ${yearBelow}`);
      
      let d1Time = d1.getTime();
      let d2Time = d2.getTime();
      
      // we want tsAbove >= dTime >= tsBelow
      if (d1Time <= tsAbove && d1Time >= tsBelow) {
        inferredYear = yearAbove;
      } else if (d2Time <= tsAbove && d2Time >= tsBelow) {
        inferredYear = yearBelow;
      } else {
        inferredYear = yearAbove;
      }
    }

    let d = new Date(`${note.monthDayStr} ${inferredYear}`);
    if (!isNaN(d.getTime())) {
      note.parsedDateObj = d;
    }
  }
}

// Pass 3: Fill in missing dates chronologically strictly bounded
for (let i = 0; i < parsedNotes.length; i++) {
  if (parsedNotes[i].parsedDateObj === null) {
    let start = i;
    let end = i;
    while (end + 1 < parsedNotes.length && parsedNotes[end + 1].parsedDateObj === null) {
      end++;
    }
    
    let upperBoundDate = start > 0 && parsedNotes[start - 1].parsedDateObj ? parsedNotes[start - 1].parsedDateObj : new Date(); 
    
    let lowerBoundDate = new Date('2015-01-01T00:00:00Z');
    for (let j = end + 1; j < parsedNotes.length; j++) {
      if (parsedNotes[j].parsedDateObj !== null) {
        lowerBoundDate = parsedNotes[j].parsedDateObj;
        break;
      }
    }
    
    let upperTime = upperBoundDate.getTime();
    let lowerTime = lowerBoundDate.getTime();
    
    let maxT = Math.max(upperTime, lowerTime);
    let minT = Math.min(upperTime, lowerTime);
    if (maxT === minT) {
      maxT += 1000 * 60 * 60 * 24; // bump 1 day to give random gap
    }
    
    let L = end - start + 1;
    let randomTimes = [];
    for (let k = 0; k < L; k++) {
      randomTimes.push(minT + Math.random() * (maxT - minT));
    }
    // sort descending (newest first, because top of file is newest)
    randomTimes.sort((a, b) => b - a);
    
    for (let k = 0; k < L; k++) {
      parsedNotes[start + k].parsedDateObj = new Date(randomTimes[k]);
    }
    i = end;
  }
}

// Pass 4: format dates and build final array
const finalNotes = parsedNotes.map((n, i) => {
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const finalDateStr = monthFormatter.format(n.parsedDateObj);
  
  return {
    id: `import-${Date.now()}-${i}`,
    note: n.note,
    date: finalDateStr,
    images: [],
    createdAt: n.parsedDateObj.toISOString()
  };
});

// Preserve manually created notes from the UI (which usually don't have id starting with import- or length > 200)
let existingNotes = [];
if (fs.existsSync(OUT_FILE)) {
  existingNotes = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
}

const finalNoteTexts = new Set(finalNotes.map(n => n.note));
const manualNotes = existingNotes.filter(n => !finalNoteTexts.has(n.note) && !n.id.toString().startsWith("import-") && n.id.length < 20);

// Just to be extremely clean, the user requested to wipe the messy data and replace.
// manualNotes are test notes you created during session.
const allNotes = [...manualNotes, ...finalNotes];

// Sort it descending by createdAt just to be pristine
allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

fs.writeFileSync(OUT_FILE, JSON.stringify(allNotes, null, 2));

console.log(`Successfully parsed, completely randomized chronological missing dates, and injected ${finalNotes.length} notes!`);
