#language: pt

Funcionalidade: Notificar Programação
    Com o objetivo de notificar por e-mail os usuários cadastrados no sistema sobre as programações que irão acontecer
    Como um usuário
    Eu quero que o sistema notifique-me por e-mail caso tenha
    alguma programação acontecendo no dia

    @positivo 
    Cenário: Notificar Programação - Resumo do dia
        Dado que eu esteja cadastrado no sistema
        E tenha autorizado o sistema a me enviar e-mail sobre a programação na minha tela de perfil
        Quando for 08h da manhã de todos dias
        E existir alguma programação cadastrada para o dia
        Então o sistema deve enviar um e-mail notificando-me com os detalhes da programção do dia
    
    """
        Resumo do dia
        ===============
        Olá <nome do usuário>,

        Hoje temos a seguinte programação acontecendo no evento SITES da instituição:
    
        [detalhe da programação cadastrada no sistema]
        -----------------------------------------------------------------------------------------------------------------

        Fique atento para não chegar atrasado,
        Atenciosamente,
        SITES
    """