# SSI/GRC Application - TODO

## Phase 1: Schéma Base de Données et Configuration
- [ ] Créer le schéma Drizzle complet avec 37 entités
- [ ] Définir les enums (ControlType, RiskLevel, AuditType, etc.)
- [ ] Configurer les relations entre entités
- [ ] Pousser les migrations vers la base de données
- [ ] Créer les helpers de requêtes dans server/db.ts

## Phase 2: Architecture Frontend et Navigation
- [x] Configurer le thème professionnel (couleurs, typographie)
- [x] Créer le DashboardLayout avec sidebar navigation
- [x] Mettre en place le système de routing pour tous les modules
- [x] Créer les composants UI réutilisables (cards, tables, forms)
- [x] Implémenter le système d'authentification et gestion des rôles

## Phase 3: Module Organisations et Gouvernance
- [ ] CRUD Organisations avec multi-tenant
- [ ] CRUD Entités avec hiérarchie (parentEntityId)
- [ ] CRUD Départements avec managers
- [ ] CRUD Processus métier avec propriétaires
- [ ] CRUD Rôles avec permissions JSON
- [ ] CRUD Comités avec membres
- [ ] CRUD Décisions avec traçabilité

## Phase 4: Module Risques et Contrôles
- [ ] CRUD Risques avec propriétaires et statuts
- [ ] CRUD Scénarios de risques
- [ ] CRUD Impacts multi-dimensionnels (financier, opérationnel, légal, réputationnel)
- [ ] CRUD Évaluations de risques (probabilité, impact, niveau)
- [ ] CRUD Mitigations (lien risques-contrôles)
- [ ] CRUD Contrôles avec types et catégories
- [ ] CRUD Évaluations de contrôles (efficacité)
- [ ] Upload et gestion des preuves de contrôles

## Phase 5: Module Conformité et Audits
- [ ] CRUD Cadres de conformité (ISO 27001, NIST CSF, CIS, RGPD, EBIOS RM)
- [ ] CRUD Exigences de conformité avec externalId
- [ ] CRUD Mappings contrôles-exigences
- [ ] CRUD Cross-mappings entre référentiels (ISO ↔ NIST ↔ CIS)
- [ ] CRUD Preuves de conformité avec validation
- [ ] CRUD Politiques internes avec versions
- [ ] CRUD Évaluations de conformité avec pourcentage
- [ ] CRUD Audits avec types et statuts
- [ ] CRUD Périmètre d'audit (entités, processus, contrôles)
- [ ] CRUD Constatations d'audit avec sévérité
- [ ] CRUD Planification d'audits récurrents

## Phase 6: Module Actions et EBIOS RM
- [ ] CRUD Plans d'action avec propriétaires
- [ ] CRUD Actions avec priorités et échéances
- [ ] CRUD Commentaires collaboratifs sur actions
- [ ] Upload et gestion des preuves de fermeture
- [ ] CRUD Études EBIOS RM
- [ ] CRUD Scénarios EBIOS (acteurs, vecteurs, impacts)
- [ ] CRUD Mappings scénarios EBIOS ↔ risques

## Phase 7: Tableau de Bord Synthétique
- [ ] Indicateurs clés (risques critiques, conformité, actions en retard)
- [ ] Graphiques de tendance (évolution des risques, conformité)
- [ ] Alertes prioritaires avec filtrage
- [ ] Filtrage par entité et période
- [ ] Exports PDF/Excel des rapports

## Phase 8: Tests et Documentation
- [ ] Tests unitaires pour tous les routers tRPC
- [ ] Tests d'intégration pour les workflows critiques
- [ ] Documentation utilisateur
- [ ] Guide d'installation local (Windows 11)
- [ ] Guide de déploiement o2switch
- [ ] Checkpoint final et livraison
