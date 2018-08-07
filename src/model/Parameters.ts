export namespace Parameters{

    /*  A pontuação funcionará da seguinte maneira:

        Quanto ao tempo
            Acertou a questão entre 19 e 15 segundos restantes:     + 4 pontos
            Acertou a questão entre 14 e 10 segundos restantes:     + 3 pontos
            Acertou a questão entre 9 e 5 segundos restantes:       + 2 pontos
            Acertou a questão com menos de 5 segundos restantes:    + 1 pontos
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

    // Pontuação a ser ganha ao acertar uma questão com determinado tempo
    export const POINTS_TIME_19_15: number = 4;
    export const POINTS_TIME_14_10: number  = 3;
    export const POINTS_TIME_9_5: number  = 2;
    export const POINTS_TIME_4_0: number  = 1;

    // Pontuação a ser ganha ao acertar uma questão em determinado dificuldade
    export const POINTS_HIT_HARD: number  = 15;
    export const POINTS_HIT_MEDIUM: number  = 10;
    export const POINTS_HIT_EASY: number  = 5;

    // Pontuação a ser perdida ao errar uma questão de acordo com a dificuldade
    export const POINTS_WRONG: number  = -2;
    export const POINTS_WRONG_HARD: number  = -1;
    export const POINTS_WRONG_MEDIUM: number  = -2;
    export const POINTS_WRONG_EASY: number  = -3;
    
    // Tempo em segundo que são acrescentados ao acionar o PowerUP
    export const PLUS_TIME: number = 5;
    
    // Número de PowerUPs ao ser ganho por determinadas situações
    export const POWER_UP_INITIAL: number = 5;  // 5 PowerUPs de cada tipo
    export const POWER_UP_DIARY: number = 5;    // 5 PowerUPs a ser sorteados para todos os tipos
    export const POWER_UP_GAME: number  = 1;    // 1 PowerUP a ser sorteados para todos os tipos
    
    // Número de acertos para ganhar PowerUP
    export const HITS_POWERUP: number  = 5;
    export const HITS_HARD_POWERUP: number  = 3;
    
    export const TIME_QUESTION: number  = 20;
    export const TIME_GAME: number  = 120;

    export const HORA_EM_MILISEGUNDO: number = 3600000;
    export const DIA_EM_MILISEGUNDO: number = HORA_EM_MILISEGUNDO * 24;


}