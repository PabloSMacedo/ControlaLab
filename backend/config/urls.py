"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from core.views import *


urlpatterns = [

#Endpoints - home e admin:    
    path('admin/', admin.site.urls),
    path('', home),

#Endpoints - login:
    path("api/login/", login),
    path("api/logout/", logout),

#Endpoints - Equipamentos:
    path("api/equipamentos/cadastrar/", cadastrar_equipamento),
    path("api/equipamentos/", listar_equipamentos),
    path("api/equipamentos/<int:equipamento_id>/editar/", editar_equipamento),
    path("api/equipamentos/<int:equipamento_id>/remover/", remover_equipamento),

#Endpoints - Manutenção:
    path("api/manutencoes/cadastrar/", cadastrar_manutencao),
    path("api/manutencoes/", listar_manutencoes),
    path("api/equipamentos/<int:equipamento_id>/manutencoes/", listar_manutencoes_equipamento),
    path("api/manutencoes/<int:manutencao_id>/editar/", editar_manutencao),
    path("api/manutencoes/<int:manutencao_id>/remover/", remover_manutencao),

# Endpoints - Agendamentos:
    path("api/agendamentos/cadastrar/", cadastrar_agendamento),
    path("api/agendamentos/", listar_agendamentos),
    path("api/equipamentos/<int:equipamento_id>/agendamentos/", listar_agendamentos_equipamento),
    path("api/agendamentos/<int:agendamento_id>/editar/", editar_agendamento),
    path("api/agendamentos/<int:agendamento_id>/remover/", remover_agendamento),

# Endpoints - Relatórios:
    path("api/relatorios/equipamentos/", relatorio_equipamentos),
    path("api/relatorios/manutencoes/", relatorio_manutencoes),
    path("api/relatorios/agendamentos/", relatorio_agendamentos),
    path("api/relatorios/resumo/", relatorio_resumo),

]

