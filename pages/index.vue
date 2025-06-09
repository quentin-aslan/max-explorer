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

    <!-- Section Planifie ton weekend -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-max-action/10 to-max-special/10 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-max-action/20 shadow-lg">
          <div class="text-center">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-max-pri mb-4 lg:mb-6">
              🏖️ Planifie ton weekend en 3 clics
            </h2>
            <p class="text-lg sm:text-xl text-max-pri/90 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
              Rentre seulement ta ville de départ et tes dates, on se charge de te proposer toutes les destinations possibles pour ton weekend !
            </p>

            <div class="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <div class="text-center">
                <div class="w-12 h-12 bg-max-action rounded-full mx-auto mb-3 flex items-center justify-center text-white font-sans-bold">
                  1
                </div>
                <p class="text-sm font-sans-semibold text-max-pri">
                  Ta ville de départ
                </p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-max-action rounded-full mx-auto mb-3 flex items-center justify-center text-white font-sans-bold">
                  2
                </div>
                <p class="text-sm font-sans-semibold text-max-pri">
                  Tes dates de weekend
                </p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-max-special rounded-full mx-auto mb-3 flex items-center justify-center text-white font-sans-bold">
                  ✨
                </div>
                <p class="text-sm font-sans-semibold text-max-pri">
                  Toutes tes destinations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Comment ça marche -->
    <section class="py-12 sm:py-16 lg:py-24 bg-max-bg">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 lg:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-max-pri mb-3 lg:mb-4">
            Comment ça marche
          </h2>
          <p class="text-lg sm:text-xl text-max-pri max-w-2xl mx-auto px-4">
            Un processus simple pour découvrir et réserver tes voyages
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Données fraîches -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-max-action rounded-full flex items-center justify-center">
                <span class="text-2xl">🌅</span>
              </div>
              <div>
                <h3 class="text-xl font-sans-bold text-max-pri">
                  Données toujours fraîches
                </h3>
                <p class="text-max-pri/60 text-sm">
                  Mise à jour quotidienne à 7h
                </p>
              </div>
            </div>
            <p class="text-sm text-max-pri/80 leading-relaxed mb-4">
              Chaque matin, toutes les disponibilités Max Jeune du mois sont automatiquement mises à jour pour te garantir les informations les plus récentes.
            </p>
            <div class="bg-max-action/20 rounded-lg p-4">
              <p class="text-sm font-sans-bold text-max-pri">
                Plus tu cherches tôt dans la journée, plus tu as de chances de trouver des places !
              </p>
            </div>
          </div>

          <!-- Réservation facile -->
          <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-max-special rounded-full flex items-center justify-center">
                <span class="text-2xl">🎫</span>
              </div>
              <div>
                <h3 class="text-xl font-sans-bold text-max-pri">
                  Réservation en un clic
                </h3>
                <p class="text-max-pri/60 text-sm">
                  Redirection intelligente vers SNCF Connect
                </p>
              </div>
            </div>
            <p class="text-sm text-max-pri/80 leading-relaxed mb-4">
              Une fois ta destination choisie, je te redirige vers SNCF Connect avec toutes tes informations déjà remplies. Plus qu'à confirmer ta réservation !
            </p>
            <div class="bg-max-special/20 rounded-lg p-4">
              <p class="text-sm font-sans-bold text-max-pri">
                Processus optimisé pour gagner du temps sur ta réservation
              </p>
            </div>
          </div>
        </div>

        <!-- Bouton d'accès au guide détaillé -->
        <div class="text-center mt-12">
          <NuxtLink
            to="/comment-reserver"
            class="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-max-pri font-sans-bold text-base px-8 py-4 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-max-sec/30"
          >
            <span>📖</span>
            <span>Guide complet de réservation</span>
          </NuxtLink>
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
