export namespace Parameters{

    /*  A pontuação funcionará da seguinte maneira:

        Quanto ao tempo
            Acertou a questão entre 19 e 15 segundos restantes:     + 3 pontos
            Acertou a questão entre 14 e 10 segundos restantes:     + 2 pontos
            Acertou a questão entre 9 e 5 segundos restantes:       + 1 pontos
            Acertou a questão com menos de 5 segundos restantes:    + 0 pontos
            Erro a questão:                                         - 2 pontos

        Quanto à dificuldade
            Acertou difícil:    + 15 pontos
            Acertou médio:      + 10 pontos
            Acertou fácil:      + 5 pontos

            Errou difícil:      - 1 pontos
            Errou médio:        - 2 ponto
            Errou fácil:        - 3 pontos
    */

    /*Constantes*/
    export const POINTS_TIME_19_15: number = 3;
    export const POINTS_TIME_14_10 = 2;
    export const POINTS_TIME_9_5 = 1;
    export const POINTS_TIME_4_0 = 0;

    export const POINTS_HIT_HARD = 15;
    export const POINTS_HIT_MEDIUM = 10;
    export const POINTS_HIT_EASY = 5;

    export const POINTS_WRONG = -2;
    export const POINTS_WRONG_HARD = -1;
    export const POINTS_WRONG_MEDIUM = -2;
    export const POINTS_WRONG_EASY = -3;
    
    export const PLUS_TIME = 5;
    
    export const POWER_UP_INITIAL = 5;
    export const POWER_UP_DIARY = 3;
    export const POWER_UP_GAME = 1;
    
    export const HITS_POWERUP = 10;
    export const HITS_HARD_POWERUP = 5;
    
    export const TIME_QUESTION = 20;
    export const TIME_GAME = 120;

    export const HORA_EM_MILISEGUNDO: number = 3600000;
    export const DIA_EM_MILISEGUNDO: number = HORA_EM_MILISEGUNDO * 24;


}