export class Question {

    private idQuestion: number;
    private question: string;
    private answer: number; /*0 - Alternativa A | 1 - Alternativa B | 2 - Alternativa C | 3 - Alternativa D*/
    private alternative_A: string;
    private alternative_B: string;
    private alternative_C: string;
    private alternative_D: string;
    private textBiblical: string;
    private levelQuestion: number;
    private testamento: string; /* Antigo | Novo */
    private secaoBiblia: string; /* Pentateuco | História 1 | Poesia | Profetas Maiores | Profetas Menores | Evangelhos | História 2 | Cartas | Profecia */
    private referenciaBiblica: string;

    constructor(){

    }
}