import json
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.contrib.auth import SESSION_KEY
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.db.models import Count, Q
from django.utils import timezone
from .models import *




def home(request):
    return JsonResponse({"message": "ControlaLab funcionando!"})


def carregar_json(request):
    try:
        return json.loads(request.body), None
    except:
        return None, JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )


def usuario_autenticado(request):
    if request.user.is_authenticated:
        return request.user

    session_key = request.headers.get("X-ControlaLab-Session")

    if not session_key:
        return None

    try:
        sessao = Session.objects.get(
            session_key=session_key,
            expire_date__gte=timezone.now()
        )
        user_id = sessao.get_decoded().get(SESSION_KEY)

        if not user_id:
            return None

        user = User.objects.get(id=user_id, is_active=True)
    except Exception:
        return None

    request.user = user
    return user


def resposta_nao_autenticado():
    return JsonResponse(
        {
            "success": False,
            "message": "Usuário não autenticado"
        },
        status=401
    )


def autenticar_requisicao(request):
    if not usuario_autenticado(request):
        return resposta_nao_autenticado()
    return None


def dados_usuario_logado(user):
    nome = user.get_full_name() or user.username
    email = user.email or f"{user.username}@controlalab.local"

    usuario, _ = Usuario.objects.get_or_create(
        email=email,
        defaults={"nome": nome}
    )

    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email
    }


def dados_equipamento(equipamento):
    return {
        "id": equipamento.id,
        "nome": equipamento.nome,
        "patrimonio": equipamento.patrimonio,
        "localizacao": equipamento.localizacao,
        "status": equipamento.status
    }


def dados_manutencao(manutencao):
    return {
        "id": manutencao.id,
        "equipamento_id": manutencao.equipamento.id,
        "equipamento": manutencao.equipamento.nome,
        "descricao": manutencao.descricao,
        "data": str(manutencao.data)
    }


