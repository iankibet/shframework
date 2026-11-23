<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import countries from '../../repo/helpers/countries.js';
import ShApis from '../../repo/helpers/ShApis.js'
const props = defineProps({
  modelValue: String,
  country_code: String,
  disabled: Boolean,
  // Where {iso}.svg flag images live. Apps ship them in public/flags/
  // (lowercase ISO codes, e.g. /flags/ke.svg).
  flagBaseUrl: {
    type: String,
    default: '/flags/'
  }
});
const countryCode = ref(props.country_code || 'KE');
const emit = defineEmits(['update:modelValue']);
const input = ref('');
const countriesList = ref(countries);
const selectedCountry = ref(countries.find(c => c.isoCode === 'KE'));
const flagFailed = ref(false);
watch(selectedCountry, () => { flagFailed.value = false; });
const flag = computed(() => {
  if (selectedCountry.value && !flagFailed.value) {
    return props.flagBaseUrl.replace(/\/?$/, '/') + selectedCountry.value.isoCode.toLowerCase() + '.svg';
  }
  return null
})

const updateValue = () => {
  let phone = (input.value || '').replace(/[^\d]/g, '');
  phone = phone.replace(/^0/, '');
  if (selectedCountry.value && phone) {
    phone = selectedCountry.value.dialCode + phone;
  }
  emit('update:modelValue', phone);
};

const sharedCodePrimary = { '+1': 'US', '+7': 'RU', '+44': 'GB', '+47': 'NO', '+61': 'AU', '+262': 'RE', '+590': 'GP', '+599': 'CW' };

// Split a full number ("+254712345678" or "254712345678") into country + local part.
const applyValue = (value) => {
  if (!value) {
    input.value = '';
    return;
  }
  // Only "+..." numbers, or numbers starting with the current country's code
  // without the "+" (e.g. "254712345678"), carry a country. Anything else
  // ("0712345678", "712345678") is a local number for the selected country.
  const currentDigits = selectedCountry.value ? selectedCountry.value.dialCode.slice(1) : null;
  let full = null;
  if (value.startsWith('+')) {
    full = value;
  } else if (currentDigits && value.startsWith(currentDigits) && value.length > currentDigits.length + 6) {
    full = '+' + value;
  }
  // Longest dial code first so "+1284" wins over "+1". Where several
  // countries share a code, keep the selected one, else the main one.
  const rank = c => (c === selectedCountry.value ? 2 : 0) + (sharedCodePrimary[c.dialCode] === c.isoCode ? 1 : 0);
  const country = full && [...countriesList.value]
    .filter(c => full.startsWith(c.dialCode))
    .sort((a, b) => (b.dialCode.length - a.dialCode.length) || (rank(b) - rank(a)))[0];
  if (country) {
    selectedCountry.value = country;
    input.value = full.slice(country.dialCode.length).replace(/:/g, '');
  } else {
    input.value = value.replace(/^0/, '');
  }
};

const setSelectedCountry = () => {
  const country = countriesList.value.find(country => country.isoCode === countryCode.value.toUpperCase());
  if (country) {
    selectedCountry.value = country;
  }
};

watch(() => props.modelValue, (newVal) => {
  // Ignore our own emits so typing isn't reformatted under the cursor.
  if (selectedCountry.value && newVal === selectedCountry.value.dialCode + (input.value || '').replace(/[^\d]/g, '').replace(/^0/, '')) {
    return;
  }
  applyValue(newVal);
});

onMounted(() => {
  if (props.modelValue) {
    applyValue(props.modelValue);
  } else {
    getCountryCodeFromBackend();
  }
});

const getCountryCodeFromBackend = ()=>{
  ShApis.doGet('sh-country-code').then(response=>{
    if(response.data && response.data.countryCode){
      countryCode.value = response.data.countryCode;
    }
  }).catch(()=>{
    // Fall back to the default country.
  }).finally(()=>{
    setSelectedCountry();
  })
}
</script>
<template>
    <div class="sh-phone mb-3 form-control" style="display: flex;">
      <div v-if="selectedCountry" style="display: contents;">
        <img v-if="flag" :src="flag" :alt="selectedCountry.name + ' flag'" @error="flagFailed = true">
        {{ selectedCountry.dialCode }}
      </div>
      <select @change="updateValue" v-model="selectedCountry" class="phone-country" :disabled="disabled" aria-label="Country">
        <option v-for="country in countriesList" :value="country" :key="country.isoCode">{{ country.name + '(' + country.dialCode + ')' }}</option>
      </select>
      <input type="tel" class="phone-number" :disabled="disabled" data-cy="phone_input" @input="updateValue" placeholder="712345678" v-model="input" autocomplete="tel-national">
    </div>
</template>

<style>
.sh-phone{
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 0.25rem;
}
.phone-country{
  width: 2rem;
  border: none;
  align-self: center;
  outline: none !important;
  padding: 0.4rem;
  border-right: 1px solid #0003;
}
.phone-number{
  width: calc(100% - 2.2rem);
  border: none;
  align-self: center;
  outline: none;
  margin-bottom: 0;
  padding: 0.4rem;
}
.sh-phone img{
  padding: 0.125rem;
  width: 1.75rem;
  height: 1.75rem;
  object-fit: contain;
}
.phone-number::placeholder{
  font-weight: 300;
  opacity: 0.5;
}
</style>
