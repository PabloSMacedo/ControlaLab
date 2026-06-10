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
    path('admin/', admin.site.urls),
    path('', home),

#Endpoints - login
    path("api/login/", login),
    path("api/logout/", logout),

#Endpoints - Equipamentos
    path("api/equipamentos/cadastrar/", cadastrar_equipamento),
    path("api/equipamentos/", listar_equipamentos),

#Endpoints - Manutenção
    path("api/manutencoes/cadastrar/", cadastrar_manutencao),
    path("api/manutencoes/", listar_manutencoes),
    path("api/equipamentos/<int:equipamento_id>/manutencoes/", listar_manutencoes_equipamento),

]

