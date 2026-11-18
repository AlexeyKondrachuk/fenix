const letters: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function transliterate(text: string) {
  return [...text].map(char => {
    const lower = char.toLowerCase();
    const replacement = letters[lower];
    if (replacement === undefined) return char;
    return char === lower ? replacement : replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }).join("");
}

export function titleSlug(title: string) {
  return transliterate(title).toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100).replace(/-$/, "") || "article";
}
