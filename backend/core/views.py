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

    if not username:
        return JsonResponse(
            {"erro": "Usuário obrigatório"},
            status=400
        )

    if not password:
        return JsonResponse(
            {"erro": "Senha obrigatória"},
            status=400
        )    

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
def logout(request):

    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "success": False,
                "message": "Usuário não autenticado"
            },
            status=401
        )

    auth_logout(request)

    return JsonResponse({
        "success": True,
        "message": "Logout realizado"
    })

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
    
    try:
        dados = json.loads(request.body)
    except:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )
    
    if not dados.get("nome"):
        return JsonResponse(
        {"erro": "Nome obrigatório"},
        status=400
    )

    if not dados.get("patrimonio"):
        return JsonResponse(
            {"erro": "Patrimônio obrigatório"},
            status=400
        )

    if not dados.get("localizacao"):
        return JsonResponse(
            {"erro": "Localização obrigatória"},
            status=400
        )

    if not dados.get("status"):
        return JsonResponse(
            {"erro": "Status obrigatório"},
            status=400
        )

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
def cadastrar_manutencao(request):

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
            {"erro": "Método inválido"},
            status=405
        )

    try:
        dados = json.loads(request.body)
    except:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )

    equipamento_id = dados.get("equipamento_id")
    descricao = dados.get("descricao")
    data = dados.get("data")

    if not equipamento_id:
        return JsonResponse(
            {"erro": "Equipamento obrigatório"},
            status=400
        )

    if not descricao:
        return JsonResponse(
        {"erro": "Descrição obrigatória"},
        status=400
    )

    if not data:
        return JsonResponse(
        {"erro": "Data obrigatória"},
        status=400
    )

    try:
        equipamento = Equipamento.objects.get(
            id=equipamento_id
        )
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    manutencao = Manutencao.objects.create(
        equipamento=equipamento,
        descricao=descricao,
        data=data
    )

    return JsonResponse(
        {
            "id": manutencao.id,
            "equipamento": equipamento.nome,
            "descricao": manutencao.descricao,
            "data": str(manutencao.data)
        },
        status=201
    )

def listar_manutencoes(request):

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
            {"erro": "Método inválido"},
            status=405
        )

    manutencoes = Manutencao.objects.all()

    dados = []

    for manutencao in manutencoes:
        dados.append({
            "id": manutencao.id,
            "equipamento": manutencao.equipamento.nome,
            "descricao": manutencao.descricao,
            "data": str(manutencao.data)
        })

    return JsonResponse(
        dados,
        safe=False
    )

def listar_manutencoes_equipamento(request, equipamento_id):

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
            {"erro": "Método inválido"},
            status=405
        )

    try:
        Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    manutencoes = Manutencao.objects.filter(
        equipamento_id=equipamento_id
    )

    dados = []

    for manutencao in manutencoes:
        dados.append({
            "id": manutencao.id,
            "descricao": manutencao.descricao,
            "data": str(manutencao.data)
        })


    return JsonResponse(
        dados,
        safe=False
    )


@csrf_exempt
def cadastrar_agendamento(request):


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
            {"erro": "Método inválido"},
            status=405
        )

    try:
        dados = json.loads(request.body)
    except:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )

    usuario_id = dados.get("usuario_id")
    equipamento_id = dados.get("equipamento_id")
    data = dados.get("data")

    if not usuario_id:
        return JsonResponse(
            {"erro": "Usuário obrigatório"},
            status=400
        )

    if not equipamento_id:
        return JsonResponse(
            {"erro": "Equipamento obrigatório"},
            status=400
        )

    if not data:
        return JsonResponse(
            {"erro": "Data obrigatória"},
            status=400
        )

    try:
        usuario = Usuario.objects.get(
            id=usuario_id
        )
    except Usuario.DoesNotExist:
        return JsonResponse(
            {"erro": "Usuário não encontrado"},
            status=404
        )

    try:
        equipamento = Equipamento.objects.get(
            id=equipamento_id
        )
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    agendamento = Agendamento.objects.create(
        usuario=usuario,
        equipamento=equipamento,
        data=data
    )

    return JsonResponse(
        {
            "id": agendamento.id,
            "usuario": usuario.nome,
            "equipamento": equipamento.nome,
            "data": str(agendamento.data)
        },
        status=201
    )

def listar_agendamentos(request):

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
            {"erro": "Método inválido"},
            status=405
        )

    agendamentos = Agendamento.objects.all()

    dados = []

    for agendamento in agendamentos:
        dados.append({
            "id": agendamento.id,
            "usuario": agendamento.usuario.nome,
            "equipamento": agendamento.equipamento.nome,
            "data": str(agendamento.data)
        })

    return JsonResponse(
        dados,
        safe=False
    )

def listar_agendamentos_equipamento(request, equipamento_id):

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
            {"erro": "Método inválido"},
            status=405
        )
    
    try:
        Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    agendamentos = Agendamento.objects.filter(
        equipamento_id=equipamento_id
    )

    dados = []

    for agendamento in agendamentos:
        dados.append({
            "id": agendamento.id,
            "usuario": agendamento.usuario.nome,
            "data": str(agendamento.data)
        })

    return JsonResponse(
        dados,
        safe=False
    )