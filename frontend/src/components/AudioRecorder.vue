<!-- src/components/AudioRecorder.vue -->
<template>
    <div class="recorder">
        <vue-audio-recorder :is-active="isRecording" @recording-complete="onRecordingComplete"></vue-audio-recorder>
        <button @click="startRecording">Start Recording</button>
        <button @click="stopRecording">Stop Recording</button>
    </div>
</template>
  
<script>
import VueAudioRecorder from 'vue-audio-recorder';
import axios from 'axios';

export default {
    name: 'AudioRecorder',
    components: {
        VueAudioRecorder,
    },
    data() {
        return {
            isRecording: false,
        };
    },
    methods: {
        startRecording() {
            this.isRecording = true;
        },
        stopRecording() {
            this.isRecording = false;
        },
        onRecordingComplete(blob) {
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('location', JSON.stringify(this.$root.$data.userLocation));

            axios.post('http://localhost:5000/api/audio-notes', formData)
                .then(response => {
                    console.log('Audio successfully uploaded:', response.data);
                    this.$emit('close');
                })
                .catch(error => {
                    console.error('Error uploading audio:', error);
                });
        }
    }
}
</script>
  
<style>
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
  