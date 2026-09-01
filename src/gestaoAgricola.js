/**
 * Classe utilitária para cálculos de Gestão Agrícola.
 * Todos os métodos são funções puras: não dependem de banco de dados,
 * API externa ou `new Date()` interno — datas são sempre recebidas por parâmetro.
 */
class GestaoAgricola {
  // ==========================================================
  // Produtividade e área
  // ==========================================================

  /**
   * Calcula a produtividade por hectare.
   * @param {number} sacasColhidas - Quantidade de sacas colhidas (>= 0).
   * @param {number} areaHectares - Área em hectares (> 0).
   * @returns {number} Produtividade (sacas/hectare).
   */
  calcularProdutividadePorHectare(sacasColhidas, areaHectares) {
    if (typeof sacasColhidas !== 'number' || Number.isNaN(sacasColhidas) || sacasColhidas < 0) {
      throw new Error('sacasColhidas deve ser um número maior ou igual a zero');
    }
    if (typeof areaHectares !== 'number' || Number.isNaN(areaHectares) || areaHectares <= 0) {
      throw new Error('areaHectares deve ser um número maior que zero');
    }
    return sacasColhidas / areaHectares;
  }

  /**
   * Calcula a área total de plantio somando os talhões.
   * @param {number[]} talhoes - Array de áreas em hectares (cada uma >= 0).
   * @returns {number} Área total em hectares.
   */
  calcularAreaTotalPlantio(talhoes) {
    if (!Array.isArray(talhoes) || talhoes.length === 0) {
      throw new Error('talhoes deve ser um array não vazio');
    }
    if (talhoes.some((t) => typeof t !== 'number' || Number.isNaN(t) || t < 0)) {
      throw new Error('todos os talhoes devem ser números maiores ou iguais a zero');
    }
    return talhoes.reduce((total, atual) => total + atual, 0);
  }

  /**
   * Estima a produção total a partir da produtividade média e da área.
   * @param {number} produtividadeMedia - Produtividade média (sacas/hectare, >= 0).
   * @param {number} areaHectares - Área em hectares (>= 0).
   * @returns {number} Produção total estimada (sacas).
   */
  estimarProducaoTotal(produtividadeMedia, areaHectares) {
    if (typeof produtividadeMedia !== 'number' || Number.isNaN(produtividadeMedia) || produtividadeMedia < 0) {
      throw new Error('produtividadeMedia deve ser um número maior ou igual a zero');
    }
    if (typeof areaHectares !== 'number' || Number.isNaN(areaHectares) || areaHectares < 0) {
      throw new Error('areaHectares deve ser um número maior ou igual a zero');
    }
    return produtividadeMedia * areaHectares;
  }

  /**
   * Calcula o percentual de perda na colheita.
   * @param {number} producaoEstimada - Produção estimada (> 0).
   * @param {number} producaoReal - Produção real colhida (>= 0).
   * @returns {number} Percentual de perda (pode ser negativo caso a produção real supere a estimada).
   */
  calcularPerdaColheita(producaoEstimada, producaoReal) {
    if (typeof producaoEstimada !== 'number' || Number.isNaN(producaoEstimada) || producaoEstimada <= 0) {
      throw new Error('producaoEstimada deve ser um número maior que zero');
    }
    if (typeof producaoReal !== 'number' || Number.isNaN(producaoReal) || producaoReal < 0) {
      throw new Error('producaoReal deve ser um número maior ou igual a zero');
    }
    return ((producaoEstimada - producaoReal) / producaoEstimada) * 100;
  }

  // ==========================================================
  // Defensivos e insumos
  // ==========================================================

  /**
   * Calcula a dosagem total de defensivo necessária.
   * @param {number} litrosPorHectare - Dosagem por hectare (>= 0).
   * @param {number} areaHectares - Área em hectares (> 0).
   * @returns {number} Total de litros de defensivo.
   */
  calcularDosagemDefensivo(litrosPorHectare, areaHectares) {
    if (typeof litrosPorHectare !== 'number' || Number.isNaN(litrosPorHectare) || litrosPorHectare < 0) {
      throw new Error('litrosPorHectare deve ser um número maior ou igual a zero');
    }
    if (typeof areaHectares !== 'number' || Number.isNaN(areaHectares) || areaHectares <= 0) {
      throw new Error('areaHectares deve ser um número maior que zero');
    }
    return litrosPorHectare * areaHectares;
  }

