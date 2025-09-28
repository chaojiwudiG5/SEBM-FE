<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import GlobalMenu from '../components/GlobalMenu.vue'
</script>

<template>
    <div class="basic-layout">
        <GlobalHeader />
        <div class="content">
            <router-view></router-view>
        </div>
        <GlobalMenu />
    </div>
</template>

<style scoped>
.basic-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.content {
    margin-top: 45px;
    margin-bottom: 45px;
    flex: 1;
    overflow: auto;
    min-width: 0;
    background-color: white;
}
</style>
