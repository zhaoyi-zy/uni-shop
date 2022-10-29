<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryObj: {
					// 查询关键词
					query: '',
					// 商品id分类
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条是数据
					pagesize: 10
				},
				// 存储数据
				goodsList: [],
				// 总数据
				total: 0,
				// 节流阀
				isLoding: false
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.query = options.cid || ''

			this.getGoodsLsit()
		},
		methods: {
			async getGoodsLsit(cb) {
				// 打开节流阀
				this.isLoding = true
				// 发请求
				let reuslt = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 关闭节流阀
				this.isLoding = false
				
				// 只要数据请求完毕，就立即执行 cb 回调函数
				cb && cb()
				
				// 判断数据是否请求成功
				if (reuslt.data.meta.status === 200) {

					// 上拉触底加载数据，原有数组和新数组相结合
					this.goodsList = [...this.goodsList, ...reuslt.data.message.goods]
					this.total = reuslt.data.message.total
				} else {
					return uni.$showMsg()
				}
			},
			// 点击商品item项触发事件，跳转商品详情页
			gotoDetail(goods){
				uni.navigateTo({
					url:'/subPackages/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		// 上拉触底加载数据
		onReachBottom() {
			// 判断数据是否记载完毕
			// 公式：当前页码值 * 每页多少条数据 >= 总条数
			// 		pagenum * pagesize >= total
			
			// 判断是否还有下一条数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			
			
			// 判断是否在请求其他数据，如果是则不发起额外请求
			if (this.isLoding) return
			
			// 页码值自增+1
			this.queryObj.pagenum += 1
			// 发送请求 
			this.getGoodsLsit()
		},
		onPullDownRefresh() {
			// 重置数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoding = false
			this.goodsList = []
			
			//重新发请求
			this.getGoodsLsit(()=> uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
