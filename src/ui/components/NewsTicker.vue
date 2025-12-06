<script setup lang="ts">
const news = [
	{
		text: 'eeeee',
	},
];
// import { news } from '@/features/news/news-data'
import { computed, onMounted, onUnmounted, ref } from 'vue';
const text = ref<HTMLDivElement | null>(null);
const textvalue = ref<string>('');
let position = document.body.clientWidth;
let textwidth = ref(0);
const prefix = computed(() => {
	if (text.value) {
		return textwidth.value + 'px';
	}
});
let interval: number;
onMounted(() => {
	refreshNews();
	interval = setInterval(function () {
		if (text.value) {
			textwidth.value = position;
			position = position - 1;
			if (position < -text.value.clientWidth) {
				position = document.body.clientWidth;
				refreshNews();
			}
		}
	}, 10);
});
onUnmounted(() => {
	clearInterval(interval);
});
function refreshNews() {
	let i = Math.floor(Math.random() * news.length);
	textvalue.value = news[i]?.text ?? 'No Avaliable News';
}
</script>
<template>
	<div class="news-parent">
		<div class="news">
			<div class="newsText" ref="text">{{ textvalue }}</div>
		</div>
	</div>
</template>

<style lang="css" scoped>
.news-parent {
	display: flex;
	width: 100%;
}
.news {
	white-space: nowrap;
	transform: translateX(v-bind(prefix));
	flex-grow: 0;
	display: flex;
}
.newsText {
	display: inline-block;
	white-space: nowrap;
}
</style>
