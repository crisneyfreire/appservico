// Coleções principais:

1. empresas/
   ├── nome
   ├── email
   ├── telefone
   ├── plano
   ├── status (ativo/suspenso/bloqueado)
   ├── dataCriacao
   ├── proximoPagamento
   └── ultimoPagamento

2. clientes/
   ├── empresaId
   ├── nome
   ├── email
   ├── telefone
   ├── endereco
   ├── documento (opcional)
   ├── criadoEm
   └── ativo

3. tecnicos/
   ├── empresaId
   ├── nome
   ├── telefone
   ├── email
   ├── especialidade
   └── ativo

4. ordens_servico/
   ├── empresaId
   ├── clienteId
   ├── clienteNome
   ├── tecnicoId (opcional)
   ├── tecnicoNome (opcional)
   ├── titulo
   ├── descricao
   ├── prioridade (baixa/media/alta/urgente)
   ├── categoria
   ├── status
   ├── criadoEm
   ├── atualizadoEm
   ├── agendadoPara (opcional)
   ├── concluidoEm (opcional)
   ├── observacaoTecnica (opcional)
   ├── confirmacaoCliente (boolean)
   └── eventosCount

5. ordens_servico/{osId}/eventos/
   ├── tipo
   ├── texto
   ├── quando
   ├── autorId
   ├── autorNome
   └── autorTipo (cliente/empresa/tecnico)