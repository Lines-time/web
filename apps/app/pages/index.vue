<template>
    {{ data?.greeting }}
</template>
<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data } = await $trpc.hello.useQuery({ text: "World" });
</script>
