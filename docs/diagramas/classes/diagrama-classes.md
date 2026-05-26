classDiagram

class Usuario {
    +int id
    +string nome
    +string email
    +string senha
    +string perfil
}

class Equipamento {
    +int id
    +string nome
    +string patrimonio
    +string localizacao
    +string status
}

class Agendamento {
    +int id
    +date data
    +string horario
    +string finalidade
}

class Manutencao {
    +int id
    +date data
    +string descricao
    +string status
}

Usuario "1" --> "*" Agendamento
Equipamento "1" --> "*" Agendamento
Equipamento "1" --> "*" Manutencao