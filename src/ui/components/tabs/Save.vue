<script setup lang="ts">
import { export_file, hardReset, import_file } from '../../../core/save';

function hardResetUI() {
	hardReset();
}
</script>

<template>
	<div class="center">
		<div class="button" @click="hardResetUI">硬重置</div>
		<div class="button" @click="export_file">导出存档</div>
		<div class="button" @click="import_file">导入存档</div>
	</div>
</template>
