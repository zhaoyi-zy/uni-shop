<template>
	<view class="goods-item">
		<!-- 左侧图片区域 -->
		<view class="goods-item-lift">
			<!-- checked 动态绑定选中状态 -->
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPicture" class="goods-picture"></image>
		</view>
		<!-- 右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="right-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
				<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum">
				</uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			goods: {
				type: Object,
				default: {}
			},
			showRadio: {
				type: Boolean,
				// 默认情况下，不会展示 radio 组件
				default: false
			},
			showNum: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 默认的图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters: {
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			// radio 组件的点击事件处理函数
			radioClickHandler() {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
				// 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
				this.$emit('radio-change', {
					// 商品的 Id
					goods_id: this.goods.goods_id,
					// 商品最新的勾选状态
					goods_state: !this.goods.goods_state,
				})
			},
			// NumberBox 组件的 change 事件处理函数
			numChangeHandler(val) {
				// 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
				this.$emit('num-change', {
					// 商品的 Id
					goods_id: this.goods.goods_id,
					// 商品的最新数量
					goods_count: +val
				})
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
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-picture {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			// 商品名字端导致盒子撑不开
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.right-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.goods-price {
					color: #C00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
