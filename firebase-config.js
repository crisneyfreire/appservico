// ============================================
// CONFIGURAÇÃO FIREBASE - APP DE SERVIÇO
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyArkRZLVVJNzx6I6GcWVF7NnjIkrF1jrcU",
    authDomain: "painelmastercomplet.firebaseapp.com",
    projectId: "painelmastercomplet",
    storageBucket: "painelmastercomplet.firebasestorage.app",
    messagingSenderId: "87580974705",
    appId: "1:87580974705:web:bd17f8609687f25ee4c5d0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços
const db = firebase.firestore();
const storage = firebase.storage();

// Configurações adicionais do Firestore
db.settings({
    timestampsInSnapshots: true,
    ignoreUndefinedProperties: true
});

// ============================================
// FUNÇÕES UTILITÁRIAS COMPARTILHADAS
// ============================================

const AppServico = {
    
    // Formatar data
    formatarData: function(data) {
        if (!data) return '-';
        return new Date(data).toLocaleString('pt-BR');
    },
    
    // Formatar data apenas (sem hora)
    formatarDataSimples: function(data) {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    },
    
    // Formatar moeda
    formatarMoeda: function(valor) {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    },
    
    // Status da OS com cores e labels
    statusOS: {
        'nova': { 
            label: '🆕 Nova', 
            cor: '#2196F3',
            classe: 'status-nova',
            icon: 'fas fa-plus-circle'
        },
        'em_analise': { 
            label: '🔍 Em Análise', 
            cor: '#FF9800',
            classe: 'status-analise',
            icon: 'fas fa-search'
        },
        'agendada': { 
            label: '📅 Agendada', 
            cor: '#9C27B0',
            classe: 'status-agendada',
            icon: 'fas fa-calendar-check'
        },
        'em_execucao': { 
            label: '⚡ Em Execução', 
            cor: '#2196F3',
            classe: 'status-execucao',
            icon: 'fas fa-play-circle'
        },
        'aguardando_confirmacao': { 
            label: '⏳ Aguardando Confirmação', 
            cor: '#FF9800',
            classe: 'status-aguardando',
            icon: 'fas fa-hourglass-half'
        },
        'concluida': { 
            label: '✅ Concluída', 
            cor: '#4CAF50',
            classe: 'status-concluida',
            icon: 'fas fa-check-circle'
        },
        'cancelada': { 
            label: '❌ Cancelada', 
            cor: '#f44336',
            classe: 'status-cancelada',
            icon: 'fas fa-times-circle'
        }
    },
    
    // Obter classe CSS do status
    getStatusClass: function(status) {
        return this.statusOS[status]?.classe || 'status-nova';
    },
    
    // Obter label do status
    getStatusLabel: function(status) {
        return this.statusOS[status]?.label || status;
    },
    
    // Prioridades
    prioridades: {
        'baixa': { label: '📉 Baixa', cor: '#4CAF50' },
        'media': { label: '📊 Média', cor: '#FF9800' },
        'alta': { label: '📈 Alta', cor: '#f44336' },
        'urgente': { label: '⚠️ Urgente', cor: '#9C27B0' }
    },
    
    // Mostrar mensagem de sucesso
    sucesso: function(msg) {
        alert('✅ ' + msg);
    },
    
    // Mostrar mensagem de erro
    erro: function(msg) {
        alert('❌ ' + msg);
    },
    
    // Confirmar ação
    confirmar: function(msg) {
        return confirm(msg);
    },
    
    // Upload de arquivo para o Storage
    uploadArquivo: async function(file, path) {
        try {
            const ref = storage.ref().child(path);
            await ref.put(file);
            return await ref.getDownloadURL();
        } catch (error) {
            console.error('Erro no upload:', error);
            throw error;
        }
    },
    
    // Adicionar evento à OS
    adicionarEvento: async function(osId, evento) {
        try {
            await db.collection('ordens_servico')
                .doc(osId)
                .collection('eventos')
                .add({
                    ...evento,
                    quando: new Date().toISOString()
                });
            
            // Incrementar contador de eventos na OS
            const osRef = db.collection('ordens_servico').doc(osId);
            await osRef.update({
                eventosCount: firebase.firestore.FieldValue.increment(1)
            });
            
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        }
    }
};

// Disponibilizar globalmente
window.AppServico = AppServico;
window.db = db;
window.storage = storage;