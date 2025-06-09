<template>
  <div class="min-h-screen bg-max-bg">
    <!-- En-tête -->
    <section class="bg-max-pri py-12 sm:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm sm:text-base transition-colors duration-200"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </NuxtLink>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-sans-bold text-white mb-4">
            🎫 Comment réserver un train
          </h1>
          <p class="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Tout ce que tu dois savoir pour réserver tes trains Max Jeune depuis Max Explorer
          </p>
        </div>
      </div>
    </section>

    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <!-- Guide étape par étape -->
      <section class="mb-12">
        <h2 class="text-2xl sm:text-3xl font-sans-bold text-max-pri mb-8 text-center">
          📋 Guide de réservation étape par étape
        </h2>

        <div class="space-y-6">
          <!-- Étape 1 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-max-action text-white rounded-full flex items-center justify-center font-sans-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-sans-bold text-max-pri mb-3">
                  Lance une recherche depuis Max Explorer
                </h3>
                <p class="text-max-pri/80 leading-relaxed">
                  Utilise le formulaire sur la page principale avec tes critères de voyage (départ, destination, dates).
                </p>
              </div>
            </div>
          </div>

          <!-- Étape 2 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-max-action text-white rounded-full flex items-center justify-center font-sans-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-sans-bold text-max-pri mb-3">
                  Choisis une destination (si ce n'est pas encore fait)
                </h3>
                <p class="text-max-pri/80 leading-relaxed">
                  Explore la carte ou la liste des résultats pour choisir ta destination idéale.
                </p>
              </div>
            </div>
          </div>

          <!-- Étape 3 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-max-action text-white rounded-full flex items-center justify-center font-sans-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-sans-bold text-max-pri mb-3">
                  Sélectionne ton trajet aller
                </h3>
                <div class="space-y-4">
                  <div class="bg-max-special/20 rounded-lg p-4">
                    <h4 class="font-sans-semibold text-max-pri mb-2">
                      ✅ Si c'est un train direct
                    </h4>
                    <p class="text-sm text-max-pri/80">
                      Clique sur "Réserver ce train sur SNCF Connect" - tu seras redirigé directement avec les bonnes informations.
                    </p>
                  </div>
                  <div class="bg-max-action/20 rounded-lg p-4">
                    <h4 class="font-sans-semibold text-max-pri mb-2">
                      🔄 S'il y a une correspondance
                    </h4>
                    <p class="text-sm text-max-pri/80">
                      Réserve d'abord le premier train, puis le second en cliquant sur les liens disponibles sur Max Explorer. Malheureusement, je ne peux pas encore générer un lien direct pour les trajets avec correspondance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4 -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-max-action text-white rounded-full flex items-center justify-center font-sans-bold text-sm flex-shrink-0 mt-1">
                4
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-sans-bold text-max-pri mb-3">
                  Refais la même chose pour ton trajet retour
                </h3>
                <p class="text-max-pri/80 leading-relaxed">
                  Répète le processus pour ton voyage de retour si tu as planifié un aller-retour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pourquoi cette solution -->
      <section class="mb-12">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 class="text-xl font-sans-bold text-max-pri mb-6">
            🤔 Pourquoi cette solution temporaire ?
          </h2>
          <div class="space-y-4">
            <p class="text-max-pri/80 leading-relaxed">
              En tant que développeur indépendant, je n'ai pas accès aux APIs de réservation officielles de la SNCF. Ces APIs sont généralement réservées aux partenaires commerciaux officiels.
            </p>
            <p class="text-max-pri/80 leading-relaxed">
              La solution actuelle avec l'IA de SNCF Connect est un "hack" créatif qui me permet de t'aider malgré ces limitations techniques. C'est la seule façon "bricolable" en attendant une éventuelle collaboration officielle.
            </p>
            <div class="bg-max-special/20 rounded-lg p-4">
              <p class="text-sm font-sans-bold text-max-pri">
                🤞 On croise les doigts pour que la SNCF propose bientôt une solution plus simple pour les développeurs indépendants !
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Mise à jour des données -->
      <section class="mb-12">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 class="text-xl font-sans-bold text-max-pri mb-6">
            🌅 Mise à jour quotidienne à 7h du matin
          </h2>
          <div class="space-y-4">
            <p class="text-max-pri/80 leading-relaxed">
              Chaque matin à 7h, mon serveur se connecte automatiquement à l'API publique de la SNCF pour récupérer tous les trains éligibles Max Jeune à 0€ pour le mois entier.
            </p>
            <p class="text-max-pri/80 leading-relaxed">
              Cette synchronisation quotidienne garantit que tu as accès aux informations les plus récentes sur la disponibilité des trains gratuits.
            </p>
            <div class="bg-max-action/20 rounded-lg p-4">
              <h3 class="font-sans-semibold text-max-pri mb-2">
                💡 Conseil pro
              </h3>
              <p class="text-sm text-max-pri/80">
                Plus tu cherches tôt dans la journée (idéalement avant 10h), plus tu as de chances de trouver des places disponibles sur les trains populaires !
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section>
        <div class="bg-max-pri/5 rounded-2xl p-6 sm:p-8 border border-max-pri/20">
          <h2 class="text-xl font-sans-bold text-max-pri mb-4 text-center">
            Une question sur le processus ?
          </h2>
          <p class="text-max-pri/80 mb-6 text-center">
            N'hésite pas à me contacter si tu rencontres des difficultés ou si tu as des suggestions d'amélioration !
          </p>
          <div class="text-center">
            <a
              href="mailto:max-explorer@quentinaslan.com"
              class="inline-flex items-center gap-3 bg-max-action hover:bg-max-action/90 text-max-pri font-sans-bold text-base px-6 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>📧</span>
              <span>max-explorer@quentinaslan.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Métadonnées pour le SEO
useHead({
  title: 'Comment réserver un train - Max Explorer',
  meta: [
    {
      name: 'description',
      content: 'Guide complet pour réserver tes trains Max Jeune depuis Max Explorer. Processus étape par étape et explications techniques.',
    },
  ],
})
</script>
