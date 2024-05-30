<!-- src/App.vue -->
<template>
  <div id="app">
    <MapComponent />
    <button @click="showRecorder = true" class="plus-button">+</button>
    <AudioRecorder v-if="showRecorder" @close="showRecorder = false" />
  </div>
</template>

<script>
import MapComponent from './components/MapComponent.vue'
import AudioRecorder from './components/AudioRecorder.vue'

export default {
  name: 'App',
  components: {
    MapComponent,
    AudioRecorder
  },
  data() {
    return {
      showRecorder: false
    }
  }
}
</script>

<style>
.plus-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
}
</style>
