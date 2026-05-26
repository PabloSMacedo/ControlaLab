from django.db import models


class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nome


class Equipamento(models.Model):
    nome = models.CharField(max_length=100)
    patrimonio = models.CharField(max_length=50, unique=True)
    localizacao = models.CharField(max_length=100)
    status = models.CharField(max_length=30)

    def __str__(self):
        return self.nome


class Manutencao(models.Model):
    equipamento = models.ForeignKey(
        Equipamento,
        on_delete=models.CASCADE
    )
    descricao = models.TextField()
    data = models.DateField()

    def __str__(self):
        return f"Manutenção #{self.id}"


class Agendamento(models.Model):
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )
    equipamento = models.ForeignKey(
        Equipamento,
        on_delete=models.CASCADE
    )
    data = models.DateField()

    def __str__(self):
        return f"Agendamento #{self.id}"
    