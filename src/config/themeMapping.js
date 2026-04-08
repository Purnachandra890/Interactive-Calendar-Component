/**
 * Mappping of month index (0-11) to its corresponding visual theme.
 * Each month contains an image URL (using reliable Picsum photos) and a set of Tailwind color classes
 * used for dynamically rendering the background blobs.
 */
export const monthThemes = {
  // January: Calm + fresh start
  0: {
    name: "January",
    image: "/january-theme.png", 
    blobs: ["bg-slate-200", "bg-blue-100", "bg-indigo-50"],
  },
  // February: Love + softness
  1: {
    name: "February",
    image: "/february-theme.png", 
    blobs: ["bg-rose-200", "bg-pink-100", "bg-fuchsia-100"],
  },
  // March: Energetic + colorful (Holi)
  2: {
    name: "March",
    image: "/march-theme.png", 
    blobs: ["bg-pink-400", "bg-yellow-300", "bg-cyan-400"],
  },
  // April: Clean + growth
  3: {
    name: "April",
    image: "/april-theme.png", 
    blobs: ["bg-green-200", "bg-emerald-100", "bg-lime-100"],
  },
  // May: Warm + relaxed
  4: {
    name: "May",
    image: "/may-theme.png", 
    blobs: ["bg-amber-300", "bg-yellow-200", "bg-orange-200"],
  },
  // June: Calm + rainy (Monsoon start)
  5: {
    name: "June",
    image: "/june-theme.png", 
    blobs: ["bg-slate-400", "bg-blue-300", "bg-cyan-200"],
  },
  // July: Deep + natural (Heavy Monsoon)
  6: {
    name: "July",
    image: "/july-theme.png", 
    blobs: ["bg-emerald-700", "bg-green-800", "bg-teal-700"],
  },
  // August: Pride + celebration
  7: {
    name: "August",
    image: "/august-theme.png", 
    blobs: ["bg-orange-400", "bg-slate-200", "bg-green-500"],
  },
  // September: Festive + cultural (Ganesh Festival)
  8: {
    name: "September",
    image: "/september-theme.png", 
    blobs: ["bg-amber-500", "bg-orange-400", "bg-yellow-600"],
  },
  // October: Calm + seasonal shift (Autumn)
  9: {
    name: "October",
    image: "/october-theme.png", 
    blobs: ["bg-orange-700", "bg-amber-800", "bg-red-900"],
  },
  // November: Bright + festive (Diwali)
  10: {
    name: "November",
    image: "/november-theme.png", 
    blobs: ["bg-yellow-400", "bg-orange-500", "bg-amber-400"],
  },
  // December: Cozy + celebration (Christmas)
  11: {
    name: "December",
    image: "/december-theme.png", 
    blobs: ["bg-red-600", "bg-emerald-600", "bg-amber-400"],
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
