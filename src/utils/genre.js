export function getGenre(items, currgenre) {
  if (currgenre._id === "0") return items;
  const nitems = items.filter((m) => m.genre._id === currgenre._id);
  return nitems;
}
