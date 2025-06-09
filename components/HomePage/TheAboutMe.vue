<template>
  <section class="py-12 sm:py-16 lg:py-24 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 lg:mb-16">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-sans-bold text-max-pri mb-3 lg:mb-4">
          👋 Qui je suis ?
        </h2>
        <p class="text-lg sm:text-xl text-max-pri max-w-2xl mx-auto px-4">
          L'histoire derrière Max Explorer et pourquoi j'ai créé cet outil
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
        <!-- Photos de Quentin -->
        <div class="lg:order-1 space-y-4">
          <div class="bg-gradient-to-br from-max-action/20 to-max-special/20 rounded-2xl p-6 text-center">
            <div class="w-32 h-32 bg-max-bg rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-4xl">📸</span>
            </div>
            <p class="text-sm text-max-pri/60">
              Photo de Quentin
            </p>
          </div>
          <div class="bg-gradient-to-br from-max-special/20 to-max-action/20 rounded-2xl p-6 text-center">
            <div class="w-32 h-32 bg-max-bg rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-4xl">🚄</span>
            </div>
            <p class="text-sm text-max-pri/60">
              En voyage en train
            </p>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:order-2 lg:col-span-2">
          <div class="bg-max-bg/30 rounded-2xl p-6 sm:p-8 border border-max-sec/20">
            <h3 class="text-2xl font-sans-bold text-max-pri mb-6">
              Salut, moi c'est Quentin ! 🙋‍♂️
            </h3>

            <div class="space-y-4 text-base text-max-pri/80 leading-relaxed">
              <p>
                J'ai 25 ans et j'ai créé Max Explorer pour profiter à 100% de mon abonnement Max Jeune !
                Comme beaucoup d'entre vous, je trouvais frustrant de ne pas savoir quelles destinations
                étaient accessibles avec mon pass.
              </p>

              <p>
                Après avoir vécu quelques années au Canada, où le réseau ferroviaire est... disons...
                <em>inexistant</em> 😅, je me suis rendu compte de la chance incroyable qu'on a en France
                de pouvoir voyager si rapidement et facilement en train !
              </p>

              <p>
                C'est là que l'idée de Max Explorer est née : pourquoi ne pas créer un outil simple
                qui nous aide tous à explorer la France sans se prendre la tête avec les recherches compliquées ?
              </p>

              <div class="bg-max-action/20 rounded-xl p-4 mt-6">
                <p class="font-sans-semibold text-max-pri mb-2">
                  Mon objectif :
                </p>
                <p class="text-sm">
                  Que chaque détenteur de Max Jeune puisse découvrir facilement toutes les destinations
                  qui s'offrent à lui. J'espère sincèrement que cet outil vous sera aussi utile qu'à moi ! 🚀
                </p>
              </div>
            </div>

            <!-- Liens et contact -->
            <div class="mt-8 pt-6 border-t border-max-sec/20">
              <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href="https://quentinaslan.com"
                  target="_blank"
                  class="inline-flex items-center gap-2 bg-max-pri text-white font-sans-semibold px-4 py-2 rounded-lg hover:bg-max-pri/90 transition-colors"
                >
                  <span>🌐</span>
                  <span>Mon site web</span>
                </a>
                <a
                  href="mailto:contact@quentinaslan.com"
                  class="inline-flex items-center gap-2 bg-max-action text-max-pri font-sans-semibold px-4 py-2 rounded-lg hover:bg-max-action/90 transition-colors"
                >
                  <span>📧</span>
                  <span>Me contacter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
