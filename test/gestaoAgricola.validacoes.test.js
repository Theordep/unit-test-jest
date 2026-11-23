/**
 * Testes adicionados a partir do relatório de mutation testing (Stryker).
 *
 * Os testes originais verificavam apenas `toThrow(Error)`, sem checar a
 * mensagem, e não exercitavam NaN, tipos errados nem os valores de borda.
 * Por isso centenas de mutantes sobreviviam (ex.: trocar `x < 0` por `x <= 0`
 * ou remover a checagem `Number.isNaN(x)` não quebrava nenhum teste).
 */
const GestaoAgricola = require('../src/gestaoAgricola');

const gestao = new GestaoAgricola();

const MAIOR_OU_IGUAL_ZERO = '>=0';
const MAIOR_QUE_ZERO = '>0';

/**
 * Para cada método: argumentos válidos e a regra de cada parâmetro numérico.
 */
const VALIDACOES = [
  {
    metodo: 'calcularProdutividadePorHectare',
    args: [300, 10],
    params: [
      { nome: 'sacasColhidas', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'areaHectares', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'estimarProducaoTotal',
    args: [50, 20],
    params: [
      { nome: 'produtividadeMedia', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'areaHectares', regra: MAIOR_OU_IGUAL_ZERO },
    ],
  },
  {
    metodo: 'calcularPerdaColheita',
    args: [1000, 800],
    params: [
      { nome: 'producaoEstimada', regra: MAIOR_QUE_ZERO },
      { nome: 'producaoReal', regra: MAIOR_OU_IGUAL_ZERO },
    ],
  },
  {
    metodo: 'calcularDosagemDefensivo',
    args: [2, 10],
    params: [
      { nome: 'litrosPorHectare', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'areaHectares', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'validarCarenciaAplicacao',
    args: [new Date('2026-01-01'), new Date('2026-01-20'), 15],
    params: [null, null, { nome: 'diasCarencia', regra: MAIOR_OU_IGUAL_ZERO }],
  },
  {
    metodo: 'calcularNecessidadeAdubo',
    args: [10, 50],
    params: [
      { nome: 'areaHectares', regra: MAIOR_QUE_ZERO },
      { nome: 'kgPorHectare', regra: MAIOR_OU_IGUAL_ZERO },
    ],
  },
  {
    metodo: 'converterSacasParaToneladas',
    args: [100, 60],
    params: [
      { nome: 'sacas', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'pesoSacaKg', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'converterToneladasParaSacas',
    args: [6, 60],
    params: [
      { nome: 'toneladas', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'pesoSacaKg', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'converterHectaresParaAlqueires',
    args: [24.2],
    params: [{ nome: 'hectares', regra: MAIOR_OU_IGUAL_ZERO }],
  },
  {
    metodo: 'converterAlqueiresParaHectares',
    args: [10],
    params: [{ nome: 'alqueires', regra: MAIOR_OU_IGUAL_ZERO }],
  },
  {
    metodo: 'calcularDiasParaColheita',
    args: [new Date('2026-01-01'), 90],
    params: [null, { nome: 'cicloDiasCultura', regra: MAIOR_QUE_ZERO }],
  },
  {
    metodo: 'classificarEstagioSafra',
    args: [30, 100],
    params: [
      { nome: 'diasDesdePlantio', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'cicloTotal', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'calcularFretePorSaca',
    args: [100, 0.5, 200],
    params: [
      { nome: 'distanciaKm', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'valorPorKmPorSaca', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'quantidadeSacas', regra: MAIOR_QUE_ZERO },
    ],
  },
  {
    metodo: 'calcularValorVendaSafra',
    args: [1000, 150],
    params: [
      { nome: 'quantidadeSacas', regra: MAIOR_OU_IGUAL_ZERO },
      { nome: 'precoSacaAtual', regra: MAIOR_OU_IGUAL_ZERO },
    ],
  },
  {
    metodo: 'calcularMargemLucro',
    args: [1000, 600],
    params: [
      { nome: 'receitaBruta', regra: MAIOR_QUE_ZERO },
      { nome: 'custoTotalProducao', regra: MAIOR_OU_IGUAL_ZERO },
    ],
  },
  {
    metodo: 'converterUnidadeDefensivo',
    args: [1500, 'mL', 'L'],
    params: [{ nome: 'valor', regra: MAIOR_OU_IGUAL_ZERO }, null, null],
  },
];

const chamarCom = (metodo, args, indice, valor) => {
  const novosArgs = [...args];
  novosArgs[indice] = valor;
  return () => gestao[metodo](...novosArgs);
};

const casosInvalidos = [];
const casosDeBordaValidos = [];

for (const { metodo, args, params } of VALIDACOES) {
  params.forEach((param, indice) => {
    if (!param) return;
    const { nome, regra } = param;
    const mensagem =
      regra === MAIOR_QUE_ZERO
        ? `${nome} deve ser um número maior que zero`
        : `${nome} deve ser um número maior ou igual a zero`;

    const invalidos = [
      ['uma string numérica', '10'],
      ['NaN', NaN],
      ['negativo', -1],
    ];
    if (regra === MAIOR_QUE_ZERO) {
      invalidos.push(['zero', 0]);
    } else {
      casosDeBordaValidos.push([metodo, nome, args, indice]);
    }

    for (const [descricao, valor] of invalidos) {
      casosInvalidos.push([metodo, nome, descricao, args, indice, valor, mensagem]);
    }
  });
}

describe('GestaoAgricola - validação de parâmetros numéricos', () => {
  test.each(casosInvalidos)(
    '%s: deve rejeitar %s quando for %s',
    (metodo, _nome, _descricao, args, indice, valor, mensagem) => {
      expect(chamarCom(metodo, args, indice, valor)).toThrow(mensagem);
    }
  );

  test.each(casosDeBordaValidos)(
    '%s: deve aceitar %s igual a zero (borda)',
    (metodo, _nome, args, indice) => {
      expect(chamarCom(metodo, args, indice, 0)).not.toThrow();
    }
  );
});

describe('GestaoAgricola - cenários adicionais para matar mutantes', () => {
  describe('calcularAreaTotalPlantio', () => {
    const MSG_ARRAY = 'talhoes deve ser um array não vazio';
    const MSG_TALHAO = 'todos os talhoes devem ser números maiores ou iguais a zero';

    test('deve rejeitar valores que não são array ou array vazio', () => {
      expect(() => gestao.calcularAreaTotalPlantio('10')).toThrow(MSG_ARRAY);
      expect(() => gestao.calcularAreaTotalPlantio([])).toThrow(MSG_ARRAY);
    });

    test.each([
      ['string', ['10']],
      ['NaN', [NaN]],
      ['negativo', [10, -1]],
    ])('deve rejeitar talhão %s', (_descricao, talhoes) => {
      expect(() => gestao.calcularAreaTotalPlantio(talhoes)).toThrow(MSG_TALHAO);
    });

    test('deve aceitar talhão com área zero', () => {
      expect(gestao.calcularAreaTotalPlantio([0, 5])).toBe(5);
    });
  });

  describe('calcularCustoInsumos', () => {
    const MSG_ARRAY = 'itens deve ser um array não vazio';
    const MSG_ITEM =
      'cada item deve conter quantidade e precoUnitario numéricos e maiores ou iguais a zero';
    const valido = { quantidade: 2, precoUnitario: 10 };

    test('deve rejeitar valores que não são array ou array vazio', () => {
      expect(() => gestao.calcularCustoInsumos({})).toThrow(MSG_ARRAY);
      expect(() => gestao.calcularCustoInsumos([])).toThrow(MSG_ARRAY);
    });

    test.each([
      ['item nulo', null],
      ['quantidade string', { quantidade: '2', precoUnitario: 10 }],
      ['precoUnitario string', { quantidade: 2, precoUnitario: '10' }],
      ['quantidade NaN', { quantidade: NaN, precoUnitario: 10 }],
      ['precoUnitario NaN', { quantidade: 2, precoUnitario: NaN }],
      ['quantidade negativa', { quantidade: -1, precoUnitario: 10 }],
      ['precoUnitario negativo', { quantidade: 2, precoUnitario: -1 }],
    ])('deve rejeitar %s mesmo junto de um item válido', (_descricao, invalido) => {
      expect(() => gestao.calcularCustoInsumos([valido, invalido])).toThrow(MSG_ITEM);
    });

    test('deve aceitar precoUnitario igual a zero', () => {
      expect(gestao.calcularCustoInsumos([{ quantidade: 5, precoUnitario: 0 }, valido])).toBe(20);
    });
  });

  describe('validarCarenciaAplicacao', () => {
    const aplicacao = new Date('2026-01-01');

    test('deve informar qual data é inválida', () => {
      expect(() => gestao.validarCarenciaAplicacao(new Date('x'), aplicacao, 1)).toThrow(
        'dataAplicacao deve ser uma data válida'
      );
      expect(() => gestao.validarCarenciaAplicacao(aplicacao, '2026-01-20', 1)).toThrow(
        'dataColheitaPrevista deve ser uma data válida'
      );
    });

    test('deve aceitar colheita no mesmo dia da aplicação com carência zero', () => {
      expect(gestao.validarCarenciaAplicacao(aplicacao, new Date('2026-01-01'), 0)).toBe(true);
    });

    test('deve rejeitar colheita anterior à aplicação com mensagem específica', () => {
      expect(() =>
        gestao.validarCarenciaAplicacao(aplicacao, new Date('2025-12-31'), 0)
      ).toThrow('dataColheitaPrevista não pode ser anterior a dataAplicacao');
    });
  });

  describe('calcularDiasParaColheita', () => {
    test('deve rejeitar data de plantio inválida com mensagem específica', () => {
      expect(() => gestao.calcularDiasParaColheita(new Date('x'), 90)).toThrow(
        'dataPlantio deve ser uma data válida'
      );
    });
  });

  describe('classificarEstagioSafra - limites entre estágios', () => {
    test.each([
      [24, 'germinação'],
      [25, 'floração'],
      [74, 'floração'],
      [75, 'maturação'],
      [99, 'maturação'],
      [150, 'colheita'],
    ])('com %i de 100 dias deve ser "%s"', (dias, estagio) => {
      expect(gestao.classificarEstagioSafra(dias, 100)).toBe(estagio);
    });
  });

  describe('verificarJanelaPlantio', () => {
    const inicio = new Date('2026-03-01');
    const fim = new Date('2026-03-31');

    test('deve incluir o primeiro dia da janela', () => {
      expect(gestao.verificarJanelaPlantio(new Date('2026-03-01'), inicio, fim)).toBe(true);
    });

    test('deve retornar false antes do início da janela', () => {
      expect(gestao.verificarJanelaPlantio(new Date('2026-02-28'), inicio, fim)).toBe(false);
    });

    test('deve aceitar janela de um único dia', () => {
      const dia = new Date('2026-03-10');
      expect(gestao.verificarJanelaPlantio(dia, dia, new Date('2026-03-10'))).toBe(true);
    });

    test('deve validar cada data com mensagem específica', () => {
      expect(() => gestao.verificarJanelaPlantio(new Date('x'), inicio, fim)).toThrow(
        'dataAtual deve ser uma data válida'
      );
      expect(() => gestao.verificarJanelaPlantio(inicio, null, fim)).toThrow(
        'inicioJanela deve ser uma data válida'
      );
      expect(() => gestao.verificarJanelaPlantio(inicio, inicio, 'fim')).toThrow(
        'fimJanela deve ser uma data válida'
      );
      expect(() => gestao.verificarJanelaPlantio(inicio, fim, inicio)).toThrow(
        'inicioJanela não pode ser posterior a fimJanela'
      );
    });
  });

  describe('calcularRotacaoCultura', () => {
    test.each([
      ['Soja', 'Milho'],
      ['Milho', 'Algodão'],
      ['Algodão', 'Trigo'],
      ['Trigo', 'Soja'],
    ])('depois de %s deve sugerir %s', (ultima, sugerida) => {
      expect(gestao.calcularRotacaoCultura(['Cana', ultima])).toBe(sugerida);
    });

    test('deve rejeitar histórico que não é array ou está vazio', () => {
      const msg = 'historicoCulturas deve ser um array não vazio';
      expect(() => gestao.calcularRotacaoCultura('Soja')).toThrow(msg);
      expect(() => gestao.calcularRotacaoCultura([])).toThrow(msg);
    });

    test.each([
      ['número', ['Soja', 123]],
      ['string vazia', ['Soja', '']],
      ['string só com espaços', ['Soja', '   ']],
    ])('deve rejeitar histórico com %s', (_descricao, historico) => {
      expect(() => gestao.calcularRotacaoCultura(historico)).toThrow(
        'historicoCulturas deve conter apenas strings não vazias'
      );
    });
  });

  describe('converterUnidadeDefensivo', () => {
    test.each([
      [1.5, 'L', 'mL', 1500],
      [1500, 'mL', 'L', 1.5],
      [2, 'kg', 'g', 2000],
      [2000, 'g', 'kg', 2],
      [10, 'mL', 'mL', 10],
      [10, 'g', 'g', 10],
    ])('deve converter %d %s para %s', (valor, origem, destino, esperado) => {
      expect(gestao.converterUnidadeDefensivo(valor, origem, destino)).toBe(esperado);
    });

    test('deve rejeitar unidade de origem ou destino não suportada', () => {
      const msg = 'unidade de conversão não suportada. Use mL, L, g ou kg';
      expect(() => gestao.converterUnidadeDefensivo(10, 'm3', 'L')).toThrow(msg);
      expect(() => gestao.converterUnidadeDefensivo(10, 'L', 'm3')).toThrow(msg);
    });

    test('deve rejeitar conversão entre volume e massa', () => {
      const msg = 'não é possível converter entre unidades de volume e massa';
      expect(() => gestao.converterUnidadeDefensivo(10, 'mL', 'g')).toThrow(msg);
      expect(() => gestao.converterUnidadeDefensivo(10, 'kg', 'L')).toThrow(msg);
    });
  });
});
