/**
 * Mappping of month index (0-11) to its corresponding visual theme.
 * Each month contains an image URL (using reliable Picsum photos) and a set of Tailwind color classes
 * used for dynamically rendering the background blobs.
 */
export const monthThemes = {
  // January: Winter, frosty blues and soft icy tones
  0: {
    name: "January",
    image: "https://picsum.photos/id/1036/1200/600.webp", // Snowy trees
    blobs: ["bg-blue-300", "bg-cyan-300", "bg-indigo-300"],
  },
  // February: Romance, dusty pinks and soft reds
  1: {
    name: "February",
    image: "https://picsum.photos/id/1060/1200/600.webp", // Coffee / cozy
    blobs: ["bg-rose-300", "bg-pink-300", "bg-fuchsia-300"],
  },
  // March: Early spring, fresh greens and soft yellows
  2: {
    name: "March",
    image: "https://picsum.photos/id/1044/1200/600.webp", // Trees
    blobs: ["bg-green-300", "bg-lime-200", "bg-teal-200"],
  },
  // April: Rain and blooms, light blues and pastels
  3: {
    name: "April",
    image: "https://picsum.photos/id/1015/1200/600.webp", // River valley
    blobs: ["bg-sky-300", "bg-purple-200", "bg-blue-300"],
  },
  // May: Full spring, lush greens and bright yellow
  4: {
    name: "May",
    image: "https://picsum.photos/id/1018/1200/600.webp", // Nature / mountain
    blobs: ["bg-emerald-300", "bg-yellow-200", "bg-lime-300"],
  },
  // June: Early summer, beachy vibes
  5: {
    name: "June",
    image: "https://picsum.photos/id/1043/1200/600.webp", // Beach landscape
    blobs: ["bg-cyan-300", "bg-yellow-300", "bg-sky-300"],
  },
  // July: Peak summer, vibrant orange and reds
  6: {
    name: "July",
    image: "https://picsum.photos/id/1019/1200/600.webp", // Sunset
    blobs: ["bg-orange-400", "bg-orange-300", "bg-amber-300"],
  },
  // August: Late summer, sunsets and warmth
  7: {
    name: "August",
    image: "https://picsum.photos/id/1016/1200/600.webp", // Canyon
    blobs: ["bg-amber-400", "bg-red-300", "bg-orange-300"],
  },
  // September: Early autumn, soft transition colors
  8: {
    name: "September",
    image: "https://picsum.photos/id/1047/1200/600.webp", // City / autumn hues
    blobs: ["bg-orange-200", "bg-yellow-500", "bg-red-200"],
  },
  // October: Fall and halloween, deep oranges and purples
  9: {
    name: "October",
    image: "https://picsum.photos/id/1055/1200/600.webp", // Moody / cool tone
    blobs: ["bg-orange-500", "bg-purple-400", "bg-orange-300"],
  },
  // November: Cool late autumn, cozy browns and soft greys
  10: {
    name: "November",
    image: "https://picsum.photos/id/1022/1200/600.webp", // Aurora borealis
    blobs: ["bg-stone-400", "bg-orange-200", "bg-slate-300"],
  },
  // December: Holidays and winter, deep reds, greens and gold
  11: {
    name: "December",
    image: "https://picsum.photos/id/1025/1200/600.webp", // Pug in blanket
    blobs: ["bg-red-400", "bg-emerald-400", "bg-amber-200"],
  },
};

/**
 * Fallback theme used if an invalid month is provided
 */
export const defaultTheme = {
  name: "Default",
  image: "https://picsum.photos/id/1018/1200/600.webp",
  blobs: ["bg-purple-300", "bg-yellow-300", "bg-pink-300"],
};

/**
 * Helper function to retrieve the theme for a specific given Date
 */
export const getThemeForDate = (date) => {
  if (!date || !(date instanceof Date)) return defaultTheme;
  const monthIndex = date.getMonth();
  return monthThemes[monthIndex] || defaultTheme;
};
