#language: pt

Funcionalidade: Visualizar Participantes
  Com o objetivo de visualizar os participantes de uma Programação no sistema
  Como um "Administrador" do sistema
  Eu quero poder visualziar a lista de participantes de uma Programação dentro do sistema

  @positivo
  Cenário: Visualizar Participantes
    Dado que eu tenha realizado o cenário "Visualizar Programação (US004)"
    Quando eu clicar no botão (icone people) "Participantes"
    Então o sisteam deve me redirecionar para a "Página de Participantes"
    E apresentar a tabela de participantes de acordo com o exemplo

  Exemplos:
  | Matrícula | Nome Completo | Vínculo | Sexo | Avaliou o Programação? | Horário do Check-in | Confirmado por |
  | 1410732 | Gabriel Siqueira | Aluno | Masculino | Sim | 07/07/2018 10:10:10 | Administrador |

  @positivo
  Cenário: Visualizar Participantes - Ordenar dados
    Dado que eu tenha realizado o cenário "Visualizar Participantes"
    Quando eu clicar uma vez em algum cabeçalho da tabela
    Então o sisteam deve ordenar os dados da tabela de acordo com as regras

  Regras:
  - 1º clique deve ordernar crescente
  - 2º clique deve ordernar decrescente
  - 3º clique deve remover a ordenação (deixar a padrão)
  - ordenação padrão por ID crescente


  @positivo
  Cenário: Visualizar Participantes - Pesquisar
    Dado que eu tenha realizado o cenário "Visualizar Participantes"
    Quando eu digitar algum texto no campo "Pesquisar"
    Então o sisteam deve realizar a pesquisa nos campos

  Campos:
  - Matrícula
  - Nome
  - Vinculo
  - Sexo
  - Horário do Check-in
  - Confirmado por

  @positivo
  Cenário: Visualizar Participantes - Exportar Dados
    Dado que eu tenha realizado o cenário "Visualizar Participantes"
    Quando eu clicar no botão (icone cloud_download) "Exportar para Excel"
    Então o sistema deve exportar todos os participantes para o formato XLS

  Exemplos:
  | Matrícula | Nome Completo | Vínculo | Sexo | Horário do Check-in | Confirmado por |
  | 1410732 | Gabriel Siqueira | Aluno | Masculino | 07/07/2018 10:10:10 | Administrador |