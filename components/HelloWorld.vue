<script setup lang="ts">
const { myLayer } = useAppConfig();
</script>

<template>
    <div>
        <h1 class="some-utils">
            Hello World!
        </h1>
        <pre>{{ myLayer }}</pre>
    </div>
</template>
