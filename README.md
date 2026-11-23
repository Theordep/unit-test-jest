# JEST Unit Tests

## GitHub Actions

[![Build and Tests](https://github.com/ugioni/unit-tests-jest/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/ugioni/unit-tests-jest/actions/workflows/node.js.yml)

## SonarCloud

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ugioni_unit-tests-jest&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ugioni_unit-tests-jest)

## Getting Started

In order to execute this project you must follow the steps below:

1. Install [Node JS](https://nodejs.org/) (version >= 20.x)
1. Run `npm install` to install all the project dependencies
1. Run `npm run test` to execute the entire test suite
1. Run `npm run coverage` to execute the entire test suite with coverage

All execution artifacts can be found in `./coverage`, if you want to remove these files run `npm run clean`.

## Project Structure
</br>
<ul>
    <li>src: source code</li>
    <li>test: unit test files</li>
</ul>

## Testes de mutação com Stryker

Este projeto usa o [Stryker Mutator](https://stryker-mutator.io/) para avaliar a **qualidade** dos testes unitários, e não só a cobertura.

### O que é teste de mutação

A cobertura de código mostra quais linhas foram executadas pelos testes, mas não mostra se os testes **verificam** o resultado. O Stryker faz pequenas alterações no código-fonte, chamadas **mutantes**: troca `<` por `<=`, `||` por `&&`, apaga um `if`, troca uma string por `""`. Depois roda os testes contra cada mutante:

- **Morto (killed):** algum teste falhou. Os testes perceberam a alteração.
- **Sobrevivente (survived):** todos os testes passaram mesmo com o código alterado. Isso indica um teste fraco ou faltando.
- **Sem cobertura (no coverage):** nenhum teste executa aquele trecho.

**Nota de mutação = mutantes mortos ÷ total de mutantes.**

### Como executar

```bash
npm install
npm run mutation
```

O relatório interativo é gerado em `reports/mutation/mutation.html`. A configuração fica em [`stryker.config.json`](stryker.config.json): runner do Jest, `coverageAnalysis: perTest` e todos os arquivos de `src/`. O build falha se a nota ficar abaixo de 90%.

O workflow do GitHub Actions também roda os testes de mutação e publica o relatório HTML como artefato.

### Resultado

Antes e depois de usar o relatório do Stryker para melhorar os testes:

| Arquivo | Nota antes | Nota depois |
|---|---:|---:|
| anagram.js | 84,62% | 84,62% |
| banco.js | 96,08% | 100% |
| calculator.js | 100% | 100% |
| carro.js | 90,00% | 90,00% |
| cnh.js | 100% | 100% |
| contaBancaria.js | 85,51% | 97,83% |
| gestaoAgricola.js | 70,24% | 99,67% |
| lista.js | 100% | 100% |
| pessoa.js | 100% | 100% |
| textoUtils.js | 97,47% | 97,47% |
| userService.js | 100% | 100% |
| utilitarios.js | 90,24% | 98,78% |
| **Total** | **78,77%** (205 sobreviventes) | **98,93%** (10 sobreviventes) |

Antes, a **cobertura de linhas já era de 99%**, mas 205 mutantes sobreviviam. Ou seja, quase todo o código era executado pelos testes, mas boa parte dele não era realmente verificada.

### Por que os mutantes sobreviviam e o que foi feito

1. **Erros verificados só com `toThrow(Error)`.** Qualquer erro passava no teste, até um `TypeError` acidental, e trocar a mensagem por `""` não quebrava nada. Os testes passaram a checar a mensagem exata.
2. **`NaN` e tipos errados nunca testados.** Remover `Number.isNaN(x)` ou `typeof x !== 'number'` das validações não quebrava nenhum teste. Foram adicionados casos com `NaN` e com strings numéricas (`'10'`).
3. **Valores de borda.** Trocar `x < 0` por `x <= 0`, ou `>= 0.75` por `> 0.75`, sobrevivia porque ninguém testava exatamente `0`, `75%` ou o primeiro dia da janela de plantio. Foram adicionados testes nos limites.
4. **Ramos sem caso negativo.** Por exemplo, `ehPalindromo` só era testado com um palíndromo, então substituir o retorno por `true` passava. O mesmo acontecia com `estaAtiva`, `saldoNegativo` e `verificarJanelaPlantio`.

Para o `GestaoAgricola`, foi criado o arquivo [`test/gestaoAgricola.validacoes.test.js`](test/gestaoAgricola.validacoes.test.js). Ele usa uma tabela com as regras de cada parâmetro numérico (`>= 0` ou `> 0`) e gera automaticamente os casos de string, `NaN`, negativo e zero. Os demais testes foram adicionados aos arquivos existentes, marcados com o comentário *"Testes adicionados a partir do relatório de mutation testing"*. O total de testes foi de 158 para 325.

### Mutantes equivalentes (os 11 restantes)

Um **mutante equivalente** altera o código sem alterar o comportamento. Por isso nenhum teste consegue matá-lo. Os que restaram:

| Local | Mutação | Por que é equivalente |
|---|---|---|
| `anagram.js:6` | `.join("")` → `.join("Stryker was here!")` | As duas strings recebem o mesmo separador, então a comparação dá o mesmo resultado |
| `anagram.js:6` | `toLowerCase()` → `toUpperCase()` | As duas strings são convertidas para a mesma caixa |
| `carro.js:10` | `distancia > 0` → `distancia >= 0` | Somar `0` à quilometragem não muda nada |
| `textoUtils.js:62` | remove o `.trim()` | O `.filter(Boolean)` já descarta as strings vazias das pontas |
| `textoUtils.js:62` | `/\s+/` → `/\s/` | Pelo mesmo motivo, as strings vazias entre espaços são filtradas |
| `utilitarios.js:97` | `toLowerCase()` → `toUpperCase()` | A comparação com o texto invertido continua igual |
| `contaBancaria.js:98` e `:101` (3 mutantes) | remove as checagens `podeSacar` e `sucessoSaque` | `podeSacar` e `sacar` aplicam a mesma regra. A segunda checagem é código defensivo que nunca é alcançado |
| `gestaoAgricola.js:285` (2 mutantes) | remove o `if (indice === -1)` | Sem o `if`, `(-1 + 1) % 4` já resulta no índice `0` (`'Soja'`) |

Esses mutantes foram mantidos visíveis no relatório, em vez de ocultados com `// Stryker disable`. Na maioria dessas linhas, desativar o mutante também esconderia outros mutantes que os testes matam.

TEEESTE