def dados_agendamento(agendamento):
    return {
        "id": agendamento.id,
        "usuario_id": agendamento.usuario.id,
        "usuario": agendamento.usuario.nome,
        "equipamento_id": agendamento.equipamento.id,
        "equipamento": agendamento.equipamento.nome,
        "data": str(agendamento.data)
    }


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

    login = dados.get("login")
    password = dados.get("password")

    if not login:
        return JsonResponse(
            {"erro": "Usuário obrigatório"},
            status=400
        )

    if not password:
        return JsonResponse(
            {"erro": "Senha obrigatória"},
            status=400
        )    

    user = None

    if "@" in login:

        try:
            usuario = User.objects.get(email=login)

            user = authenticate(
                request,
                username=usuario.username,
                password=password
            )

        except User.DoesNotExist:
            pass

    else:

        user = authenticate(
            request,
            username=login,
            password=password
        )

    if user:

        auth_login(request, user)
        request.session.save()

        return JsonResponse({
            "success": True,
            "username": user.username,
            "usuario": dados_usuario_logado(user),
            "session_key": request.session.session_key

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

    if request.method != "POST":
        return JsonResponse(
            {"erro": "Método Inválido"},
            status=405
        )

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    session_key = request.headers.get("X-ControlaLab-Session")
    if session_key:
        Session.objects.filter(session_key=session_key).delete()
    auth_logout(request)

    return JsonResponse({
        "success": True,
        "message": "Logout realizado"
    })

@csrf_exempt
def cadastrar_equipamento(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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

    try:
        equipamento = Equipamento.objects.create(
            nome=dados["nome"],
            patrimonio=dados["patrimonio"],
            localizacao=dados["localizacao"],
            status=dados["status"]
        )
    except IntegrityError:
        return JsonResponse(
            {"erro": "Patrimônio já cadastrado"},
            status=400
        )

    return JsonResponse(
        dados_equipamento(equipamento),
        status=201
    )

def listar_equipamentos(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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
def editar_equipamento(request, equipamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "PUT"]:
        return JsonResponse(
            {"erro": "Método Inválido"},
            status=405
        )

    dados, erro_json = carregar_json(request)
    if erro_json:
        return erro_json

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

    try:
        equipamento = Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    equipamento.nome = dados["nome"]
    equipamento.patrimonio = dados["patrimonio"]
    equipamento.localizacao = dados["localizacao"]
    equipamento.status = dados["status"]

    try:
        equipamento.save()
    except IntegrityError:
        return JsonResponse(
            {"erro": "Patrimônio já cadastrado"},
            status=400
        )

    return JsonResponse(
        dados_equipamento(equipamento)
    )


@csrf_exempt
def remover_equipamento(request, equipamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "DELETE"]:
        return JsonResponse(
            {"erro": "Método Inválido"},
            status=405
        )

    try:
        equipamento = Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    equipamento.delete()

    return JsonResponse({
        "success": True,
        "message": "Equipamento removido"
    })

@csrf_exempt
def cadastrar_manutencao(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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
        dados_manutencao(manutencao),
        status=201
    )

def listar_manutencoes(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    manutencoes = Manutencao.objects.all()

    dados = []

    for manutencao in manutencoes:
        dados.append(dados_manutencao(manutencao))

    return JsonResponse(
        dados,
        safe=False
    )

def listar_manutencoes_equipamento(request, equipamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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
        dados.append(dados_manutencao(manutencao))


    return JsonResponse(
        dados,
        safe=False
    )


@csrf_exempt
def editar_manutencao(request, manutencao_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "PUT"]:
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    dados, erro_json = carregar_json(request)
    if erro_json:
        return erro_json

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
        manutencao = Manutencao.objects.get(id=manutencao_id)
    except Manutencao.DoesNotExist:
        return JsonResponse(
            {"erro": "Manutenção não encontrada"},
            status=404
        )

    try:
        equipamento = Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    manutencao.equipamento = equipamento
    manutencao.descricao = descricao
    manutencao.data = data
    manutencao.save()

    return JsonResponse(
        dados_manutencao(manutencao)
    )


@csrf_exempt
def remover_manutencao(request, manutencao_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "DELETE"]:
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    try:
        manutencao = Manutencao.objects.get(id=manutencao_id)
    except Manutencao.DoesNotExist:
        return JsonResponse(
            {"erro": "Manutenção não encontrada"},
            status=404
        )

    manutencao.delete()

    return JsonResponse({
        "success": True,
        "message": "Manutenção removida"
    })


@csrf_exempt
def cadastrar_agendamento(request):


    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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
        dados_agendamento(agendamento),
        status=201
    )

def listar_agendamentos(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    agendamentos = Agendamento.objects.all()

    dados = []

    for agendamento in agendamentos:
        dados.append(dados_agendamento(agendamento))

    return JsonResponse(
        dados,
        safe=False
    )

def listar_agendamentos_equipamento(request, equipamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

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
        dados.append(dados_agendamento(agendamento))

    return JsonResponse(
        dados,
        safe=False
    )


def relatorio_equipamentos(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    equipamentos = Equipamento.objects.all()

    agrupamento_status = {}
    for item in equipamentos.values("status").annotate(total=Count("id")):
        agrupamento_status[item["status"]] = item["total"]

    return JsonResponse({
        "total": equipamentos.count(),
        "agrupamento_por_status": agrupamento_status,
        "equipamentos": [
            dados_equipamento(equipamento)
            for equipamento in equipamentos
        ]
    })


def relatorio_manutencoes(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    manutencoes = Manutencao.objects.select_related("equipamento").all()

    return JsonResponse({
        "total": manutencoes.count(),
        "manutencoes": [
            dados_manutencao(manutencao)
            for manutencao in manutencoes
        ]
    })


def relatorio_agendamentos(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    agendamentos = Agendamento.objects.select_related(
        "usuario",
        "equipamento"
    ).all()

    return JsonResponse({
        "total": agendamentos.count(),
        "agendamentos": [
            dados_agendamento(agendamento)
            for agendamento in agendamentos
        ]
    })


def relatorio_resumo(request):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method != "GET":
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    return JsonResponse({
        "total_equipamentos": Equipamento.objects.count(),
        "total_manutencoes": Manutencao.objects.count(),
        "total_agendamentos": Agendamento.objects.count(),
        "equipamentos_ativos": Equipamento.objects.filter(
            status__iexact="Ativo"
        ).count(),
        "equipamentos_em_manutencao": Equipamento.objects.filter(
            Q(status__icontains="manuten") |
            Q(status__icontains="reparo")
        ).count(),
        "equipamentos_inativos": Equipamento.objects.filter(
            status__iexact="Inativo"
        ).count()
    })


@csrf_exempt
def editar_agendamento(request, agendamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "PUT"]:
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    dados, erro_json = carregar_json(request)
    if erro_json:
        return erro_json

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
        agendamento = Agendamento.objects.get(id=agendamento_id)
    except Agendamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Agendamento não encontrado"},
            status=404
        )

    try:
        usuario = Usuario.objects.get(id=usuario_id)
    except Usuario.DoesNotExist:
        return JsonResponse(
            {"erro": "Usuário não encontrado"},
            status=404
        )

    try:
        equipamento = Equipamento.objects.get(id=equipamento_id)
    except Equipamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Equipamento não encontrado"},
            status=404
        )

    agendamento.usuario = usuario
    agendamento.equipamento = equipamento
    agendamento.data = data
    agendamento.save()

    return JsonResponse(
        dados_agendamento(agendamento)
    )


@csrf_exempt
def remover_agendamento(request, agendamento_id):

    erro_autenticacao = autenticar_requisicao(request)
    if erro_autenticacao:
        return erro_autenticacao

    if request.method not in ["POST", "DELETE"]:
        return JsonResponse(
            {"erro": "Método inválido"},
            status=405
        )

    try:
        agendamento = Agendamento.objects.get(id=agendamento_id)
    except Agendamento.DoesNotExist:
        return JsonResponse(
            {"erro": "Agendamento não encontrado"},
            status=404
        )

    agendamento.delete()

    return JsonResponse({
        "success": True,
        "message": "Agendamento removido"
    })
