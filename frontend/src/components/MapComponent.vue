<!-- src/components/MapComponent.vue -->
<template>
    <div id="map-container">
        <l-map style="height: 100vh; width: 100vw" :zoom="zoom" :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="marker.latLng">
                <l-popup>{{ marker.message }}</l-popup>
            </l-marker>
        </l-map>
        <button class="plus-button" @click="openRecorder">+</button>
        <AudioRecorder v-if="showRecorder" @close="closeRecorder" />
    </div>
</template>
  
<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import AudioRecorder from './AudioRecorder.vue';

export default {
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        AudioRecorder
    },
    data() {
        return {
            zoom: 13,
            center: [51.505, -0.09],
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            markers: [],
            showRecorder: false
        };
    },
    methods: {
        openRecorder() {
            this.showRecorder = true;
        },
        closeRecorder() {
            this.showRecorder = false;
        }
    }
};
</script>
  
<style>
#map-container {
    position: relative;
    height: 100vh;
    width: 100vw;
}

.plus-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.plus-button:hover {
    background-color: #0056b3;
}

.recorder {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
  