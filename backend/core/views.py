import json
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.views.decorators.csrf import csrf_exempt
from .models import *




def home(request):
    return HttpResponse("ControlaLab funcionando!")


@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse(
            {"erro": "Método Inválido"},
            status=405
        )
    
    try:
        dados = json.loads(request.body)
    except:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )

    username = dados.get("username")
    password = dados.get("password")

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user:

        auth_login(request, user)

        return JsonResponse({
            "success": True,
            "username": user.username

        })
    return JsonResponse(
        {
            "success": False, 
            "message": "Usuário ou senha inválidos"
        },
        status=401
    )

@csrf_exempt
def cadastrar_equipamento(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "success": False,
                "message": "Usuário não autenticado"
            },
            status=401
        )

    if request.method != "POST":
        return JsonResponse(    
            {"erro": "Método Inválido"},
            status=405
        )
    dados = json.loads(request.body)

    equipamento = Equipamento.objects.create(
        nome=dados["nome"],
        patrimonio=dados["patrimonio"],
        localizacao=dados["localizacao"],
        status=dados["status"]
    )

    return JsonResponse({
        "id": equipamento.id,
        "nome": equipamento.nome
    })

def listar_equipamentos(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "success": False,
                "message": "Usuário não autenticado"
            },
            status=401
        )

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método Inválido"},
            status=405
        )
    
    equipamentos = Equipamento.objects.all()
    dados = []

    for equipamento in equipamentos:
        dados.append({
            "id": equipamento.id,
            "nome": equipamento.nome,
            "patrimonio": equipamento.patrimonio,
            "localizacao": equipamento.localizacao,
            "status": equipamento.status
        })

    return JsonResponse(
        dados,
        safe=False
    )

@csrf_exempt
def logout(request):

    auth_logout(request)

    return JsonResponse({
        "success": True,
        "message": "Logout realizado"
    })