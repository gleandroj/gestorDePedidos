#language: pt

Funcionalidade: Registrar Usuário
  Com o objetivo de me cadastrar no sistema
  Como um usuário
  Eu quero poder me cadastrar no sistema para poder visualizar
  as programações dos dias do evento SITES
  e demais informações disponíveis no sistema

  Regras e Campos do Registro:
  | Campos | Regas |
  | Nome Completo  | Obrigatório, Máximo 50 caracteres |
  | E-mail | Obrigatório, Validação de e-mail, Deve ser único |
  | Telefone Celular | Obrigatório, Validação de telefone, Deve ser único |
  | Senha | Obrigatório, Confirmada, Mínimo 6 dígitos |
  | Imagem do Perfil | Opicional |
  | Sexo | Obrigatório |
  | Data de Nascimento | Obrigatório, Validação de data |
  | Vínculo | Obrigatório, (Aluno, Servidor, Comunidade) |
  | Matrícula | Obrigatório se o vínculo for diferente de Comunidade, Validação de Matrícula (7 dígitos numéricos) |

  @positivo
  Cenário: Registrar usuário com informações válidas
    Dado que preenchi todos os campos <campos> corretamente de acordo com sua regas <regas>
    Quando clicar no botão "Cadastrar"
    Então o sistema deve me cadastrar
    E me autenticar em seguida
    E me redirecionar para a "Página de Programação"
    E apresentar a mensagem "Seja bem-vindo ao Sites <nome do usuário>!"

  @negativo
  Cenário: Registrar usuário com informações inválidas
    Dado que preenchi todos algum dos campos <campos> divergente de alguma das suas regras <regras>
    Quando eu tiver preenchido
    Então o sistema deve apresentar abaixo do campo a mensagem <mensagem> referente a regra <regra>
    E desativar o botão "Cadastrar"

  Exemplos:
  | Rega | Mensagem  |
  | Obrigatório | O campo <nome do campo> é obrigatório. |
  | Validação de data | Entre com uma data válida. |
  | Validação de telefone | Entre com um telefone de e-mail válido. |
  | Validação de e-mail | Entre com um endereço de e-mail válido.  |
  | Validação de matrícula | Entre com a matrícula válida.  |
  | Confirmada | As/Os <nome do campo> não conferem. |
  | Mínimo 6 dígitos | A/O <nome do campo> deve conter no mínimo 6 caracteres. |

  @negativo
  Cenário: Registrar usuário com e-mail já cadastrado
    Dado que preenchi todos os campos <campos> corretamente com suas regras <regras>
    Quando eu preencher no campo "E-mail" um e-mail <e-mail> já cadastrado no sistema
    Então o sistema deve apresentar abaixo do campo a mensagem "E-mail já cadastrado no sistema."
    E desativar o botão "Cadastrar"

  Exemplos:
  | e-mail |
  | gabrielleandrojunior@live.com |

  @negativo
  Cenário: Registrar usuário com telefone já cadastrado
    Dado que preenchi todos os campos <campos> corretamente com suas regras <regras>
    Quando eu preencher no campo "Telefone" um telefone <telefone> já cadastrado no sistema
    Então o sistema deve apresentar abaixo do campo a mensagem "Telefone já cadastrado no sistema."
    E desativar o botão "Cadastrar"

  Exemplos:
  | telefone |
  | (62) 99999-9999 |