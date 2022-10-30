<template>
	<view>
		<!-- 使用默认的搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>

		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :current="true">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<!-- 点击图片跳转详情页 -->
				<navigator class="swiper-item"
					:url="'/subPackages/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层 -->
		<view class="floor-list">
			<!-- 楼层item项 -->
			<view class="floor_item" v-for="(item, index) in floorList" :key="index">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix"
							:style="{width: item.product_list[0].image_width + 'rpx'}"></image>
					</navigator>
					<!-- 右侧图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, index2) in item.product_list" :key="index2"
							v-if="index2 !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入自己封装的 mixin 模块
	import badgeMix from '@/mixins/tabbar-badge.js'

	export default {
		// 将 badgeMix 混入到当前的页面中进行使用
		mixins: [badgeMix],
		data() {
			return {
				// 轮播图数据列表
				swiperList: [],
				// 分类导航数据列表
				navList: [],
				// 楼层的数据
				floorList: []
			};
		},
		onLoad() {
			// 获取轮播图数据
			this.getSwiperList()
			// 获取分类导航数据
			this.getNavList()
			// 获取楼层数据
			this.getFloorList()
		},
		methods: {
			// 获取轮播图的回调
			async getSwiperList() {
				const result = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (result.data.meta.status === 200) {
					this.swiperList = result.data.message
				} else {
					return uni.$showMsg()
				}
			},
			// 获取分类导航的回调
			async getNavList() {
				const result = await uni.$http.get('/api/public/v1/home/catitems')
				if (result.data.meta.status === 200) {
					this.navList = result.data.message
				} else {
					return uni.$showMsg()
				}
			},
			// nav-item被点击时触发的回调
			navHandler(item) {
				// 判断点击的是哪个
				if (item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			// 获取楼层的回调
			async getFloorList() {
				const result = await uni.$http.get('/api/public/v1/home/floordata')
				if (result.data.meta.status === 200) {
					// 对数据进行处理
					result.data.message.forEach(floor => {
						floor.product_list.forEach(prod => {
							prod.url = '/subPackages/goods_list/goods_list?' + prod.navigator_url
								.split('?')[1]
						})
					})

					this.floorList = result.data.message
				} else {
					return uni.$showMsg()
				}
			},
			// 搜索框的点击事件
			gotoSearch() {
				uni.navigateTo({
					url: '/subPackages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	// 轮播图样式
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 分类导航样式
	.nav-list {
		display: flex;
		justify-content: space-between;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 楼层标题
	.floor-title {
		height: 68rpx;
		width: 100%;
		display: flex;
	}

	// 楼层右侧图片
	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	// 搜索框吸顶效果
	.search-box {
		// 设置定位效果为"吸顶"
		position: sticky;
		// 吸顶位置
		top: 0;
		// 提高层级，防止被轮播图覆盖
		z-index: 999;
	}
</style>
