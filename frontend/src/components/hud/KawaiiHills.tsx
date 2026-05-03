// KawaiiHills : 2 couches de collines en clip-path qui s'affichent en fond
// global de la page (sous le jardin). Style Animal Crossing.
// Decoratif, position fixed, pointer-events none.

export function KawaiiHills() {
  return (
    <>
      <div className="kawaii-hills kawaii-hills--back" aria-hidden />
      <div className="kawaii-hills kawaii-hills--front" aria-hidden />
    </>
  );
}
