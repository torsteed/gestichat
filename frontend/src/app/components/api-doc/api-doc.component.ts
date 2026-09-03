import { Component } from '@angular/core';

@Component({
  selector: 'app-api-doc',
  templateUrl: './api-doc.component.html',
  styleUrls: ['./api-doc.component.scss']
})
export class ApiDocComponent {
  apiUrl = 'http://localhost:3000/api';
  
  endpoints = [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Récupère la liste de tous les utilisateurs',
      response: 'User[]',
      parameters: []
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Crée un nouvel utilisateur',
      response: 'User',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Nom de l\'utilisateur' }
      ]
    },
    {
      method: 'GET',
      path: '/api/cats',
      description: 'Récupère la liste de tous les chats',
      response: 'Cat[]',
      parameters: []
    },
    {
      method: 'POST',
      path: '/api/cats',
      description: 'Crée un nouveau chat',
      response: 'Cat',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Nom du chat' },
        { name: 'active', type: 'boolean', required: false, description: 'Statut du chat (défaut: true)' }
      ]
    },
    {
      method: 'PUT',
      path: '/api/cats/:id',
      description: 'Met à jour un chat existant',
      response: 'Cat',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'ID du chat' },
        { name: 'name', type: 'string', required: false, description: 'Nouveau nom du chat' },
        { name: 'active', type: 'boolean', required: false, description: 'Nouveau statut du chat' }
      ]
    },
    {
      method: 'GET',
      path: '/api/cats/:id/meals',
      description: 'Récupère tous les repas pour un chat spécifique',
      response: 'Meal[]',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'ID du chat' }
      ]
    },
    {
      method: 'GET',
      path: '/api/meals',
      description: 'Récupère la liste des repas avec filtrage optionnel',
      response: 'Meal[]',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Nombre maximum de résultats' },
        { name: 'catId', type: 'number', required: false, description: 'Filtrer par ID de chat' },
        { name: 'userId', type: 'number', required: false, description: 'Filtrer par ID d\'utilisateur' }
      ]
    },
    {
      method: 'POST',
      path: '/api/meals',
      description: 'Crée un nouveau repas',
      response: 'Meal',
      parameters: [
        { name: 'cat_id', type: 'number', required: true, description: 'ID du chat' },
        { name: 'user_id', type: 'number', required: true, description: 'ID de l\'utilisateur' },
        { name: 'fed_at', type: 'string', required: false, description: 'Date/heure du repas (défaut: maintenant)' },
        { name: 'sachets_used', type: 'number', required: false, description: 'Nombre de sachets utilisés (défaut: 1)' }
      ]
    },
    {
      method: 'DELETE',
      path: '/api/meals/:id',
      description: 'Supprime un repas',
      response: '{ message: string }',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'ID du repas' }
      ]
    },
    {
      method: 'GET',
      path: '/api/stock/current',
      description: 'Récupère le stock actuel calculé',
      response: '{ currentStock: number }',
      parameters: []
    },
    {
      method: 'GET',
      path: '/api/stock/history',
      description: 'Récupère l\'historique des réapprovisionnements',
      response: 'Stock[]',
      parameters: []
    },
    {
      method: 'POST',
      path: '/api/stock',
      description: 'Ajoute un réapprovisionnement au stock',
      response: 'Stock',
      parameters: [
        { name: 'sachets_added', type: 'number', required: true, description: 'Nombre de sachets ajoutés' },
        { name: 'user_id', type: 'number', required: true, description: 'ID de l\'utilisateur' },
        { name: 'note', type: 'string', required: false, description: 'Note optionnelle' }
      ]
    },
    {
      method: 'GET',
      path: '/api/dashboard/latest-meals-by-cat',
      description: 'Récupère les derniers repas par chat (pour le dashboard)',
      response: 'Array<{ cat: Cat, latestMeal: Meal }>',
      parameters: []
    },
    {
      method: 'GET',
      path: '/api/dashboard/recent-meals',
      description: 'Récupère les repas récents (pour le dashboard)',
      response: 'Meal[]',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Nombre maximum de résultats (défaut: 20)' }
      ]
    }
  ];
  
  models = [
    {
      name: 'User',
      properties: [
        { name: 'id', type: 'number', description: 'Identifiant unique' },
        { name: 'name', type: 'string', description: 'Nom de l\'utilisateur' }
      ]
    },
    {
      name: 'Cat',
      properties: [
        { name: 'id', type: 'number', description: 'Identifiant unique' },
        { name: 'name', type: 'string', description: 'Nom du chat' },
        { name: 'active', type: 'boolean', description: 'Statut du chat (actif/inactif)' }
      ]
    },
    {
      name: 'Meal',
      properties: [
        { name: 'id', type: 'number', description: 'Identifiant unique' },
        { name: 'cat_id', type: 'number', description: 'ID du chat' },
        { name: 'user_id', type: 'number', description: 'ID de l\'utilisateur' },
        { name: 'fed_at', type: 'string', description: 'Date/heure du repas' },
        { name: 'sachets_used', type: 'number', description: 'Nombre de sachets utilisés' },
        { name: 'created_at', type: 'string', description: 'Date de création' }
      ]
    },
    {
      name: 'Stock',
      properties: [
        { name: 'id', type: 'number', description: 'Identifiant unique' },
        { name: 'sachets_added', type: 'number', description: 'Nombre de sachets ajoutés' },
        { name: 'added_at', type: 'string', description: 'Date de l\'ajout' },
        { name: 'user_id', type: 'number', description: 'ID de l\'utilisateur' },
        { name: 'note', type: 'string', description: 'Note optionnelle' }
      ]
    }
  ];
}
