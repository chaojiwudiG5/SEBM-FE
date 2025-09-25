<template>
    <div class="tasks-page">
        <van-list>
            <van-cell
                v-for="task in tasks"
                :key="task.id"
                :title="task.title"
                :label="task.description"
                :value="task.status"
            />
        </van-list>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Task {
    id: number
    title: string
    description: string
    status: string
}

const tasks = ref<Task[]>([
    {
        id: 1,
        title: 'Repair device A',
        description: 'Fix the broken screen',
        status: 'Pending'
    },
    {
        id: 2,
        title: 'Install software B',
        description: 'Install latest version',
        status: 'In Progress'
    },
    {
        id: 3,
        title: 'Check network',
        description: 'Diagnose connection issues',
        status: 'Completed'
    }
])
</script>

<style scoped>
.tasks-page {
    padding-top: 10px;
    padding-bottom: 50px;
}
</style>
