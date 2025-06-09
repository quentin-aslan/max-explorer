<template>
  <div class="relative min-h-screen bg-max-bg">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center">
      <!-- Image d'arrière-plan -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        :style="{ backgroundImage: `url('${bgUrl}')` }"
      />

      <!-- Contenu principal -->
      <div class="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <!-- Section texte et présentation -->
          <div class="order-1 lg:order-1 space-y-6 lg:space-y-8">
            <!-- Logo et titre principal -->
            <div class="text-center lg:text-left">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-sans-bold text-max-pri mb-3 lg:mb-4">
                Max Explorer
              </h1>
              <p class="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-max-pri font-sans-medium leading-tight">
                Découvre la France en train avec ton Max Jeune
              </p>
            </div>

            <!-- Proposition de valeur -->
            <div class="hidden lg:block bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 class="text-lg sm:text-xl font-sans-semibold text-max-pri mb-3 lg:mb-4">
                🚄 Trouve tes destinations à 0€ !
              </h2>
              <p class="text-base sm:text-lg text-max-pri leading-relaxed mb-4 lg:mb-6">
                Ton <strong class="text-max-action bg-max-pri px-2 py-1 rounded font-sans-bold">MAX JEUNE</strong>
                te donne accès à des milliers de trajets gratuits. Je t'aide à les découvrir en 3 clics !
              </p>

              <!-- Features list -->
              <div class="grid sm:grid-cols-2 gap-3 lg:gap-4">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-max-special rounded-full flex-shrink-0" />
                  <span class="text-sm sm:text-base text-max-pri">Trajets 100% gratuits</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-max-special rounded-full flex-shrink-0" />
                  <span class="text-sm sm:text-base text-max-pri">Aller simple ou retour</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-max-special rounded-full flex-shrink-0" />
                  <span class="text-sm sm:text-base text-max-pri">Carte interactive</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-max-special rounded-full flex-shrink-0" />
                  <span class="text-sm sm:text-base text-max-pri">Mis à jour quotidiennement</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section formulaire de recherche -->
          <div class="order-2 lg:order-2">
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-max-sec/30">
              <HomeSearch />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Les 3 types de recherche - SIMPLIFIÉE -->
    <section class="py-12 sm:py-16 lg:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-max-pri mb-3 lg:mb-4">
            🎯 Les 3 types de recherche
          </h2>
          <p class="text-lg sm:text-xl text-max-pri max-w-2xl mx-auto px-4">
            Comprends les différentes façons d'utiliser Max Explorer
          </p>
        </div>

        <div class="space-y-8">
          <!-- Cas 1: Weekend/Aller-retour - MIS EN AVANT -->
          <div class="bg-gradient-to-r from-max-action/20 to-max-special/20 rounded-xl p-6 sm:p-8 border-2 border-max-action/40 shadow-lg">
            <div class="text-center mb-6">
              <span class="bg-max-action text-max-pri px-4 py-2 rounded-full text-base font-sans-bold">⭐ POPULAIRE</span>
            </div>
            <div class="text-center">
              <h4 class="font-sans-bold text-max-pri mb-6 text-xl">
                🏖️ Planifier un weekend
              </h4>
              <div class="max-w-2xl mx-auto">
                <p class="text-lg font-sans-semibold text-max-pri mb-2">
                  <strong>Tu saisis :</strong> Paris + 15 mars + 17 mars
                </p>
                <div class="text-3xl my-4">
                  ↓
                </div>
                <p class="text-lg font-sans-semibold text-max-pri">
                  <strong>Tu obtiens :</strong> Seulement les villes avec aller <strong>ET</strong> retour disponibles
                </p>
              </div>
            </div>
          </div>

          <!-- Cas 2: Explorer -->
          <div class="text-center py-6">
            <h4 class="font-sans-bold text-max-pri mb-4 text-lg">
              🗺️ Explorer les possibilités
            </h4>
            <p class="text-base text-max-pri mb-2">
              <strong>Tu saisis :</strong> Paris + 15 mars
            </p>
            <p class="text-base text-max-pri">
              <strong>Tu obtiens :</strong> Toutes les villes accessibles depuis Paris
            </p>
          </div>

          <!-- Cas 3: Vérifier un trajet -->
          <div class="text-center py-6">
            <h4 class="font-sans-bold text-max-pri mb-4 text-lg">
              🎯 Vérifier un trajet spécifique
            </h4>
            <p class="text-base text-max-pri mb-2">
              <strong>Tu saisis :</strong> Paris + Lyon + 15 mars
            </p>
            <p class="text-base text-max-pri">
              <strong>Tu obtiens :</strong> Disponibilité de ce trajet précis
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Derrière les coulisses -->
    <section class="py-12 sm:py-16 lg:py-24 bg-max-bg">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-max-pri mb-3 lg:mb-4">
            🔧 Derrière les coulisses
          </h2>
          <p class="text-lg sm:text-xl text-max-pri max-w-2xl mx-auto px-4">
            Comment je récupère et traite tes données pour que tout fonctionne
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Récupération des données -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-max-action rounded-full flex items-center justify-center">
                <span class="text-2xl">🌅</span>
              </div>
              <div>
                <h3 class="text-xl font-sans-bold text-max-pri">
                  Récupération quotidienne
                </h3>
                <p class="text-max-pri/60 text-sm">
                  Chaque jour à 7h du matin
                </p>
              </div>
            </div>
            <p class="text-sm text-max-pri/80 leading-relaxed mb-4">
              Mon serveur se connecte automatiquement à l'API SNCF pour récupérer tous les trains éligibles Max Jeune à 0€ pour le mois entier.
            </p>
            <div class="bg-max-action/20 rounded-lg p-4">
              <p class="text-sm font-sans-bold text-max-pri">
                💡 Astuce : Plus tu cherches tôt dans la journée, plus tu as de chances de trouver des places disponibles !
              </p>
            </div>
          </div>

          <!-- Traitement et recherche -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-max-special rounded-full flex items-center justify-center">
                <span class="text-2xl">⚡</span>
              </div>
              <div>
                <h3 class="text-xl font-sans-bold text-max-pri">
                  Recherche rapide
                </h3>
                <p class="text-max-pri/60 text-sm">
                  D'une seconde à 30 secondes max
                </p>
              </div>
            </div>
            <p class="text-sm text-max-pri/80 leading-relaxed mb-4">
              Quand tu fais une recherche, je consulte ma base de données optimisée plutôt que l'API SNCF en direct. C'est pourquoi c'est si rapide !
            </p>
            <div class="bg-max-special/20 rounded-lg p-4">
              <p class="text-sm font-sans-bold text-max-pri">
                🚀 Bientôt : Données en temps réel dès que la SNCF donne son accord !
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Contact -->
    <section class="py-12 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="bg-max-pri/5 rounded-2xl lg:rounded-3xl p-6 sm:p-8 border border-max-pri/20">
          <h2 class="text-2xl sm:text-3xl font-sans-bold text-max-pri mb-4">
            Une question ? Un bug ?
          </h2>
          <p class="text-base sm:text-lg text-max-pri/80 mb-6 max-w-2xl mx-auto">
            Contacte-moi directement pour toute question ou amélioration !
          </p>
          <div class="space-y-4">
            <a
              href="mailto:max-explorer@quentinaslan.com"
              class="inline-flex items-center gap-3 bg-max-action hover:bg-max-action/90 text-max-pri font-sans-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>📧</span>
              <span class="text-sm lg:text-base">max-explorer@quentinaslan.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-12 sm:py-16 bg-max-pri">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-white mb-4 sm:mb-6">
          Prêt pour ton prochain voyage à 0€ ?
        </h2>
        <p class="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          Des milliers de destinations t'attendent avec ton Max Jeune
        </p>
        <div class="space-y-4">
          <button
            class="bg-max-action hover:bg-max-action/90 text-max-pri font-sans-bold text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
            @click="scrollToTop"
          >
            <span>🚀</span>
            <span>Commencer ma recherche gratuite</span>
          </button>
          <p class="text-white/70 text-sm">
            ⏰ Recherche maintenant pour plus de choix !
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const bgUrl = '/train-illustration.svg'

// Métadonnées pour le SEO
useHead({
  title: 'Max Explorer - Découvre la France avec ton abonnement Max Jeune',
  meta: [
    {
      name: 'description',
      content: 'Trouve toutes les destinations accessibles avec ton abonnement Max Jeune. Recherche par date, destination et planifie tes voyages en train facilement.',
    },
  ],
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
