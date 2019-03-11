#language: pt

Funcionalidade: Realizar Sorteio
  Com o objetivo de sortear um premio durante meus eventos
  Como um "Auxiliar" ou "Administrador" do evento
  Eu quero que o sistema sorteie um usuário para mim

  Regras o sorteio:
  - Só será possível realizar sorteio de eventos que estão acontecendo e possuem no mínimo 1 usuário confirmado
  - Um usuário só poderar ser sorteado uma vez por cada check-in

  @positivo
  Cenário: Sortear Usuário
    Dado que eu esteja autenticado e tenha permissão de "Auxiliar" ou "Administrador" do evento
    Quando clicar no botão "Realizar Sorteio" no menu principal
    Então o sistema deve verificar se exite uma programação cadastrada para o dia
    E me redirecionar para página de "Sorteio"

  @positivo
  Cenário: Sortear Usuário - Usuário Sorteado
    Dado que eu tenha realizado o cenário "Sortear Usuário"
    Quando eu clicar no botão "Sortear"
    Então o sistema deve selecionar um usuário que realizou check-in aleatoriamente
    E que não tenha sido sorteado
    E apresentar suas informações
  - Foto
  - Nome Completo
  - Telefone
  - E-mail
    E enviar um e-mail informando que ele foi sorteado no seguinte modelo:

        """
            Parabéns!!! <nome do usuário>,

            Você foi sorteado por estar participando do evento <nome do evento>,
            Caso esteja no local do evento, procure os organizadores do evento para retirar seu prêmio.

            Caso não esteja mais no local do evento infelizmente você não poderá retirar o prêmio pois,
            os prêmios são apenas para os participantes que ficaram até o final.

            Atenciosamente,
            Uni Eventos
        """