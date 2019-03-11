#language: pt

Funcionalidade: Editar Usuário
    Com o objetivo de editar um usuário e poder atribuir permissões para os usuários
    Como um "Administrador"
    Eu quero poder editar as informações do usuário e poder atribuir/remover permissões para os mesmos

    @positivo 
    Cenário: Listar Usuário
        Dado que eu esteja autenticado e possua permissão de "Administrador"
        Quando clicar no botão "Gerenciar Usuários" no menu principal
        Então o sistema deve me redirecionar para página de "Gerenciar Usuários"
        E deve ser apresentada a lista de todos os usuários cadastrados paginados
    
    @positivo 
    Cenário: Listar Usuário - Pesquisar
        Dado que eu tenha realizado o cenário "Listar Usuário"
        Quando eu digitar algum texto no campo de pesquisa da página
        Então o sistema deve filtar a lista Usuários
        E mostrar os usuários correspondentes 

    @positivo 
    Cenário: Editar Usuário
        Dado que eu tenha realizado o cenário "Listar Usuário"
        Quando eu clicar no botão "Editar Usuário" no usuário que desejo editar
        Então o sistema deve apresentar o "Formulário de Edição de Usuário" com as informações do usuário

    Regras e Campos do formulário:
        | Campos | Regas |
        | Nome Completo  | Obrigatório, Máximo 50 caracteres |
        | Imagem do Perfil | Opicional |
        | Sexo | Obrigatório |
        | Data de Nascimento | Obrigatório, Validação de data |
        | E-mail | Obrigatório, Validação de e-mail, Deve ser único |
        | Senha | Obrigatório, Confirmada, Mínimo 6 dígitos |
        | Vínculo | Obrigatório, (Aluno, Servidor, Comunidade) |
        | Matrícula | Obrigatório se o vínculo for diferente de Comunidade |
        | Papel | Opicional (Administrador, Auxiliar, Nenhum) |

    @positivo 
    Cenário: Atualizar Usuário
        Dado que eu tenha realizado o cenário "Editar Usuário"
        E tenha preenchido todos os campos do Usuário corretamente
        Quando eu clicar no botão "Salvar"
        Então o sistema deve me redirecionar para página de "Gerenciar Usuários"
        E apresentar a mensagem "Usuário atualizado com sucesso!"