  /**
   * Calcula o custo total de uma lista de insumos.
   * @param {{quantidade: number, precoUnitario: number}[]} itens - Itens comprados.
   * @returns {number} Custo total.
   */
  calcularCustoInsumos(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new Error('itens deve ser um array não vazio');
    }
    const invalido = itens.some(
      (item) =>
        !item ||
        typeof item.quantidade !== 'number' ||
        typeof item.precoUnitario !== 'number' ||
        Number.isNaN(item.quantidade) ||
        Number.isNaN(item.precoUnitario) ||
        item.quantidade < 0 ||
        item.precoUnitario < 0
    );
    if (invalido) {
      throw new Error('cada item deve conter quantidade e precoUnitario numéricos e maiores ou iguais a zero');
    }
    return itens.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);
  }

  /**
   * Verifica se o período entre aplicação de defensivo e colheita respeita a carência.
   * @param {Date} dataAplicacao - Data da aplicação.
   * @param {Date} dataColheitaPrevista - Data prevista da colheita.
   * @param {number} diasCarencia - Dias mínimos de carência exigidos (>= 0).
   * @returns {boolean} true se a carência é respeitada.
   */
  validarCarenciaAplicacao(dataAplicacao, dataColheitaPrevista, diasCarencia) {
    this._validarData(dataAplicacao, 'dataAplicacao');
    this._validarData(dataColheitaPrevista, 'dataColheitaPrevista');
    if (typeof diasCarencia !== 'number' || Number.isNaN(diasCarencia) || diasCarencia < 0) {
      throw new Error('diasCarencia deve ser um número maior ou igual a zero');
    }
    if (dataColheitaPrevista.getTime() < dataAplicacao.getTime()) {
      throw new Error('dataColheitaPrevista não pode ser anterior a dataAplicacao');
    }
    const diffDias = (dataColheitaPrevista.getTime() - dataAplicacao.getTime()) / (1000 * 60 * 60 * 24);
    return diffDias >= diasCarencia;
  }

  /**
   * Calcula a necessidade total de adubo.
   * @param {number} areaHectares - Área em hectares (> 0).
   * @param {number} kgPorHectare - Quantidade de adubo por hectare (>= 0).
   * @returns {number} Total de adubo necessário em kg.
   */
  calcularNecessidadeAdubo(areaHectares, kgPorHectare) {
    if (typeof areaHectares !== 'number' || Number.isNaN(areaHectares) || areaHectares <= 0) {
      throw new Error('areaHectares deve ser um número maior que zero');
    }
    if (typeof kgPorHectare !== 'number' || Number.isNaN(kgPorHectare) || kgPorHectare < 0) {
      throw new Error('kgPorHectare deve ser um número maior ou igual a zero');
    }
    return areaHectares * kgPorHectare;
  }

  // ==========================================================
  // Conversão de unidades
  // ==========================================================

  /**
   * Converte sacas para toneladas.
   * @param {number} sacas - Quantidade de sacas (>= 0).
   * @param {number} [pesoSacaKg=60] - Peso de cada saca em kg (> 0).
   * @returns {number} Quantidade em toneladas.
   */
  converterSacasParaToneladas(sacas, pesoSacaKg = 60) {
    if (typeof sacas !== 'number' || Number.isNaN(sacas) || sacas < 0) {
      throw new Error('sacas deve ser um número maior ou igual a zero');
    }
    if (typeof pesoSacaKg !== 'number' || Number.isNaN(pesoSacaKg) || pesoSacaKg <= 0) {
      throw new Error('pesoSacaKg deve ser um número maior que zero');
    }
    return (sacas * pesoSacaKg) / 1000;
  }

  /**
   * Converte toneladas para sacas.
   * @param {number} toneladas - Quantidade de toneladas (>= 0).
   * @param {number} [pesoSacaKg=60] - Peso de cada saca em kg (> 0).
   * @returns {number} Quantidade em sacas.
   */
  converterToneladasParaSacas(toneladas, pesoSacaKg = 60) {
    if (typeof toneladas !== 'number' || Number.isNaN(toneladas) || toneladas < 0) {
      throw new Error('toneladas deve ser um número maior ou igual a zero');
    }
    if (typeof pesoSacaKg !== 'number' || Number.isNaN(pesoSacaKg) || pesoSacaKg <= 0) {
      throw new Error('pesoSacaKg deve ser um número maior que zero');
    }
    return (toneladas * 1000) / pesoSacaKg;
  }

  /**
   * Converte hectares para alqueires (padrão paulista, 24.200 m²).
   * @param {number} hectares - Área em hectares (>= 0).
   * @returns {number} Área em alqueires paulistas.
   */
  converterHectaresParaAlqueires(hectares) {
    if (typeof hectares !== 'number' || Number.isNaN(hectares) || hectares < 0) {
      throw new Error('hectares deve ser um número maior ou igual a zero');
    }
    return (hectares * 10000) / 24200;
  }

  /**
   * Converte alqueires (padrão paulista, 24.200 m²) para hectares.
   * @param {number} alqueires - Área em alqueires paulistas (>= 0).
   * @returns {number} Área em hectares.
   */
  converterAlqueiresParaHectares(alqueires) {
    if (typeof alqueires !== 'number' || Number.isNaN(alqueires) || alqueires < 0) {
      throw new Error('alqueires deve ser um número maior ou igual a zero');
    }
    return (alqueires * 24200) / 10000;
  }

  // ==========================================================
  // Safra e ciclo
  // ==========================================================

  /**
   * Calcula a data prevista de colheita a partir da data de plantio e do ciclo da cultura.
   * @param {Date} dataPlantio - Data do plantio.
   * @param {number} cicloDiasCultura - Duração do ciclo em dias (> 0).
   * @returns {Date} Data prevista de colheita.
   */
  calcularDiasParaColheita(dataPlantio, cicloDiasCultura) {
    this._validarData(dataPlantio, 'dataPlantio');
    if (typeof cicloDiasCultura !== 'number' || Number.isNaN(cicloDiasCultura) || cicloDiasCultura <= 0) {
      throw new Error('cicloDiasCultura deve ser um número maior que zero');
    }
    return new Date(dataPlantio.getTime() + cicloDiasCultura * 24 * 60 * 60 * 1000);
  }

  /**
   * Classifica o estágio da safra com base nos dias desde o plantio e no ciclo total.
   * @param {number} diasDesdePlantio - Dias decorridos desde o plantio (>= 0).
   * @param {number} cicloTotal - Duração total do ciclo em dias (> 0).
   * @returns {"germinação"|"floração"|"maturação"|"colheita"} Estágio atual da safra.
   */
  classificarEstagioSafra(diasDesdePlantio, cicloTotal) {
    if (typeof diasDesdePlantio !== 'number' || Number.isNaN(diasDesdePlantio) || diasDesdePlantio < 0) {
      throw new Error('diasDesdePlantio deve ser um número maior ou igual a zero');
    }
    if (typeof cicloTotal !== 'number' || Number.isNaN(cicloTotal) || cicloTotal <= 0) {
      throw new Error('cicloTotal deve ser um número maior que zero');
    }
    const proporcao = diasDesdePlantio / cicloTotal;
    if (proporcao >= 1) return 'colheita';
    if (proporcao >= 0.75) return 'maturação';
    if (proporcao >= 0.25) return 'floração';
    return 'germinação';
  }

  /**
   * Verifica se a data atual está dentro da janela recomendada de plantio.
   * @param {Date} dataAtual - Data a ser verificada.
   * @param {Date} inicioJanela - Início da janela de plantio.
   * @param {Date} fimJanela - Fim da janela de plantio.
   * @returns {boolean} true se dataAtual está dentro da janela (inclusive).
   */
  verificarJanelaPlantio(dataAtual, inicioJanela, fimJanela) {
    this._validarData(dataAtual, 'dataAtual');
    this._validarData(inicioJanela, 'inicioJanela');
    this._validarData(fimJanela, 'fimJanela');
    if (inicioJanela.getTime() > fimJanela.getTime()) {
      throw new Error('inicioJanela não pode ser posterior a fimJanela');
    }
    return dataAtual.getTime() >= inicioJanela.getTime() && dataAtual.getTime() <= fimJanela.getTime();
  }

  /**
   * Sugere a próxima cultura a ser plantada evitando repetir a última utilizada.
   * @param {string[]} historicoCulturas - Histórico de culturas plantadas, em ordem cronológica.
   * @returns {string} Cultura sugerida para o próximo plantio.
   */
  calcularRotacaoCultura(historicoCulturas) {
    if (!Array.isArray(historicoCulturas) || historicoCulturas.length === 0) {
      throw new Error('historicoCulturas deve ser um array não vazio');
    }
    if (historicoCulturas.some((c) => typeof c !== 'string' || c.trim() === '')) {
      throw new Error('historicoCulturas deve conter apenas strings não vazias');
    }
    const CULTURAS_PADRAO = ['Soja', 'Milho', 'Algodão', 'Trigo'];
    const ultimaCultura = historicoCulturas[historicoCulturas.length - 1];
    const indice = CULTURAS_PADRAO.indexOf(ultimaCultura);
    if (indice === -1) {
      return CULTURAS_PADRAO[0];
    }
    return CULTURAS_PADRAO[(indice + 1) % CULTURAS_PADRAO.length];
  }

  // ==========================================================
  // Frete e comercialização
  // ==========================================================

  /**
   * Calcula o custo de frete por saca transportada.
   * @param {number} distanciaKm - Distância em quilômetros (>= 0).
   * @param {number} valorPorKmPorSaca - Valor cobrado por km por saca (>= 0).
   * @param {number} quantidadeSacas - Quantidade de sacas transportadas (> 0).
   * @returns {number} Custo total do frete.
   */
  calcularFretePorSaca(distanciaKm, valorPorKmPorSaca, quantidadeSacas) {
    if (typeof distanciaKm !== 'number' || Number.isNaN(distanciaKm) || distanciaKm < 0) {
      throw new Error('distanciaKm deve ser um número maior ou igual a zero');
    }
    if (typeof valorPorKmPorSaca !== 'number' || Number.isNaN(valorPorKmPorSaca) || valorPorKmPorSaca < 0) {
      throw new Error('valorPorKmPorSaca deve ser um número maior ou igual a zero');
    }
    if (typeof quantidadeSacas !== 'number' || Number.isNaN(quantidadeSacas) || quantidadeSacas <= 0) {
      throw new Error('quantidadeSacas deve ser um número maior que zero');
    }
    return distanciaKm * valorPorKmPorSaca * quantidadeSacas;
  }

  /**
   * Calcula o valor total de venda da safra.
   * @param {number} quantidadeSacas - Quantidade de sacas vendidas (>= 0).
   * @param {number} precoSacaAtual - Preço atual da saca (>= 0).
   * @returns {number} Valor total da venda.
   */
  calcularValorVendaSafra(quantidadeSacas, precoSacaAtual) {
    if (typeof quantidadeSacas !== 'number' || Number.isNaN(quantidadeSacas) || quantidadeSacas < 0) {
      throw new Error('quantidadeSacas deve ser um número maior ou igual a zero');
    }
    if (typeof precoSacaAtual !== 'number' || Number.isNaN(precoSacaAtual) || precoSacaAtual < 0) {
      throw new Error('precoSacaAtual deve ser um número maior ou igual a zero');
    }
    return quantidadeSacas * precoSacaAtual;
  }

  /**
   * Calcula a margem de lucro percentual.
   * @param {number} receitaBruta - Receita bruta obtida (> 0).
   * @param {number} custoTotalProducao - Custo total de produção (>= 0).
   * @returns {number} Margem de lucro percentual.
   */
  calcularMargemLucro(receitaBruta, custoTotalProducao) {
    if (typeof receitaBruta !== 'number' || Number.isNaN(receitaBruta) || receitaBruta <= 0) {
      throw new Error('receitaBruta deve ser um número maior que zero');
    }
    if (typeof custoTotalProducao !== 'number' || Number.isNaN(custoTotalProducao) || custoTotalProducao < 0) {
      throw new Error('custoTotalProducao deve ser um número maior ou igual a zero');
    }
    return ((receitaBruta - custoTotalProducao) / receitaBruta) * 100;
  }

  /**
   * Converte valores entre unidades de defensivos agrícolas (volume: mL/L; massa: g/kg).
   * @param {number} valor - Valor a converter (>= 0).
   * @param {"mL"|"L"|"g"|"kg"} unidadeOrigem - Unidade de origem.
   * @param {"mL"|"L"|"g"|"kg"} unidadeDestino - Unidade de destino.
   * @returns {number} Valor convertido.
   */
  converterUnidadeDefensivo(valor, unidadeOrigem, unidadeDestino) {
    if (typeof valor !== 'number' || Number.isNaN(valor) || valor < 0) {
      throw new Error('valor deve ser um número maior ou igual a zero');
    }
    const UNIDADES_VOLUME = ['mL', 'L'];
    const UNIDADES_MASSA = ['g', 'kg'];
    const todasUnidades = [...UNIDADES_VOLUME, ...UNIDADES_MASSA];

    if (!todasUnidades.includes(unidadeOrigem) || !todasUnidades.includes(unidadeDestino)) {
      throw new Error('unidade de conversão não suportada. Use mL, L, g ou kg');
    }

    if (unidadeOrigem === unidadeDestino) {
      return valor;
    }

    const origemEhVolume = UNIDADES_VOLUME.includes(unidadeOrigem);
    const destinoEhVolume = UNIDADES_VOLUME.includes(unidadeDestino);
    if (origemEhVolume !== destinoEhVolume) {
      throw new Error('não é possível converter entre unidades de volume e massa');
    }

    if (origemEhVolume) {
      return unidadeOrigem === 'mL' ? valor / 1000 : valor * 1000;
    }
    return unidadeOrigem === 'g' ? valor / 1000 : valor * 1000;
  }

  // ==========================================================
  // Auxiliar interno
  // ==========================================================

  /**
   * Valida se o valor recebido é uma instância de Date válida.
   * @param {Date} data - Valor a validar.
   * @param {string} nomeParametro - Nome do parâmetro, usado na mensagem de erro.
   * @returns {void}
   */
  _validarData(data, nomeParametro) {
    if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
      throw new Error(`${nomeParametro} deve ser uma data válida`);
    }
  }
}

module.exports = GestaoAgricola;
