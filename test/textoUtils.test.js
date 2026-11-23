const TextoUtils = require("../src/textoUtils");

describe("TextoUtils", () => {
  let texto;

  beforeEach(() => {
    texto = new TextoUtils();
  });

  describe("inverter", () => {
    test("deve inverter uma string", () => {
      expect(texto.inverter("abc")).toBe("cba");
    });

    test("deve retornar string vazia ao inverter string vazia", () => {
      expect(texto.inverter("")).toBe("");
    });
  });

  describe("ehPalindromo", () => {
    test("deve reconhecer palíndromo ignorando espaços e caixa", () => {
      expect(texto.ehPalindromo("Ame a ema")).toBe(true);
    });

    test("deve ignorar pontuação", () => {
      expect(texto.ehPalindromo("A man, a plan, a canal: Panama!")).toBe(true);
    });

    test("deve retornar false para texto que não é palíndromo", () => {
      expect(texto.ehPalindromo("jest")).toBe(false);
    });

    test("deve considerar letras acentuadas como a letra sem acento", () => {
      expect(texto.ehPalindromo("Socorram-me, subi no ônibus em Marrocos")).toBe(true);
      expect(texto.ehPalindromo("Ótimo, mito")).toBe(true);
    });

    test("não deve descartar letras acentuadas", () => {
      expect(texto.ehPalindromo("ãb")).toBe(false);
    });
  });

  describe("capitalizar", () => {
    test("deve deixar a primeira letra de cada palavra maiúscula", () => {
      expect(texto.capitalizar("olá mundo")).toBe("Olá Mundo");
    });

    test("deve deixar o restante das letras minúsculas", () => {
      expect(texto.capitalizar("jAVAsCRIPT É LEGAL")).toBe("Javascript É Legal");
    });

    test("deve preservar espaços múltiplos", () => {
      expect(texto.capitalizar("a  b")).toBe("A  B");
    });
  });

  describe("contarOcorrencias", () => {
    test("deve contar quantas vezes a substring aparece", () => {
      expect(texto.contarOcorrencias("banana", "an")).toBe(2);
    });

    test("deve retornar 0 quando a substring não aparece", () => {
      expect(texto.contarOcorrencias("banana", "x")).toBe(0);
    });

    test("deve retornar 0 quando a substring é vazia", () => {
      expect(texto.contarOcorrencias("banana", "")).toBe(0);
    });
  });

  describe("removerEspacosExtras", () => {
    test("deve remover espaços no início, no fim e repetidos", () => {
      expect(texto.removerEspacosExtras("  olá    mundo  ")).toBe("olá mundo");
    });

    test("deve converter tabs e quebras de linha em um espaço", () => {
      expect(texto.removerEspacosExtras("a\t\nb")).toBe("a b");
    });
  });

  describe("paraSlug", () => {
    test("deve converter texto em slug removendo acentos e pontuação", () => {
      expect(texto.paraSlug("Olá Mundo!")).toBe("ola-mundo");
    });

    test("deve tratar espaços extras e caracteres especiais", () => {
      expect(texto.paraSlug("  Ação & Reação  ")).toBe("acao-reacao");
    });
  });

  describe("truncar", () => {
    test("deve truncar e adicionar reticências quando passa do tamanho", () => {
      expect(texto.truncar("Olá mundo", 3)).toBe("Olá...");
    });

    test("deve retornar o texto original quando cabe no tamanho", () => {
      expect(texto.truncar("Olá", 3)).toBe("Olá");
    });

    test("deve retornar só reticências com tamanho zero", () => {
      expect(texto.truncar("Olá", 0)).toBe("...");
    });

    test("deve lançar erro quando o tamanho é negativo", () => {
      expect(() => texto.truncar("Olá", -1)).toThrow(
        "O tamanho não pode ser negativo",
      );
    });
  });

  describe("contarPalavras", () => {
    test("deve contar palavras ignorando espaços extras", () => {
      expect(texto.contarPalavras("  um   dois tres ")).toBe(3);
    });

    test("deve retornar 0 para texto vazio ou só com espaços", () => {
      expect(texto.contarPalavras("")).toBe(0);
      expect(texto.contarPalavras("    ")).toBe(0);
    });
  });

  describe("somenteLetras", () => {
    test("deve retornar true para texto só com letras, incluindo acentos", () => {
      expect(texto.somenteLetras("Ação")).toBe(true);
    });

    test("deve retornar false quando há números, espaços ou símbolos", () => {
      expect(texto.somenteLetras("abc1")).toBe(false);
      expect(texto.somenteLetras("olá mundo")).toBe(false);
      expect(texto.somenteLetras("abc!")).toBe(false);
    });

    test("deve retornar false para string vazia", () => {
      expect(texto.somenteLetras("")).toBe(false);
    });
  });

  describe("substituirTudo", () => {
    test("deve substituir todas as ocorrências", () => {
      expect(texto.substituirTudo("a-b-c", "-", "+")).toBe("a+b+c");
    });

    test("deve retornar o texto igual quando o alvo não aparece", () => {
      expect(texto.substituirTudo("abc", "x", "y")).toBe("abc");
    });

    test("deve lançar erro quando o alvo é vazio", () => {
      expect(() => texto.substituirTudo("abc", "", "y")).toThrow(
        "O alvo não pode ser vazio",
      );
    });
  });
});
