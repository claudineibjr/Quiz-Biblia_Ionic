export class Question {

    private idQuestion: number;
    private question: string;
    private answer: number; /*0 - Alternativa A | 1 - Alternativa B | 2 - Alternativa C | 3 - Alternativa D*/
    public alternatives: Array<String>;
    private textBiblical: string;
    private levelQuestion: number;
    private testamento: string; /* Antigo | Novo */
    private secaoBiblia: string; /* Pentateuco | História 1 | Poesia | Profetas Maiores | Profetas Menores | Evangelhos | História 2 | Cartas | Profecia */
    private referenciaBiblica: string;

    constructor (       idQuestion: number, question: string, answer: number, 
                        alternatives: Array<String>,
                        textBiblical: string, levelQuestion: number, testamento: string, 
                        secaoBiblia: string, referenciaBiblica: string){                        
        
        this.idQuestion = idQuestion;
        this.question = question;
        this.answer = answer;
        this.alternatives = alternatives;
        this.textBiblical = textBiblical;
        this.levelQuestion = levelQuestion;
        this.testamento = testamento;
        this.secaoBiblia = secaoBiblia;
        this.referenciaBiblica = referenciaBiblica;
    }

    public getId(): number{                 return this.idQuestion; }
    public getQuestion(): string{           return this.question; }
    public getAnswer(): number{             return this.answer; }
    public getAlternatives(): Array<String>{     return this.alternatives;   }
    public getTextBiblical(): string{       return this.textBiblical;   }
    public getLevelQuestion(): number{      return this.levelQuestion;  }
    public getTestamento(): string{         return this.testamento; }
    public getReferenciaBiblica(): string{  return this.testamento; }
    
}