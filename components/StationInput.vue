<template>
  <div class="relative">
    <input
        :id="domId"
        v-model="displayValue"
        type="text"
        class="block px-5 pb-3 pt-5 w-full font-sans-semibold text-max-pri bg-white rounded-lg border border-max-sec appearance-none
             dark:text-white focus:outline-none focus:ring-0 focus:border-max-pri peer"
        :class="{ 'border-red-500': !isValid && displayValue }"
        placeholder=""
        @input="handleInput"
        @focus="showDropdown = true"
        @blur="handleBlur"
        :disabled="isLoading || loadError"
    >
    <!-- Cross icon to clear input -->
    <div
        v-if="displayValue"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-max-sec hover:text-max-pri"
        @mousedown.prevent="clearInput"
    >
        <i class="pi pi-times"></i>
    </div>
    <label
        :for="domId"
        class="absolute start-5 text-max-sec font-sans-semibold text-xl duration-300
      transform-translate-y-4 scale-50 top-0 z-10 origin-[0] peer-placeholder-shown:scale-100
      peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4"
    >
      {{ placeholder }}
    </label>

    <!-- Dropdown des suggestions -->
    <div
        v-if="showDropdown && filteredStations.length > 0"
        class="absolute left-0 right-0 mt-1 bg-white border border-max-sec rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
    >
      <!-- Message de chargement -->
      <div v-if="isLoading" class="text-max-pri text-sm mt-1">
        Chargement des gares en cours...
      </div>

      <!-- Message d'erreur de chargement -->
      <div v-if="loadError" class="text-red-500 text-sm mt-1">
        Impossible de charger les gares. Veuillez réessayer ultérieurement.
      </div>

      <ul>
        <li
            v-for="station in filteredStations"
            :key="station.value"
            class="px-5 py-2 cursor-pointer hover:bg-max-bg text-max-pri font-sans-medium"
            @mousedown="selectStation(station)"
        >
          {{ station.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Station {
  label: string;
  value: string;
}

const props = defineProps<{
  placeholder: string
}>()

const emit = defineEmits(['update:modelValue', 'valid-change'])
const inputValue = defineModel<string>()
const displayValue = ref('')

const randomId = Math.floor(Math.random() * 1000)
const domId = computed(() => props.placeholder ?? randomId)

const showDropdown = ref(false)
const isValid = ref(false)

const stations = ref<Station[]>([])
const isLoading = ref(false)
const loadError = ref(false)

const fetchStations = async () => {
  isLoading.value = true
  loadError.value = false

  try {
    const response = await fetch('/api/train-stations')
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des gares')
    }

    const data = await response.json()

    stations.value = data.map((station: { name: string }) => ({
      label: station.name,
      value: station.name
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des gares:', error)
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

const filteredStations = ref<Station[]>([])

const findLabelForValue = (value: string | undefined) => {
  if (!value) return ''
  const station = stations.value.find(s => s.value === value)
  return station ? station.label : value
}

watch(inputValue, (newValue) => {
  if (newValue) {
    displayValue.value = findLabelForValue(newValue)
  } else {
    displayValue.value = ''
  }
}, { immediate: true })

const handleInput = () => {
  isValid.value = false
  searchStations()
}

const validateInput = () => {
  if (!displayValue.value) {
    isValid.value = false
    inputValue.value = ''
    return
  }

  const foundStation = stations.value.find(station =>
      station.value.toLowerCase() === displayValue.value.toLowerCase() ||
      station.label.toLowerCase() === displayValue.value.toLowerCase()
  )

  isValid.value = !!foundStation

  if (foundStation) {
    inputValue.value = foundStation.value
    displayValue.value = foundStation.label
  }

  emit('valid-change', isValid.value)
}

const searchStations = () => {
  if (displayValue.value && displayValue.value.length >= 2) {
    const searchTerm = displayValue.value.toLowerCase()
    filteredStations.value = stations.value.filter(station =>
        station.label.toLowerCase().includes(searchTerm) ||
        station.value.toLowerCase().includes(searchTerm)
    )
    showDropdown.value = true
  } else {
    filteredStations.value = []
    showDropdown.value = false
  }
}

const selectStation = (station: Station) => {
  displayValue.value = station.label
  inputValue.value = station.value
  isValid.value = true
  emit('valid-change', true)
  showDropdown.value = false
}

const clearInput = () => {
  displayValue.value = ''
  inputValue.value = ''
  isValid.value = false
  emit('valid-change', false)
  showDropdown.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
    validateInput()
  }, 200)
}

onMounted(async () => {
  await fetchStations()

  if (inputValue.value) {
    displayValue.value = findLabelForValue(inputValue.value)
    validateInput()
  }
})
</script>
