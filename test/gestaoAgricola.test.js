const GestaoAgricola = require('../src/gestaoAgricola');

describe('GestaoAgricola', () => {
  let gestao;

  beforeEach(() => {
    gestao = new GestaoAgricola();
  });

  // ==========================================================
  // Produtividade e área
  // ==========================================================

  describe('calcularProdutividadePorHectare', () => {
    test('deve calcular corretamente a produtividade no caminho feliz', () => {
      expect(gestao.calcularProdutividadePorHectare(300, 10)).toBe(30);
    });

    test('deve retornar zero quando sacasColhidas for zero (caso de borda)', () => {
      expect(gestao.calcularProdutividadePorHectare(0, 10)).toBe(0);
    });

    test('deve lançar erro quando areaHectares for zero (divisão por zero)', () => {
      expect(() => gestao.calcularProdutividadePorHectare(100, 0)).toThrow(Error);
    });

    test('deve lançar erro quando sacasColhidas for negativo', () => {
      expect(() => gestao.calcularProdutividadePorHectare(-10, 10)).toThrow(Error);
    });
  });

  describe('calcularAreaTotalPlantio', () => {
    test('deve somar corretamente as áreas dos talhões no caminho feliz', () => {
      expect(gestao.calcularAreaTotalPlantio([10, 20, 30])).toBe(60);
    });

    test('deve retornar o próprio valor quando houver apenas um talhão com área zero (caso de borda)', () => {
      expect(gestao.calcularAreaTotalPlantio([0])).toBe(0);
    });

    test('deve lançar erro quando o array de talhões estiver vazio', () => {
      expect(() => gestao.calcularAreaTotalPlantio([])).toThrow(Error);
    });

    test('deve lançar erro quando algum talhão tiver área negativa', () => {
      expect(() => gestao.calcularAreaTotalPlantio([10, -5])).toThrow(Error);
    });
  });

  describe('estimarProducaoTotal', () => {
    test('deve estimar corretamente a produção total no caminho feliz', () => {
      expect(gestao.estimarProducaoTotal(50, 20)).toBe(1000);
    });

    test('deve retornar zero quando a área for zero (caso de borda)', () => {
      expect(gestao.estimarProducaoTotal(50, 0)).toBe(0);
    });

    test('deve lançar erro quando produtividadeMedia for negativa', () => {
      expect(() => gestao.estimarProducaoTotal(-1, 20)).toThrow(Error);
    });

    test('deve lançar erro quando areaHectares for negativa', () => {
      expect(() => gestao.estimarProducaoTotal(50, -20)).toThrow(Error);
    });
  });

  describe('calcularPerdaColheita', () => {
    test('deve calcular corretamente o percentual de perda no caminho feliz', () => {
      expect(gestao.calcularPerdaColheita(1000, 800)).toBe(20);
    });

    test('deve retornar zero quando não houver perda (produção real igual à estimada) (caso de borda)', () => {
      expect(gestao.calcularPerdaColheita(1000, 1000)).toBe(0);
    });

    test('deve lançar erro quando producaoEstimada for zero (divisão por zero)', () => {
      expect(() => gestao.calcularPerdaColheita(0, 100)).toThrow(Error);
    });

    test('deve lançar erro quando producaoReal for negativa', () => {
      expect(() => gestao.calcularPerdaColheita(1000, -1)).toThrow(Error);
    });
  });

  // ==========================================================
  // Defensivos e insumos
  // ==========================================================

  describe('calcularDosagemDefensivo', () => {
    test('deve calcular corretamente a dosagem total no caminho feliz', () => {
      expect(gestao.calcularDosagemDefensivo(2, 10)).toBe(20);
    });

    test('deve retornar zero quando litrosPorHectare for zero (caso de borda)', () => {
      expect(gestao.calcularDosagemDefensivo(0, 10)).toBe(0);
    });

    test('deve lançar erro quando areaHectares for zero', () => {
      expect(() => gestao.calcularDosagemDefensivo(2, 0)).toThrow(Error);
    });

    test('deve lançar erro quando litrosPorHectare for negativo', () => {
      expect(() => gestao.calcularDosagemDefensivo(-2, 10)).toThrow(Error);
    });
  });

  describe('calcularCustoInsumos', () => {
    test('deve calcular corretamente o custo total no caminho feliz', () => {
      const itens = [
        { quantidade: 2, precoUnitario: 100 },
        { quantidade: 3, precoUnitario: 50 },
      ];
      expect(gestao.calcularCustoInsumos(itens)).toBe(350);
    });

    test('deve retornar zero quando quantidade for zero em todos os itens (caso de borda)', () => {
      expect(gestao.calcularCustoInsumos([{ quantidade: 0, precoUnitario: 100 }])).toBe(0);
    });

    test('deve lançar erro quando o array de itens estiver vazio', () => {
      expect(() => gestao.calcularCustoInsumos([])).toThrow(Error);
    });

    test('deve lançar erro quando um item tiver precoUnitario negativo', () => {
      expect(() => gestao.calcularCustoInsumos([{ quantidade: 1, precoUnitario: -10 }])).toThrow(Error);
    });
  });

  describe('validarCarenciaAplicacao', () => {
    test('deve retornar true quando a carência for respeitada no caminho feliz', () => {
      const aplicacao = new Date('2026-01-01');
      const colheita = new Date('2026-01-20');
      expect(gestao.validarCarenciaAplicacao(aplicacao, colheita, 15)).toBe(true);
    });

    test('deve retornar true quando o intervalo for exatamente igual à carência (caso de borda)', () => {
      const aplicacao = new Date('2026-01-01');
      const colheita = new Date('2026-01-15');
      expect(gestao.validarCarenciaAplicacao(aplicacao, colheita, 14)).toBe(true);
    });

    test('deve retornar false quando a carência não for respeitada', () => {
      const aplicacao = new Date('2026-01-01');
      const colheita = new Date('2026-01-05');
      expect(gestao.validarCarenciaAplicacao(aplicacao, colheita, 14)).toBe(false);
    });

    test('deve lançar erro quando dataAplicacao for inválida', () => {
      expect(() => gestao.validarCarenciaAplicacao(new Date('data-invalida'), new Date(), 10)).toThrow(Error);
    });

    test('deve lançar erro quando dataColheitaPrevista for anterior a dataAplicacao', () => {
      const aplicacao = new Date('2026-01-20');
      const colheita = new Date('2026-01-01');
      expect(() => gestao.validarCarenciaAplicacao(aplicacao, colheita, 5)).toThrow(Error);
    });
  });

  describe('calcularNecessidadeAdubo', () => {
    test('deve calcular corretamente a necessidade de adubo no caminho feliz', () => {
      expect(gestao.calcularNecessidadeAdubo(10, 50)).toBe(500);
    });

    test('deve retornar zero quando kgPorHectare for zero (caso de borda)', () => {
      expect(gestao.calcularNecessidadeAdubo(10, 0)).toBe(0);
    });

    test('deve lançar erro quando areaHectares for zero', () => {
      expect(() => gestao.calcularNecessidadeAdubo(0, 50)).toThrow(Error);
    });

    test('deve lançar erro quando kgPorHectare for negativo', () => {
      expect(() => gestao.calcularNecessidadeAdubo(10, -50)).toThrow(Error);
    });
  });

  // ==========================================================
  // Conversão de unidades
  // ==========================================================

  describe('converterSacasParaToneladas', () => {
    test('deve converter corretamente sacas para toneladas no caminho feliz', () => {
      expect(gestao.converterSacasParaToneladas(100)).toBe(6);
    });

    test('deve retornar zero quando sacas for zero (caso de borda)', () => {
      expect(gestao.converterSacasParaToneladas(0)).toBe(0);
    });

    test('deve lançar erro quando sacas for negativo', () => {
      expect(() => gestao.converterSacasParaToneladas(-10)).toThrow(Error);
    });

    test('deve lançar erro quando pesoSacaKg for zero', () => {
      expect(() => gestao.converterSacasParaToneladas(100, 0)).toThrow(Error);
    });
  });

  describe('converterToneladasParaSacas', () => {
    test('deve converter corretamente toneladas para sacas no caminho feliz', () => {
      expect(gestao.converterToneladasParaSacas(6)).toBe(100);
    });

    test('deve retornar zero quando toneladas for zero (caso de borda)', () => {
      expect(gestao.converterToneladasParaSacas(0)).toBe(0);
    });

    test('deve lançar erro quando toneladas for negativo', () => {
      expect(() => gestao.converterToneladasParaSacas(-6)).toThrow(Error);
    });

    test('deve lançar erro quando pesoSacaKg for negativo', () => {
      expect(() => gestao.converterToneladasParaSacas(6, -60)).toThrow(Error);
    });
  });

  describe('converterHectaresParaAlqueires', () => {
    test('deve converter corretamente hectares para alqueires no caminho feliz', () => {
      expect(gestao.converterHectaresParaAlqueires(24.2)).toBeCloseTo(10, 5);
    });

    test('deve retornar zero quando hectares for zero (caso de borda)', () => {
      expect(gestao.converterHectaresParaAlqueires(0)).toBe(0);
    });

    test('deve lançar erro quando hectares for negativo', () => {
      expect(() => gestao.converterHectaresParaAlqueires(-1)).toThrow(Error);
    });

    test('deve lançar erro quando hectares não for um número', () => {
      expect(() => gestao.converterHectaresParaAlqueires('dez')).toThrow(Error);
    });
  });

  describe('converterAlqueiresParaHectares', () => {
    test('deve converter corretamente alqueires para hectares no caminho feliz', () => {
      expect(gestao.converterAlqueiresParaHectares(10)).toBeCloseTo(24.2, 5);
    });

    test('deve retornar zero quando alqueires for zero (caso de borda)', () => {
      expect(gestao.converterAlqueiresParaHectares(0)).toBe(0);
    });

    test('deve lançar erro quando alqueires for negativo', () => {
      expect(() => gestao.converterAlqueiresParaHectares(-1)).toThrow(Error);
    });

    test('deve lançar erro quando alqueires não for um número', () => {
      expect(() => gestao.converterAlqueiresParaHectares(null)).toThrow(Error);
    });
  });

  // ==========================================================
  // Safra e ciclo
  // ==========================================================

  describe('calcularDiasParaColheita', () => {
    test('deve calcular corretamente a data prevista de colheita no caminho feliz', () => {
      const plantio = new Date('2026-01-01');
      const resultado = gestao.calcularDiasParaColheita(plantio, 90);
      expect(resultado).toEqual(new Date('2026-04-01'));
    });

    test('deve calcular corretamente com ciclo de 1 dia (caso de borda)', () => {
      const plantio = new Date('2026-01-01');
      const resultado = gestao.calcularDiasParaColheita(plantio, 1);
      expect(resultado).toEqual(new Date('2026-01-02'));
    });

    test('deve lançar erro quando dataPlantio for inválida', () => {
      expect(() => gestao.calcularDiasParaColheita(new Date('invalida'), 90)).toThrow(Error);
    });

    test('deve lançar erro quando cicloDiasCultura for zero ou negativo', () => {
      expect(() => gestao.calcularDiasParaColheita(new Date('2026-01-01'), 0)).toThrow(Error);
    });
  });

  describe('classificarEstagioSafra', () => {
    test('deve classificar como "floração" no caminho feliz', () => {
      expect(gestao.classificarEstagioSafra(30, 100)).toBe('floração');
    });

    test('deve classificar como "germinação" quando diasDesdePlantio for zero (caso de borda)', () => {
      expect(gestao.classificarEstagioSafra(0, 100)).toBe('germinação');
    });

    test('deve classificar como "colheita" quando diasDesdePlantio igual ao cicloTotal (caso de borda)', () => {
      expect(gestao.classificarEstagioSafra(100, 100)).toBe('colheita');
    });

    test('deve lançar erro quando diasDesdePlantio for negativo', () => {
      expect(() => gestao.classificarEstagioSafra(-1, 100)).toThrow(Error);
    });

    test('deve lançar erro quando cicloTotal for zero', () => {
      expect(() => gestao.classificarEstagioSafra(10, 0)).toThrow(Error);
    });
  });

  describe('verificarJanelaPlantio', () => {
    test('deve retornar true quando a data estiver dentro da janela no caminho feliz', () => {
      const atual = new Date('2026-03-15');
      const inicio = new Date('2026-03-01');
      const fim = new Date('2026-03-31');
      expect(gestao.verificarJanelaPlantio(atual, inicio, fim)).toBe(true);
    });

    test('deve retornar true quando a data for exatamente o limite da janela (caso de borda)', () => {
      const inicio = new Date('2026-03-01');
      const fim = new Date('2026-03-31');
      expect(gestao.verificarJanelaPlantio(fim, inicio, fim)).toBe(true);
    });

    test('deve retornar false quando a data estiver fora da janela', () => {
      const atual = new Date('2026-04-01');
      const inicio = new Date('2026-03-01');
      const fim = new Date('2026-03-31');
      expect(gestao.verificarJanelaPlantio(atual, inicio, fim)).toBe(false);
    });

    test('deve lançar erro quando inicioJanela for posterior a fimJanela', () => {
      const inicio = new Date('2026-04-01');
      const fim = new Date('2026-03-01');
      expect(() => gestao.verificarJanelaPlantio(new Date('2026-03-15'), inicio, fim)).toThrow(Error);
    });
  });

  describe('calcularRotacaoCultura', () => {
    test('deve sugerir a próxima cultura evitando repetir a última no caminho feliz', () => {
      expect(gestao.calcularRotacaoCultura(['Milho', 'Soja'])).toBe('Milho');
    });

    test('deve sugerir a primeira cultura padrão quando o histórico tiver apenas um item desconhecido (caso de borda)', () => {
      expect(gestao.calcularRotacaoCultura(['Cana-de-açúcar'])).toBe('Soja');
    });

    test('deve sugerir a cultura seguinte de forma cíclica ao final da lista padrão', () => {
      expect(gestao.calcularRotacaoCultura(['Trigo'])).toBe('Soja');
    });

    test('deve lançar erro quando o histórico estiver vazio', () => {
      expect(() => gestao.calcularRotacaoCultura([])).toThrow(Error);
    });

    test('deve lançar erro quando o histórico contiver valores não string', () => {
      expect(() => gestao.calcularRotacaoCultura(['Soja', 123])).toThrow(Error);
    });
  });

  // ==========================================================
  // Frete e comercialização
  // ==========================================================

  describe('calcularFretePorSaca', () => {
    test('deve calcular corretamente o custo do frete no caminho feliz', () => {
      expect(gestao.calcularFretePorSaca(100, 0.5, 200)).toBe(10000);
    });

    test('deve retornar zero quando distanciaKm for zero (caso de borda)', () => {
      expect(gestao.calcularFretePorSaca(0, 0.5, 200)).toBe(0);
    });

    test('deve lançar erro quando quantidadeSacas for zero ou negativa', () => {
      expect(() => gestao.calcularFretePorSaca(100, 0.5, 0)).toThrow(Error);
    });

    test('deve lançar erro quando valorPorKmPorSaca for negativo', () => {
      expect(() => gestao.calcularFretePorSaca(100, -0.5, 200)).toThrow(Error);
    });
  });

  describe('calcularValorVendaSafra', () => {
    test('deve calcular corretamente o valor de venda no caminho feliz', () => {
      expect(gestao.calcularValorVendaSafra(1000, 150)).toBe(150000);
    });

    test('deve retornar zero quando quantidadeSacas for zero (caso de borda)', () => {
      expect(gestao.calcularValorVendaSafra(0, 150)).toBe(0);
    });

    test('deve lançar erro quando quantidadeSacas for negativa', () => {
      expect(() => gestao.calcularValorVendaSafra(-10, 150)).toThrow(Error);
    });

    test('deve lançar erro quando precoSacaAtual for negativo', () => {
      expect(() => gestao.calcularValorVendaSafra(1000, -150)).toThrow(Error);
    });
  });

  describe('calcularMargemLucro', () => {
    test('deve calcular corretamente a margem de lucro no caminho feliz', () => {
      expect(gestao.calcularMargemLucro(1000, 600)).toBe(40);
    });

    test('deve retornar zero quando custoTotalProducao igual a receitaBruta (caso de borda)', () => {
      expect(gestao.calcularMargemLucro(1000, 1000)).toBe(0);
    });

    test('deve lançar erro quando receitaBruta for zero (divisão por zero)', () => {
      expect(() => gestao.calcularMargemLucro(0, 100)).toThrow(Error);
    });

    test('deve lançar erro quando custoTotalProducao for negativo', () => {
      expect(() => gestao.calcularMargemLucro(1000, -100)).toThrow(Error);
    });
  });

  describe('converterUnidadeDefensivo', () => {
    test('deve converter corretamente mL para L no caminho feliz', () => {
      expect(gestao.converterUnidadeDefensivo(1500, 'mL', 'L')).toBe(1.5);
    });

    test('deve converter corretamente g para kg no caminho feliz', () => {
      expect(gestao.converterUnidadeDefensivo(2000, 'g', 'kg')).toBe(2);
    });

    test('deve retornar o mesmo valor quando origem e destino forem iguais (caso de borda)', () => {
      expect(gestao.converterUnidadeDefensivo(0, 'L', 'L')).toBe(0);
    });

    test('deve lançar erro quando a unidade não for suportada', () => {
      expect(() => gestao.converterUnidadeDefensivo(10, 'L', 'kg')).toThrow(Error);
    });

    test('deve lançar erro quando o valor for negativo', () => {
      expect(() => gestao.converterUnidadeDefensivo(-10, 'mL', 'L')).toThrow(Error);
    });
  });
});
