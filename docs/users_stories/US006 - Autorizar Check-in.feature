#language: pt

Funcionalidade: Autorizar Check-in
  Com o objetivo de poder confirmar a presença de um usuário em um evento
  Como um "Auxiliar" ou "Administrador" do evento
  Eu quero poder confirmar a presença de um usuário em um evento

  Regras da autorização do check-in:
  - O check-in do dia de um evento só pode ser realizado uma vez por usuário no dia do evento

  @positivo
  Cenário: Autorizar Check-in
    Dado que esteja autenticado e tenha permissão de "Auxiliar" ou "Administrador" do evento
    Quando eu clicar no botão "Autorizar Check-in" no menu principal
    Então o sistema deve abrir a câmera do meu dispositivo para que eu possa ler um QRCode

  @negativo
  Cenário: Autorizar Check-in - Dispositivo sem camera
    Dado que eu esteja autenticado e tenha permissão de "Auxiliar" ou "Administrador" do evento
    Quando eu clicar no botão "Autorizar Check-in" no menu principal
    Então o sistema deve apresentar a mensagem "Ops! A camera não está disponível."

  @positivo
  Cenário: Autorizar Check-in - Ler QRCode
    Dado que eu tenha realizado o cenário "Autorizar Check-in"
    Quando a camera do dispositivo ler um QRCode com o Token do check-in
    Então o sistema deve buscar as informações do check-in
    E apresentar na tela as seguintes informações:
  - Foto do Usuário (Se disponível)
  - Nome do Usuário
  - Edição do sites
  - Data do Check-in

  @positivo
  Cenário: Autorizar Check-in - Confirmar check-in
    Dado que eu tenha realizado o cenário "Autorizar Check-in - Ler QRCode"
    Quando eu clicar no botao "Confirmar"
    Então o sistema deve apresentar a mensagem "Check-in confirmado com sucesso."
    E em tempo real no dispositivo do usuário a tela do QRCode deve fechar
    E apresentar a mensagem "Check-in confirmado com sucesso, bom evento!"

  @negativo
  Cenário: Autorizar Check-in - Programação não disponível para check in
    Dado que eu tenha realizado o cenário "Autorizar Check-in"
    Quando a camera do dispositivo ler um QRCode com o Token do check-in
    E o check-in do evento não tiver atendido as condições para realizar check-in
    Então o sistema deve apresentar a mensagem "Check-in fora de data."

  @negativo
  Cenário: Autorizar Check-in - Check-in já realizado
    Dado que eu tenha realizado o cenário "Autorizar Check-in"
    Quando a camera do dispositivo ler um QRCode com o Token do check-in
    E o check-in do usuário já tiver sido confirmado
    Então o sistema deve apresentar a mensagem "Check-in já realizado."

  @negativo
  Cenário: Autorizar Check-in - Token expirado
    Dado que eu tenha realizado o cenário "Autorizar Check-in"
    Quando a camera do dispositivo ler um QRCode com o Token do check-in
    E o token do check-in do usuário estiver expirado
    Então o sistema deve apresentar a mensagem "Check-in expirado."
