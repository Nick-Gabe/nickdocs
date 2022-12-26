export function drawRandomElement<Type>(arr: Type[]): Type {
  return arr.at(Math.floor(Math.random() * arr.length))!;
}
