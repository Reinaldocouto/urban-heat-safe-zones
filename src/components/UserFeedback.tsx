
import React, { useState } from 'react';
import { MessageCircle, Star, Send, MapPin } from 'lucide-react';

interface Feedback {
  id: string;
  pontoId?: string;
  pontoNome?: string;
  rating: number;
  comment: string;
  category: 'qualidade' | 'acessibilidade' | 'localizacao' | 'outros';
  timestamp: Date;
}

const UserFeedback: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enviar' | 'historico'>('enviar');
  const [feedback, setFeedback] = useState({
    pontoId: '',
    pontoNome: '',
    rating: 0,
    comment: '',
    category: 'qualidade' as const
  });
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      pontoId: '1',
      pontoNome: 'Parque do Ibirapuera',
      rating: 5,
      comment: 'Excelente local para descanso, muito bem arborizado e fresco.',
      category: 'qualidade',
      timestamp: new Date('2024-01-15')
    },
    {
      id: '2',
      pontoId: '2',
      pontoNome: 'Fonte Monumental do Parque',
      rating: 4,
      comment: 'Água sempre disponível, mas poderia ter mais sombra ao redor.',
      category: 'acessibilidade',
      timestamp: new Date('2024-01-10')
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      ...feedback,
      timestamp: new Date()
    };
    
    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedback({
      pontoId: '',
      pontoNome: '',
      rating: 0,
      comment: '',
      category: 'qualidade'
    });
    
    alert('Feedback enviado com sucesso! Obrigado por contribuir.');
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setFeedback({...feedback, rating: i + 1}) : undefined}
      />
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="flex items-center space-x-2 p-6 pb-4">
            <MessageCircle className="h-6 w-6 text-fiap-red" />
            <h2 className="text-2xl font-bold text-fiap-gray-dark">Feedback dos Usuários</h2>
          </div>
          
          <div className="flex space-x-0">
            <button
              onClick={() => setActiveTab('enviar')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'enviar'
                  ? 'border-fiap-red text-fiap-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Enviar Feedback
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'historico'
                  ? 'border-fiap-red text-fiap-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'enviar' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Ponto de Resfriamento
                  </label>
                  <select
                    value={feedback.pontoId}
                    onChange={(e) => {
                      const pontoId = e.target.value;
                      const pontoNome = e.target.options[e.target.selectedIndex].text;
                      setFeedback({...feedback, pontoId, pontoNome});
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
                    required
                  >
                    <option value="">Selecione um ponto</option>
                    <option value="1">Parque do Ibirapuera</option>
                    <option value="2">Fonte Monumental do Parque</option>
                    <option value="3">Abrigo Coberto Centro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={feedback.category}
                    onChange={(e) => setFeedback({...feedback, category: e.target.value as any})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
                  >
                    <option value="qualidade">Qualidade</option>
                    <option value="acessibilidade">Acessibilidade</option>
                    <option value="localizacao">Localização</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação
                </label>
                <div className="flex space-x-1">
                  {renderStars(feedback.rating, true)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário
                </label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  rows={4}
                  placeholder="Compartilhe sua experiência..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-fiap-red focus:border-fiap-red"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-fiap-red text-white py-3 px-6 rounded-md hover:bg-fiap-red/90 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Enviar Feedback</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum feedback enviado ainda.</p>
              ) : (
                feedbacks.map((fb) => (
                  <div key={fb.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-fiap-gray-dark">{fb.pontoNome}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            {renderStars(fb.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {fb.category.charAt(0).toUpperCase() + fb.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {fb.timestamp.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{fb.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
