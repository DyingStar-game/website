'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Rocket, Edit, Trash2, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useRoadmap } from '@/hooks/use-roadmap';
import { useSimpleAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoadmapItem } from '@/lib/roadmap-data';
import { useState } from 'react';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'planned':
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case 'future':
      return <Rocket className="w-5 h-5 text-purple-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'in-progress':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'planned':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'future':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in-progress':
      return 'En cours';
    case 'planned':
      return 'Planifié';
    case 'future':
      return 'Futur';
    default:
      return 'À venir';
  }
};

export default function RoadmapPage() {
  const { roadmapItems, addRoadmapItem, updateRoadmapItem, deleteRoadmapItem, isLoading } = useRoadmap();
  const { user } = useSimpleAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [formData, setFormData] = useState({
    phase: '',
    title: '',
    status: 'planned' as RoadmapItem['status'],
    progress: 0,
    quarter: '',
    items: ['']
  });

  const resetForm = () => {
    setFormData({
      phase: '',
      title: '',
      status: 'planned',
      progress: 0,
      quarter: '',
      items: ['']
    });
    setEditingItem(null);
  };

  const handleEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setFormData({
      phase: item.phase,
      title: item.title,
      status: item.status,
      progress: item.progress,
      quarter: item.quarter,
      items: [...item.items]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette phase ?')) {
      deleteRoadmapItem(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const patch = {
        phase: formData.phase,
        title: formData.title,
        status: formData.status,
        progress: formData.progress,
        quarter: formData.quarter,
        items: formData.items.filter(item => item.trim() !== '')
      };
      updateRoadmapItem(editingItem.id, patch);
    } else {
      const newItem = {
        phase: formData.phase,
        title: formData.title,
        status: formData.status,
        progress: formData.progress,
        quarter: formData.quarter,
        items: formData.items.filter(item => item.trim() !== '')
      };
      addRoadmapItem(newItem);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, '']
    });
  };

  const removeItemField = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItemField = (index: number, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({
      ...formData,
      items: newItems
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Roadmap
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Suivez l&apos;évolution de Dying Star et découvrez les fonctionnalités à venir dans notre feuille de route détaillée.
            </p>
            
            {/* Bouton Ajouter pour les admins */}
            {user?.isAdmin && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      onClick={() => {
                        resetForm();
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une Phase
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {editingItem ? 'Modifier la Phase' : 'Ajouter une Phase'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phase">Phase</Label>
                          <Input
                            id="phase"
                            value={formData.phase}
                            onChange={(e) => setFormData({...formData, phase: e.target.value})}
                            placeholder="Phase 1"
                            className="bg-gray-800 border-gray-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="quarter">Trimestre</Label>
                          <Input
                            id="quarter"
                            value={formData.quarter}
                            onChange={(e) => setFormData({...formData, quarter: e.target.value})}
                            placeholder="Q1 2024"
                            className="bg-gray-800 border-gray-600 text-white"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="title">Titre</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="Foundation & Core Systems"
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="status">Statut</Label>
                        <Select value={formData.status} onValueChange={(value: RoadmapItem['status']) => setFormData({...formData, status: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="completed">Terminé</SelectItem>
                            <SelectItem value="in-progress">En cours</SelectItem>
                            <SelectItem value="planned">Planifié</SelectItem>
                            <SelectItem value="future">Futur</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="progress">Progression (%)</Label>
                        <Input
                          id="progress"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.progress}
                          onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                          placeholder="0"
                          className="bg-gray-800 border-gray-600 text-white"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <Label>Éléments de la phase</Label>
                          <Button 
                            type="button" 
                            onClick={addItemField} 
                            size="sm" 
                            className="bg-cyan-600 hover:bg-cyan-700 text-white border-0"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {formData.items.map((item, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={item}
                                onChange={(e) => updateItemField(index, e.target.value)}
                                placeholder="Élément de la roadmap"
                                className="bg-gray-800 border-gray-600 text-white"
                              />
                              {formData.items.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeItemField(index)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-purple-600">
                          {editingItem ? 'Modifier' : 'Ajouter'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Roadmap Content */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        {getStatusIcon(item.status)}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {item.phase}: {item.title}
                          </h3>
                          <div className="flex items-center space-x-4">
                            <p className="text-gray-400">{item.quarter}</p>
                            <span className="text-sm font-semibold text-cyan-400">
                              {item.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(item.status)} px-4 py-2`}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </div>
                    
                    {/* Boutons d'édition pour les admins */}
                    {user?.isAdmin && (
                      <div className="flex space-x-2 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          className="border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          className="hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progression</span>
                        <span className="text-sm font-semibold text-white">{item.progress}%</span>
                      </div>
                      <Progress 
                        value={item.progress} 
                        className="h-2 bg-white/10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.items.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'in-progress' ? 'bg-yellow-500' :
                            item.status === 'planned' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`} />
                          <span className="text-gray-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-500/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Rejoignez le Développement
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Dying Star est un projet open source. Contribuez au développement et aidez-nous à façonner l&apos;avenir du jeu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/DyingStar-game"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Contribuer sur GitHub
              </a>
              <a
                href="#"
                className="border border-white/20 hover:border-cyan-500/50 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:bg-white/10"
              >
                Rejoindre Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}