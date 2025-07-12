export function enLettresSansDevise(nombre) {
  if (typeof nombre !== 'number' || isNaN(nombre)) {
    throw new Error("Entrée invalide : il faut un nombre.");
  }

  const UNITE = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six',
    'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize',
    'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'
  ];

  const DIZAINE = [
    '', '', 'vingt', 'trente', 'quarante',
    'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'
  ];

  function convert999(n) {
    let str = '';
    const centaine = Math.floor(n / 100);
    const reste = n % 100;

    if (centaine > 0) {
      if (centaine === 1) str += 'cent';
      else str += UNITE[centaine] + ' cent';
      if (reste === 0 && centaine > 1) str += 's';
      if (reste > 0) str += ' ';
    }

    if (reste < 20) {
      str += UNITE[reste];
    } else {
      const dizaine = Math.floor(reste / 10);
      const unite = reste % 10;

      if (dizaine === 7 || dizaine === 9) {
        str += DIZAINE[dizaine] + '-' + UNITE[10 + unite];
      } else {
        str += DIZAINE[dizaine];
        if (unite === 1 && (dizaine !== 8)) {
          str += '-et-un';
        } else if (unite > 0) {
          str += '-' + UNITE[unite];
        } else if (dizaine === 8 && unite === 0) {
          str += 's'; // ex: "quatre-vingts"
        }
      }
    }

    return str.trim();
  }

  function convertNombreEntier(n) {
    if (n === 0) return 'zéro';

    const milliards = Math.floor(n / 1_000_000_000);
    const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
    const milliers = Math.floor((n % 1_000_000) / 1000);
    const reste = n % 1000;

    let parts = [];

    if (milliards > 0) {
      parts.push(convert999(milliards) + ' milliard' + (milliards > 1 ? 's' : ''));
    }

    if (millions > 0) {
      parts.push(convert999(millions) + ' million' + (millions > 1 ? 's' : ''));
    }

    if (milliers > 0) {
      if (milliers === 1) parts.push('mille');
      else parts.push(convert999(milliers) + ' mille');
    }

    if (reste > 0) {
      parts.push(convert999(reste));
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  const [entier, decimal] = nombre.toFixed(2).split('.').map(Number);

  let texte = convertNombreEntier(entier);

  if (decimal > 0) {
    texte += ' virgule ' + convertNombreEntier(decimal);
  }

  return texte;
}