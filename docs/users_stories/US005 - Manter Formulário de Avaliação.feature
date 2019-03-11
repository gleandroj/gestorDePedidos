#language: pt

Funcionalidade: Manter Formulário de Avaliação de Eventos
  Com o objetivo de receber avaliações dos dias dos Eventos
  Como um "Administrador"
  Eu quero poder Inserir, Visualizar e Remover formulários de avaliação de eventos

  @positivo
  Cenário: Visualizar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Gerenciar Programação (US004)"
    Quando eu clicar no botão (icone feedback) "Formulário de Avaliação"
    Então o sisteam deve me redirecionar para a "Página de Formulário de Avaliação"
    E apresentar a tabela de formulários de acordo com o exemplo

  Exemplos:
  | Título | Cadastrado Por | Qtd. Questões | Ações |
  | Formulário | Gabriel Siqueira | (icone cloud_download) Exportar (icone edit) Editar (icone delete) Deletar |

  @positivo
  Cenário: Cadastrar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Visualizar Formulário de Avaliação"
    Quando eu clicar no botão "Cadastrar Formulário de Avaliação"
    Então o sistema deve me apresentar o formulário de "Cadastro de Formulário de Avaliação"

  @positivo
  Cenário: Cadastrar Formulário de Avaliação - Salvar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Cadastrar Formulário de Avaliação"
    E tenha preenchido todos os campos do Formulário de Avaliação corretamente
    Quando eu clicar no botão "Salvar"
    Então o sistema deve me redirecionar para página de "Gerenciar Formulário de Avaliação"
    E apresentar a mensagem "Formulário de Avaliação cadastrado com sucesso!"

  @positivo
  Cenário: Editar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Gerenciar Formulário de Avaliação"
    Quando eu clicar no botão "Editar Formulário de Avaliação" de algum Formulário de Avaliação
    Então o sistema deve me apresentar o formulário de "Editar Formulário de Avaliação"

  @positivo
  Cenário: Editar Formulário de Avaliação - Salvar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Editar Formulário de Avaliação"
    E tenha preenchido todos os campos da Formulário de Avaliação corretamente
    Quando eu clicar no botão "Salvar"
    Então o sistema deve me redirecionar para página de "Gerenciar Formulário de Avaliação"
    E apresentar a mensagem "Formulário de Avaliação atualizado com sucesso!"

  @positivo
  Cenário: Deletar Formulário de Avaliação
    Dado que eu tenha realizado o cenário "Gerenciar Formulário de Avaliação"
    Quando eu clicar no botão (icone delete) "Deletar" de alguma Formulário de Avaliação
    Então o sistema deve apresentar uma caixa de dialogo com a mensagem "Tem certeza que deseja deletar a programação?"
    E os botões "Cancelar" e "Confirmar"
    E caso o usuário clique no botão "Confirmar" o sistema deve deletar a programação
    E apresentar a mensagem "Formulário de Avaliação deletado com sucesso!"