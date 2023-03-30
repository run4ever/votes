export interface Coproprietaire {
  id: string;
  nom: string;
  tantiemes: number;
  votes: { [key: string]: number };
}
