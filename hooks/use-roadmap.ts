'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RoadmapItem } from '@/lib/roadmap-data';

export function useRoadmap() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoadmapItems = useCallback(async () => {
    try {
      console.log('🔄 Début du chargement des éléments roadmap...');
      setIsLoading(true);
      setError(null);

      console.log('📡 Tentative de connexion à Supabase...');
      console.log('  Client Supabase:', supabase ? '✅ Initialisé' : '❌ Non initialisé');

      if (!supabase) {
        setError('Configuration Supabase manquante');
        setRoadmapItems([]);
        return;
      }

      const { data, error: supabaseError } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('📊 Résultat de la requête:');
      console.log('  Data:', data);
      console.log('  Error:', supabaseError);
      
      if (supabaseError) {
        console.error('❌ Erreur Supabase détaillée:');
        console.error('  Code:', supabaseError.code);
        console.error('  Message:', supabaseError.message);
        console.error('  Détails:', supabaseError.details);
        console.error('  Hint:', supabaseError.hint);
        setError('Erreur lors du chargement des données');
        setRoadmapItems([]);
        return;
      }

      console.log('✅ Données chargées avec succès:', data?.length, 'éléments');
      setRoadmapItems((data as RoadmapItem[]) || []);
    } catch (err) {
      console.error('💥 Erreur JavaScript:', err);
      console.error('  Type:', typeof err);
      console.error('  Stack:', (err as Error)?.stack);
      setError('Erreur de connexion');
      setRoadmapItems([]);
    } finally {
      console.log('🏁 Fin du chargement');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoadmapItems();
  }, [loadRoadmapItems]);

  const addRoadmapItem = async (
    item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      console.log('➕ Ajout d\'un élément roadmap:', item);
      if (!supabase) {
        setError('Configuration Supabase manquante');
        return;
      }
      // Ne PAS envoyer created_at/updated_at : gérés par la DB
      const { error: insertError } = await supabase
        .from('roadmap_items')
        .insert([item]);

      if (insertError) {
        console.error("❌ Erreur lors de l'ajout:", insertError);
        console.error('  Code:', insertError.code);
        console.error('  Message:', insertError.message);
        setError("Erreur lors de l'ajout de l'élément");
        return;
      }

      console.log('✅ Élément ajouté avec succès');
      await loadRoadmapItems();
    } catch (err) {
      console.error('💥 Erreur lors de l\'ajout:', err);
      setError("Erreur lors de l'ajout");
    }
  };

  const updateRoadmapItem = async (id: string, patch: Partial<RoadmapItem>) => {
    try {
      console.log('✏️ Mise à jour de l\'élément:', id, patch);
      if (!supabase) {
        setError('Configuration Supabase manquante');
        return;
      }
      // On n’envoie QUE ce qui change, le trigger mettra updated_at à jour
      const { error: updateError } = await supabase
        .from('roadmap_items')
        .update(patch)
        .eq('id', id);

      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        console.error('  Code:', updateError.code);
        console.error('  Message:', updateError.message);
        setError('Erreur lors de la mise à jour');
        return;
      }
      console.log('✅ Élément mis à jour avec succès');
      await loadRoadmapItems();
    } catch (err) {
      console.error('💥 Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const deleteRoadmapItem = async (id: string) => {
    try {
      console.log('🗑️ Suppression de l\'élément:', id);
      if (!supabase) {
        setError('Configuration Supabase manquante');
        return;
      }
      const { error: deleteError } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('❌ Erreur lors de la suppression:', deleteError);
        console.error('  Code:', deleteError.code);
        console.error('  Message:', deleteError.message);
        setError('Erreur lors de la suppression');
        return;
      }
      console.log('✅ Élément supprimé avec succès');
      await loadRoadmapItems();
    } catch (err) {
      console.error('💥 Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression');
    }
  };

  // (Optionnel) Realtime pour auto-refresh quand ça change côté DB
  useEffect(() => {
    console.log('🔔 Configuration du canal realtime...');
    if (!supabase) {
      console.warn('Supabase non configuré, realtime désactivé');
      return;
    }
    const channel = supabase
      .channel('dyingstar-roadmap')
      .on(
        'postgres_changes',
        { event: '*', schema: 'dyingstar', table: 'roadmap_items' },
        (payload) => {
          console.log('🔔 Changement détecté dans la DB:', payload);
          // On rafraîchit à chaque insert/update/delete
          loadRoadmapItems();
        }
      )
      .subscribe();

    console.log('✅ Canal realtime configuré');

    return () => {
      console.log('🔌 Déconnexion du canal realtime');
      supabase?.removeChannel(channel);
    };
  }, [loadRoadmapItems]);

  return {
    roadmapItems,
    isLoading,
    error,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    refreshRoadmap: loadRoadmapItems,
  };
}