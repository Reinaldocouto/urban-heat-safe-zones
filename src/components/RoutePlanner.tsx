
import React, { useState } from 'react';
import { MapPin, Route, Clock, Thermometer, Navigation, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';

const RoutePlanner: React.FC = () => {
  const [origemLat, setOrigemLat] = useState('');
  const [origemLon, setOrigemLon] = useState('');
  const [destinoLat, setDestinoLat] = useState('');
  const [destinoLon, setDestinoLon] = useState('');
  
  const { latitude: userLat, longitude: userLon, loading: geoLoading, error: geoError } = useGeolocation();
  const { toast } = useToast();

  const isValidCoordinate = (lat: string, lon: string): boolean => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    return !isNaN(latNum) && !isNaN(lonNum) && 
           latNum >= -90 && latNum <= 90 && 
           lonNum >= -180 && lonNum <= 180;
  };

  const useCurrentLocation = () => {
    if (geoLoading) {
      toast({
        title: 'Aguarde',
        description: 'Obtendo localização atual...',
        variant: 'default'
      });
      return;
    }

    if (geoError || !userLat || !userLon) {
      toast({
        title: 'Erro de localização',
        description: 'Não foi possível obter sua localização atual. Verifique as permissões.',
        variant: 'destructive'
      });
      return;
    }

    setOrigemLat(userLat.toString());
    setOrigemLon(userLon.toString());
    
    toast({
      title: 'Localização obtida!',
      description: 'Sua localização atual foi preenchida no campo de origem.',
    });
  };

  const calculateRoute = () => {
    // Validar campos preenchidos
    if (!origemLat || !origemLon || !destinoLat || !destinoLon) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos de coordenadas (origem e destino).',
        variant: 'destructive'
      });
      return;
    }

    // Validar coordenadas
    if (!isValidCoordinate(origemLat, origemLon)) {
      toast({
        title: 'Coordenadas inválidas',
        description: 'As coordenadas de origem são inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180.',
        variant: 'destructive'
      });
      return;
    }

    if (!isValidCoordinate(destinoLat, destinoLon)) {
      toast({
        title: 'Coordenadas inválidas',
        description: 'As coordenadas de destino são inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180.',
        variant: 'destructive'
      });
      return;
    }

    // Construir URL do Google Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/${origemLat},${origemLon}/${destinoLat},${destinoLon}`;
    
    // Abrir em nova aba
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: 'Rota calculada!',
      description: 'Redirecionando para o Google Maps com sua rota térmica...',
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Route className="h-6 w-6 text-fiap-red" />
          <h2 className="text-2xl font-bold text-fiap-gray-dark">Planeje sua Rota Térmica</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Campo de Origem */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="inline h-4 w-4 mr-1 text-fiap-red" />
                  Coordenadas de Origem
                </Label>
                <Button
                  onClick={useCurrentLocation}
                  disabled={geoLoading}
                  variant="outline"
                  size="sm"
                  className="border-fiap-red text-fiap-red hover:bg-fiap-red/10"
                >
                  <Locate className="h-4 w-4 mr-1" />
                  {geoLoading ? 'Obtendo...' : 'Usar localização atual'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="origem-lat" className="text-xs text-gray-600">Latitude</Label>
                  <Input
                    id="origem-lat"
                    type="text"
                    value={origemLat}
                    onChange={(e) => setOrigemLat(e.target.value)}
                    placeholder="-23.5617"
                    className="focus:ring-fiap-red focus:border-fiap-red"
                  />
                </div>
                <div>
                  <Label htmlFor="origem-lon" className="text-xs text-gray-600">Longitude</Label>
                  <Input
                    id="origem-lon"
                    type="text"
                    value={origemLon}
                    onChange={(e) => setOrigemLon(e.target.value)}
                    placeholder="-46.6558"
                    className="focus:ring-fiap-red focus:border-fiap-red"
                  />
                </div>
              </div>
            </div>

            {/* Campo de Destino */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Navigation className="inline h-4 w-4 mr-1 text-fiap-red" />
                Coordenadas de Destino
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="destino-lat" className="text-xs text-gray-600">Latitude</Label>
                  <Input
                    id="destino-lat"
                    type="text"
                    value={destinoLat}
                    onChange={(e) => setDestinoLat(e.target.value)}
                    placeholder="-23.5505"
                    className="focus:ring-fiap-red focus:border-fiap-red"
                  />
                </div>
                <div>
                  <Label htmlFor="destino-lon" className="text-xs text-gray-600">Longitude</Label>
                  <Input
                    id="destino-lon"
                    type="text"
                    value={destinoLon}
                    onChange={(e) => setDestinoLon(e.target.value)}
                    placeholder="-46.6333"
                    className="focus:ring-fiap-red focus:border-fiap-red"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={calculateRoute}
              className="w-full bg-fiap-red text-white py-3 px-4 rounded-md hover:bg-fiap-red/90 transition-colors"
            >
              <Route className="h-4 w-4 mr-2" />
              Calcular Rota Térmica
            </Button>
          </div>
          
          <div className="bg-fiap-gray-light rounded-lg p-4">
            <h3 className="font-semibold text-fiap-gray-dark mb-3">Como usar</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Coordenadas GPS</p>
                  <p className="text-xs text-gray-600">Digite latitude e longitude no formato decimal (ex: -23.5617, -46.6558)</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Locate className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Localização Atual</p>
                  <p className="text-xs text-gray-600">Use o botão para preencher automaticamente sua localização de origem</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Route className="h-5 w-5 text-fiap-red mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Rota no Google Maps</p>
                  <p className="text-xs text-gray-600">A rota será aberta diretamente no Google Maps em uma nova aba</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Para encontrar coordenadas de um local específico, 
            clique com o botão direito no Google Maps e selecione as coordenadas que aparecem no menu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
