export default {
	// 开启命名空间
	namespaced: true,

	state: () => ({
		// 读取本地的收货地址数据，初始化 address 对象
		address: JSON.parse(uni.getStorageSync('address') || '{}')
	}),

	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address

			// 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			this.commit('m_user/saveAddressToStorage')
		},
		// 持久化存储 address
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},

	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if (state.address.provinceName !== '') {
				// 拼接 省，市，区，详细地址 的字符串并返回给用户
				return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
					.detailInfo;
			} else {
				return '';
			}
		}
	}
}
