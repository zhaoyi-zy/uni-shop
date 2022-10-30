<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>

		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id 和 goods_state -->
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>

		<!-- 结算组件 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车显示 -->
	<view class="empty-cart" v-else>
		<image src="../../static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也...</text>
	</view>
	
</template>

<script>
// 导入自己封装的 mixin 模块
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState, mapMutations } from 'vuex';

export default {
	// 将 badgeMix 混入到当前的页面中进行使用
	mixins: [badgeMix],
	data() {
		return {
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}
			]
		};
	},
	computed: {
		...mapState('m_cart', ['cart'])
	},
	methods: {
		...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
		// 商品的勾选状态发生了变化
		radioChangeHandler(e) {
			this.updateGoodsState(e); // 输出得到的数据 -> {goods_id: 395, goods_state: false}
		},
		// // 商品的数量发生了变化
		numberChangeHandler(e) {
			this.updateGoodsCount(e);
		},
		// 删除购物车中的商品
		swipeItemClickHandler(goods) {
			this.removeGoodsById(goods.goods_id);
		}
	}
};
</script>

<style lang="scss">
.cart-container {
	padding-bottom: 50px;
	
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
}

// 空白购物车页面
.empty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	
	.empty-img{
		width: 90px;
		height: 90px;
	}
	.tip-text{
		font-size: 12px;
		color: gray;
		margin-top: 15px;
	}
}
</style>
