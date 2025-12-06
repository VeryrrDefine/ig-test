<script setup lang="ts">
import { hardReset } from '../../../core/save';

function hardResetUI() {
	hardReset();
}
</script>

<template>
	<div class="center">
		<div class="button" @click="hardResetUI">硬重置</div>
	</div>
</template>
