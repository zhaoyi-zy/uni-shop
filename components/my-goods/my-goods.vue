<template>
	<view class="goods-item">
		<!-- 左侧图片区域 -->
		<view class="goods-item-lift">
			<image :src="goods.goods_small_logo || defaultPicture " class="goods-picture"></image>
		</view>
		<!-- 右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="right-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		data() {
			return {
				// 默认图片
				defaultPicture: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		// 过滤器处理商品价格
		filters:{
			tofixed(num){
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #efefef;

		.goods-item-lift {
			margin-right: 5px;

			.goods-picture {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.right-info-box {
				.goods-price {
					color: #C00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
