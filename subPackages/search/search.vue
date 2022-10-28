<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<uni-search-bar @input="input" :radius="100" cancelButton="none" :focus="true"></uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDatail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, index) in histories" :key="index" @click="gotoGoodsList(item)">
				</uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器的timerId
				timer: null,
				// 搜素关键词
				kw: '',
				// 搜索结果列表
				searchResults: [],
				// 搜索历史数据
				historyList: []
			};
		},
		// 在onLoad 生命周期函数中，加载本地存储的搜索历史记录
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			// input输入事件(防抖)
			input(e) {
				// 清除对应的延时器
				clearTimeout(this.timer)
				// 重新启动一个延时器，并把timerId赋值给this.timer
				this.timer = setTimeout(() => {
					this.kw = e
					// 获取搜索数据列表的方法
					this.getSearchList()
				}, 500)
			},
			// 发请求获取数据列表的回调
			async getSearchList() {
				// 判断搜索关键词是否为空
				if (this.kw.length === 0) {
					this.searchResults = []
					return
				}
				let result = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (result.data.meta.status === 200) {
					this.searchResults = result.data.message

					// 获取搜索历史的方法
					this.saveSearchHistory()
				} else {
					return uni.showMsg()
				}
				// console.log(result);
			},
			// 点击搜索建议列表item项跳转到详情页面
			gotoDatail(item) {
				// console.log(item.goods_id);
				uni.navigateTo({
					url: '/subPackages/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			// 保存历史记录的回调
			saveSearchHistory() {
				// 把搜索记录放到第一位
				// 使用unshift方法会打乱原有数组不好，
				// this.historyList.unshift(this.kw)

				// 使用set方法去重
				// 1. 将 Array 数组转化为 set 对象
				const set = new Set(this.historyList)
				// 2. 调用 set 对象的 delete 方法，移出对应元素
				set.delete(this.kw)
				// 3. 调用 set 对象的 add 方法，向 set 中添加元素
				set.add(this.kw)
				// 4. 将 set 对象转化为 Array 数组
				this.historyList = Array.from(set)

				// 保存搜索关键字为历史记录
				// 调用 uni.setStorageSync(k, v) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清除历史记录
			clean() {
				// 置空 data 里的历史记录
				this.historyList = []
				// 置空本地存储里的历史记录
				uni.setStorageSync('kw', '[]')
			},
			// 点击搜索历史 item 项跳转到商品列表界面
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subPackages/goods_list/goods_list?query=' + kw
				})
			}
		},
		computed: {
			histories() {
				// 注意：由于数组是引用类型，所以不要基于原数组调用 reverse 方法，以免 修改原数组 中元素的顺序
				// 而是应新建一个内存无关的数组，在进行 reverse 翻转
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
	// 搜索框样式
	.search-box {
		background-color: #C00000;
		position: sticky;
		top: 0;
		z-index: 999;
	}

	// 搜索建议列表样式
	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;

			.goods-name {
				// 文字不允许换行(单行文本)
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出的使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	// 搜索历史样式
	.history-box {
		padding: 0 5px;

		// 标题区
		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		// 列表区
		.history-list {
			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
