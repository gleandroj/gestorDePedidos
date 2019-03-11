#language: pt

Funcionalidade: Manter Programação
  Com o objetivo de inserir, alterar, visualziar e inativar uma Programação no sistema
  Como um "Administrador" do sistema
  Eu quero poder inserir, alterar, visualziar e inativar uma Programação dentro do sistema

  @positivo
  Cenário: Gerenciar Programação
    Dado eu esteja autenticado
    E tenha permissão de "Administrador"
    Quando clicar no botão "Gerenciar Programação" no menu principal
    Então o sistema deve me redirecionar para página de "Gerenciar Programação"
    E deve ser apresentada a lista das Programações cadastradas

  Regras de Apresentação:
  - Serão exibidas as Programações agrupadas por edições em forma de lista
  - Serão exibidas apenas edições que possuem programações vinculadas
  - Serão ordenadas por data de cadastro do maior para o menor

  @positivo
  Cenário: Cadastrar Programação
    Dado que eu tenha realizado o cenário "Gerenciar Programação"
    Quando eu clicar no botão "Cadastrar Programação"
    Então o sistema deve me apresentar o formulário de "Cadastro de Programação"

  @positivo
  Cenário: Cadastrar Programação - Salvar Programação
    Dado que eu tenha realizado o cenário "Cadastrar Programação"
    E tenha preenchido todos os campos do Programação corretamente
    Quando eu clicar no botão "Salvar"
    Então o sistema deve me redirecionar para página de "Gerenciar Programação"
    E apresentar a mensagem "Programação cadastrada com sucesso!"

  @positivo
  Cenário: Editar Programação
    Dado que eu tenha realizado o cenário "Gerenciar Programação"
    Quando eu clicar no botão "Editar Programação" de algum Programação
    Então o sistema deve me apresentar o formulário de "Editar Programação"

  @positivo
  Cenário: Editar Programação - Salvar Programação
    Dado que eu tenha realizado o cenário "Editar Programação"
    E tenha preenchido todos os campos da Programação corretamente
    Quando eu clicar no botão "Salvar"
    Então o sistema deve me redirecionar para página de "Gerenciar Programação"
    E apresentar a mensagem "Programação atualizada com sucesso!"

  @positivo
  Cenário: Deletar Programação
    Dado que eu tenha realizado o cenário "Gerenciar Programação"
    Quando eu clicar no botão (icone delete) "Deletar" de alguma Programação
    Então o sistema deve apresentar uma caixa de dialogo com a mensagem "Tem certeza que deseja deletar a programação?"
    E os botões "Cancelar" e "Confirmar"
    E caso o usuário clique no botão "Confirmar" o sistema deve deletar a programação
    E apresentar a mensagem "Programação deletada com sucesso!"