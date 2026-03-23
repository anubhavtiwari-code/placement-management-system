const stringSimilarity = (str1, str2) => {
  // Very simplistic match: count how many words from str1 are in str2
  const words1 = str1.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const words2 = str2.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  
  if (words1.length === 0) return 0;
  
  let matchCount = 0;
  const uniqueWords1 = [...new Set(words1)];
  const uniqueWords2 = [...new Set(words2)];
  
  uniqueWords1.forEach(w1 => {
    if (uniqueWords2.includes(w1)) {
      matchCount++;
    } else {
      // Allow partial matches for things like "react" vs "reactjs"
      const partialMatch = uniqueWords2.some(w2 => w2.includes(w1) || w1.includes(w2));
      if (partialMatch && w1.length > 2) matchCount++;
    }
  });

  return Math.min(100, Math.round((matchCount / uniqueWords1.length) * 100));
};

exports.calculateMatchScore = (studentSkills, jobDescription) => {
  if (!studentSkills || !jobDescription) return 0;
  
  // Clean inputs
  const skills = studentSkills.split(',').map(s => s.trim()).filter(Boolean);
  if (skills.length === 0) return 0;

  // Extracted target text
  const targetText = jobDescription.toLowerCase();

  let matchCount = 0;
  
  skills.forEach(skill => {
    const s = skill.toLowerCase();
    if (targetText.includes(s)) {
      matchCount++;
    } else {
      // try breaking down the skill if it's multiple words
      const parts = s.split(' ');
      if (parts.length > 1) {
        if (parts.some(p => targetText.includes(p) && p.length > 2)) matchCount += 0.5;
      }
    }
  });

  const baseScore = (matchCount / skills.length) * 100;
  // Boost score slightly if they have at least one match, up to 100
  return Math.min(100, Math.round(baseScore === 0 ? 0 : baseScore + 10)); // Base match + slight boost
};
