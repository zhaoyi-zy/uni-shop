<template>
	<!--
		解决商品价格闪烁问题
		原因：
			在商品数据请求回来之前，data 中的 goods_info 的值为 {} ,因此初次渲染会导致，商品价格，商品名称的等闪烁，的问题
		解决：
			判断 goods_info.goods_name 属性的值是否存在，从而使用v-if指令控制页面的显示与隐藏
	 -->
	<view class="goods-detail-container" v-if="goods_info.goods_name">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>

		<!-- 商品信息 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 商品信息主体 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>

		<!-- 商品详情 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>

		<!-- 商品导航组件 -->
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'

	export default {
		computed: {
			...mapState('m_cart', []),
			// 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
			...mapGetters('m_cart', ['total']),
		},
		watch: {
			// 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
			// total(newVal) {
			// 	// 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
			// 	const findResult = this.options.find((x) => x.text === '购物车')

			// 	if (findResult) {
			// 		// 3. 动态为购物车按钮的 info 属性赋值
			// 		findResult.info = newVal
			// 	}
			// },
			
			 // 定义 total 侦听器，指向一个配置对象
			total: {
				// handler 属性用来定义侦听器的 function 处理函数
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				// immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
				immediate: true
			}
		},
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 左侧按钮的配置对象
				options: [{
						icon: 'shop',
						text: '店铺',
						infoBackgroundColor: '#007aff',
						infoColor: "red"
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 0
					}
				],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			};
		},
		onLoad(options) {
			// 获取商品id
			const goods_id = options.goods_id

			// 调用请求商品详情的方法
			this.getGoodsDetail(goods_id)
		},
		methods: {
			...mapMutations('m_cart', ['addToCart']),

			// 发起请求商品详情数据的回调
			async getGoodsDetail(goods_id) {
				let result = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})
				if (result.data.meta.status === 200) {

					// 使用字符串 replace() 方法，为img标签添加行内 style 样式， 从而解决 详情区域图片底部空白间隙的问题
					// 以及IOS设备不能显示 webp 格式图片
					result.data.message.goods_introduce = result.data.message.goods_introduce.replace(/<img /g,
						'<img style="dispaly:block;"').replace(/webp /g, 'jpg')

					this.goods_info = result.data.message
				} else {
					return uni.$showMsg()
				}
			},
			// 轮播图点击预览事件
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时默认显示图片的索引
					current: i,
					// 所有图片 url 地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			// 购物车图标的回调
			onClick(e) {
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			// 右边俩个按钮（加入购物车，立即购买）的回调函数
			buttonClick(e) {
				// 判断是否点击了 加入购物车 按钮
				if (e.content.text === '加入购物车') {
					// 组织一个商品的信息对象
					const goods = {

						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_info.goods_small_logo,
						goods_state: true
					}
					// 通过 this 调用映射过来的 addToCart 方法，把商品对象存储到购物车
					this.addToCart(goods)
				}
			}
		}
	}
</script>

<style lang="scss">
	// 轮播图样式
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 商品信息
	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #C00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				margin-right: 10px;

			}

			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}

		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}

	// 商品导航组件
	.goods-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.goods-detail-container {
		padding-bottom: 50px;
	}
</style>
