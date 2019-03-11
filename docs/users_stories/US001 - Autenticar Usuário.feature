#language: pt

Funcionalidade: Autenticar Usuário
  Com o objetivo de autenticar o usuário no sistema
  Como um Usuário
  Eu quero poder informar minhas credenciais de acesso para poder visualizar a programação do sites
  e demais informações disponíveis no sistema

  @positivo
  Cenário: Realizar login com informações válidas
    Dado que meu e-mail <e-mail> e senha <senha> já estejam cadastrados no sistema
    Quando eu informar meu e-mail <e-mail> e senha <senha>
    E clicar no botão "Acessar"
    Então o sistema deve me redirecionar para a "Página de Agenda de Programação"

  Exemplos:
  | e-mail | senha |
  | gabrielleandrojunior@live.com | senhavalida |

  @negativo
  Cenário: Realizar login com informações inválidas
    Dado que meu <e-mail valido> e <senha valida> já estejam cadastrados no sistema
    Quando eu informar um e-mail válido <e-mail>
    E uma senha inválida <senha invalida>
    OU eu informar um e-mail inválido <e-mail invalido>
    E uma senha válida <senha valida>
    E clicar no botão "Acessar"
    Então o sistema deve apresentar a mensagem "Ops! Usuário ou senha incorretos."

  Exemplos:
  | e-mail valido | e-mail invalido | senha valida | senha invalida |
  | gabrielleandrojunior@live.com | gabrielleandro@teste.com | senhavalida | senhainvalida |

  @positivo
  Cenário: Recuperar senha
    Dado que eu já tenha realizado o meu cadastro e não lembre a minha senha
    Quando eu clicar no link "Esqueceu sua senha?"
    Então o sistema deve me redirecionar para "Página de Recuperação de Senha"

  @positivo
  Cenário: Solicitar recuperação de senha com e-mail cadastrado
    Dado que eu esteja na tela de recuperação de senha
    Quando eu informar um <e-mail> cadastrado no sistema
    E clicar no botão "Enviar solicitação de recuperação"
    Então o sistema deve me redirecionar para a "Página de Login"
    E apresentar a mensagem "O link para redefinição de senha foi enviado para o seu e-mail."
    E o sistema deve gerar um token de acordo com as regras <regras>
    E enviar para o e-mail cadastrado o e-mail de recuperação de senha de acordo com o modelo:
        """
            Olá <nome do usuário>! 
            ======================

            Você está recebendo este e-mail 
            porque recebemos uma solicitação
            de recuperação de senha para sua conta.

            [Redefinir Senha]

            Se você não solicitou uma recuperação
            de senha, nenhuma ação adicional será
            necessária, não se preocupe!

            Atenciosamente,
            SITES

            ==========================

            Se você tiver problemas para clicar no botão
            "Redefinir Senha", copie e cole o URL abaixo no
            seu navegador: [url]
        """
  Exemplos:
  | regras |
  | O token deve ser único |
  | O token pode ser utilizado apenas uma vez |
  | Após a utilização do token o mesmo deve ser invalidado e deletado |

  @negativo
  Cenário: Solicitar recuperação de senha com e-mail não cadastrado
    Dado que eu esteja na tela de recuperação de senha
    Quando eu informar um <e-mail> diferente do e-mail cadastrado no sistema
    E clicar no botão "Enviar solicitação de recuperação"
    Então o sistema deve apresentar a mensagem "Não encontramos nenhum usuário com esse endereço de e-mail."

  @negativo
  Cenario: Resetar Senha - Token Inválido
    Dado que eu realizei o cenário "Solicitar recuperação de senha com e-mail cadastrado"
    E acessei o link de redefinição de senha com um token inválido
    Quando preencher os campo <campos> de acordo com suas regras <regras>
    E clicar no botão "Resetar Senha"
    Então o sistema deve apresentar a mensagem "Este token de redefinição de senha é inválido."
    E me redirecionar para a "Página de Login"

  @positivo
  Cenário: Resetar senha
    Dado que eu realizei o cenário "Solicitar recuperação de senha com e-mail cadastrado"
    E acessei o link de redefinição de senha com um token válido
    Quando preencher os campo <campos> de acordo com suas regras <regras>
    E clicar no botão "Resetar Senha"
    Então o sistema deve apresentar a mensagem "Sua senha foi alterada!"
    E me autenticar
    E me redirecionar para a "Página de Programação"

  Exemplos:
  | campos | regras |
  | Senha | Obrigatório, Mínimo 6 dígitos, Confirmado |
  | C/Senha | Obrigatório |

  @negativo
  Cenário: Resetar senha - informações inválidas
    Dado que eu realizei o cenário "Solicitar recuperação de senha com e-mail cadastrado"
    E acessei o link de redefinição de senha com um token válido
    Quando preencher algum dos campo <campos> divergente de suas regras <regras>
    Então o sistema deve desativar o botão "Resetar Senha"
    E apresentar as mensagem <mensagem> de acordo com a regra <regra> abaixo do campo

  Exemplos:
  | Rega | Mensagem  |
  | Obrigatório | O campo <nome do campo> é obrigatório. |
  | Confirmada | As/Os <nome do campo> não conferem. |
  | Mínimo 6 dígitos | A/O <nome do campo> deve conter no mínimo 6 caracteres. |