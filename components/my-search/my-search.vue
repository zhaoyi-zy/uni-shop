<template>
	<view>
		<view class="my-search-container" :style="{ 'background-color' : bgcolor }" @click="searchBoxHandler">
			<!-- 使用 view 组件模拟输入框样式 -->
			<view class="my-search-box" :style="{ 'border-radius' : radius + 'px'}">
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		data() {
			return {

			};
		},
		props: {
			// 背景颜色
			bgcolor: {
				type: String,
				default: '#C00000'
			},
			// 圆角尺寸
			radius: {
				type: Number,
				default: 18 //px
			}
		},
		methods: {
			// 自定义事件，接收父组件定义的事件
			searchBoxHandler() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		// background-color: #C00000;
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;

		.my-search-box {
			width: 100%;
			height: 36px;
			background-color: #fff;
			// border-radius: 15px;
			display: flex;
			justify-content: center;
			align-items: center;

			.placeholder {
				font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>
