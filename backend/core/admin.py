from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Usuario, Equipamento, Manutencao, Agendamento

admin.site.register(Usuario)
admin.site.register(Equipamento)
admin.site.register(Manutencao)
admin.site.register(Agendamento)