#language: pt

Funcionalidade: Programação
  Com o objetivo de listar a programação que irá acontecer no sites na instituição
  Como um usuário
  Eu quero visualizar a programação que irá acontecer no sites para que eu visualizar os detalhes dos dias

  @positivo
  Cenário: Programação - Dias Disponíveis
    Dado que eu esteja autenticado
    Quando o sistema me redirecionar para "Página de Programação"
    Então eu posso visualizar a programação que irá acontecer o evento sites na instituição

  Regras de Apresentação:
  - Serão exibidas as Programações agrupadas por edições em forma de lista
  - Serão exibidas apenas edições que possuem programações vinculadas
  - Serão ordenadas por data de cadastro do maior para o menor

  @positivo
  Cenário: Programação - Nenhuma programação cadastrada
    Dado que eu esteja autenticado e não existe nenhum dia Cadastrado no sistema
    Quando o sistema me redirecionar para "Página de Programação"
    Então o sistema deve representar uma lista vazia com a mensagem "Nenhuma programação disponível."

  @positivo
  Cenário: Solicitar Check-in
    Dado que eu esteja na página de "Programação"
    E que o dia de hoje seja o mesmo dia cadastrado
    Quando eu clicar no botão "Solicitar Check-in"
    Então o sistema deve apresentar o QRCode do token referente ao Check-in da programação

  Regras:
  - Deve ser gerado um token unico na solicitação do check-in
  - O token deve expirar em 30 segundos

  @positivo
  Cenário: Solicitar Check-in - Atualizar Token
    Dado que eu tenha realizado o cenário "Solicitar Check-in"
    E no exato momento em que o token expirar (30 segundos após sua geração)
    Então o sistema deve solicitar um novo token
    E apresentar o QRCode do token referente ao Check-in da programação

  @positivo
  Cenário: Avaliar Dia
    Dado que eu esteja na página de "Programação"
    E tenha realizado check-in no dia
    E a avaliação esteja disponível
    Quando eu clicar no botão "Avaliar Evento"
    Então o sistema deve apresentar o formulário de "Avaliação do dia do Evento"

  Regras da avaliação:
  - A avaliação do evento será por dia (Ex: Evento começa dia 1 e vai até dia 3, poderá ter 3 avaliações, uma para cada dia)
  - O dia do evento só tera avaliação se no cadastro do mesmo tiver sido cadastrado o formulário de avaliação do dia do evento
  - A avaliação do evento só podera ser realizada por usuários que participaram do evento e realizaram o Check-in do dia
  - Só é possível avaliar uma vez cada dia do evento

  @positivo
  Cenário: Avaliar Dia - Programação Fora de Data
    Dado que eu esteja na página de "Programação"
    E a programação não esteja disponível
    Quando eu clicar no botão "Avaliar Evento"
    Então o sistema deve apresentar o a mensagem "Programação fora de data."

  @positivo
  Cenário: Avaliar Dia - Submeter Formulário
    Dado que eu esteja no formulário de "Avaliação do dia do Evento"
    E tenha preenchido todos campos da avaliação
    Quando eu clicar no botão "Avaliar"
    Então o sistema deve salvar minha avaliação para o dia do evento
    E apresentar a mensagem "Avaliação realizada, obrigado!"