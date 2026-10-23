/* Original local answer lists. Unknown answers never receive estimated credit. */
(function (root) {
  'use strict';
  const entry = (answer, score, ...aliases) => ({ answer, score, aliases });
  const prompts = [
    { category: 'FLIGHT DECK', text: 'Name something an astronaut takes into space', entries: [
      entry('suit', 28, 'space suit', 'spacesuit', 'space suits', 'spacesuits'),
      entry('food', 17, 'space food', 'meal', 'meals', 'snack', 'snacks'),
      entry('water', 14, 'drinking water', 'water bottle', 'bottle of water'),
      entry('camera', 33, 'cameras'), entry('book', 22, 'books'), entry('guitar', 68, 'guitars'),
      entry('plant', 46, 'plants'), entry('pencil', 39, 'pencils'), entry('hot sauce', 72),
      entry('toy dinosaur', 93, 'dinosaur toy', 'tiny dinosaur', 'dinosaur plush', 'plush dinosaur'),
      entry('oxygen', 15, 'oxygen tank'), entry('helmet', 24, 'space helmet'),
      entry('gloves', 26, 'glove', 'space gloves'), entry('boots', 27, 'boot', 'space boots'),
      entry('toothbrush', 29, 'toothbrushes'), entry('toothpaste', 32),
      entry('sleeping bag', 38, 'sleeping bags'), entry('laptop', 34, 'laptops', 'computer', 'computers'),
      entry('tools', 30, 'tool', 'tool kit', 'toolkit'), entry('experiment', 40, 'experiments', 'science experiment'),
      entry('photograph', 42, 'photographs', 'photo', 'photos', 'family photo', 'family photograph')
    ] },
    { category: 'LUNAR APPROACH', text: 'Name a moon in our solar system', entries: [
      entry('moon', 12, 'the moon', 'luna', "earth's moon", 'earths moon', 'earth moon'),
      entry('europa', 72), entry('titan', 62), entry('io', 52), entry('ganymede', 73),
      entry('enceladus', 91), entry('triton', 84), entry('phobos', 64), entry('callisto', 68),
      entry('miranda', 94), entry('amalthea', 86), entry('thebe', 91), entry('adrastea', 94), entry('metis', 97)
    ] },
    { category: 'THE RED PLANET', text: 'Name something you might find on Mars', entries: [
      entry('rocks', 11, 'rock', 'stone', 'stones'), entry('dust', 13, 'red dust', 'martian dust'),
      entry('ice', 18, 'water ice', 'frozen water'), entry('rover', 15, 'rovers', 'mars rover'),
      entry('volcano', 31, 'volcanoes', 'olympus mons'), entry('canyon', 27, 'canyons', 'valles marineris'),
      entry('hematite', 57, 'haematite'), entry('blueberries', 72, 'blueberry', 'hematite spherules'),
      entry('perchlorate', 82, 'perchlorates'), entry('recurring slope lineae', 98),
      entry('crater', 20, 'craters', 'impact crater'), entry('sand', 19),
      entry('sand dune', 33, 'sand dunes', 'dune', 'dunes'), entry('carbon dioxide', 35, 'co2'),
      entry('dry ice', 44, 'carbon dioxide ice'), entry('basalt', 49), entry('iron oxide', 41, 'rust'),
      entry('atmosphere', 23, 'thin atmosphere'), entry('mountain', 25, 'mountains'),
      entry('dust storm', 37, 'dust storms'), entry('curiosity', 43, 'curiosity rover'),
      entry('perseverance', 48, 'perseverance rover'), entry('opportunity', 56, 'opportunity rover'),
      entry('spirit', 59, 'spirit rover'), entry('lander', 32, 'landers', 'mars lander')
    ] },
    { category: 'JOVIAN SYSTEM', text: 'Name a moon of Jupiter', entries: [
      entry('europa', 72), entry('io', 52), entry('ganymede', 73), entry('callisto', 68),
      entry('amalthea', 86), entry('thebe', 91), entry('adrastea', 94), entry('metis', 97)
    ] },
    { category: 'SOLAR SYSTEM', text: 'Name something that can orbit a star', entries: [
      entry('planet', 12, 'planets'), entry('comet', 24, 'comets'),
      entry('asteroid', 18, 'asteroids'), entry('dust', 22, 'space dust', 'cosmic dust'),
      entry('exoplanet', 42, 'exoplanets', 'extrasolar planet'),
      entry('companion star', 54, 'binary star', 'star', 'another star'),
      entry('dwarf planet', 37, 'dwarf planets'), entry('earth', 13, 'the earth'),
      entry('mars', 15), entry('jupiter', 16), entry('saturn', 20), entry('venus', 17),
      entry('mercury', 23), entry('uranus', 31), entry('neptune', 34), entry('pluto', 41),
      entry('meteoroid', 46, 'meteoroids'), entry('debris', 38, 'space debris', 'rock', 'rocks')
    ] },
    { category: 'MILKY WAY', text: 'Name a constellation', entries: [
      entry('orion', 14), entry('ursa major', 31), entry('cassiopeia', 44), entry('leo', 17),
      entry('cygnus', 38), entry('draco', 48), entry('scorpius', 36, 'scorpio'), entry('lyra', 40),
      entry('mensa', 84), entry('camelopardalis', 93), entry('ursa minor', 35),
      entry('andromeda', 29), entry('taurus', 24), entry('gemini', 25), entry('aries', 26),
      entry('cancer', 30), entry('virgo', 28), entry('libra', 32), entry('sagittarius', 39),
      entry('capricornus', 47, 'capricorn'), entry('aquarius', 33), entry('pisces', 34),
      entry('pegasus', 45), entry('perseus', 50), entry('canis major', 53), entry('canis minor', 58),
      entry('crux', 63, 'southern cross'), entry('aquila', 61), entry('centaurus', 64), entry('hercules', 55)
    ] },
    { category: 'BEYOND THE KNOWN', text: 'Name something you can see in the night sky', entries: [
      entry('moon', 12, 'the moon', 'luna'), entry('stars', 10, 'star'),
      entry('planet', 21, 'planets'), entry('satellite', 39, 'satellites', 'artificial satellite'),
      entry('comet', 46, 'comets'), entry('nebula', 62, 'nebulae', 'nebulas'),
      entry('zodiacal light', 97), entry('gegenschein', 99),
      entry('meteor', 35, 'meteors', 'shooting star', 'shooting stars'),
      entry('meteor shower', 58, 'meteor showers'), entry('milky way', 64, 'the milky way'),
      entry('constellation', 30, 'constellations'), entry('aurora', 72, 'aurora borealis', 'aurora australis', 'northern lights', 'southern lights'),
      entry('galaxy', 66, 'galaxies'), entry('venus', 25), entry('jupiter', 28), entry('mars', 32),
      entry('saturn', 37), entry('cloud', 14, 'clouds'), entry('airplane', 19, 'aeroplane', 'plane'),
      entry('space station', 51, 'iss', 'international space station')
    ] }
  ];

  function normalize(value) {
    if (typeof value !== 'string' || value.length > 96) return null;
    // Do not erase punctuation or digits: "wa!!!ter" must not turn into "water".
    const clean = value.normalize('NFKC').toLowerCase().trim()
      .replace(/[’‘]/g, "'").replace(/[‐‑–—]/g, '-')
      .replace(/\s+/g, ' ').replace(/-/g, ' ');
    return clean.length <= 48 && /^[a-z0-9]+(?:[ '][a-z0-9]+)*$/.test(clean) ? clean : null;
  }
  const indexes = prompts.map(prompt => {
    const index = new Map();
    for (const item of prompt.entries) {
      if (!Number.isInteger(item.score) || item.score <= 0 || item.score > 100) throw new Error('Invalid answer score');
      for (const label of [item.answer, ...item.aliases]) {
        const key = normalize(label);
        if (!key || (index.has(key) && index.get(key) !== item)) throw new Error('Invalid or conflicting answer alias: ' + label);
        index.set(key, item);
      }
    }
    return index;
  });
  function validate(round, value) {
    const clean = normalize(value);
    const index = Number.isInteger(round) && round >= 0 && round < indexes.length ? indexes[round] : null;
    const match = index?.get(clean);
    return match ? { accepted: true, answer: match.answer, score: match.score }
      : { accepted: false, answer: null, score: 0 };
  }
  const bank = { prompts, normalize, validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = bank;
  else root.StarlingAnswers = bank;
})(typeof globalThis !== 'undefined' ? globalThis : this);
