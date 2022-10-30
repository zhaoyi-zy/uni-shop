<template>
	<view>
		<view class="login-container">
			<!-- 提示登录的图标 -->
			<uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
			<!-- 登录按钮 -->
			<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
			<!-- 登录提示 -->
			<view class="tips-text">登录后尽享更多权益</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
	name: 'my-login',
	data() {
		return {};
	},
	computed: {
		...mapState('m_user', ['redirectInfo'])
	},
	methods: {
		...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
		// 用户授权后获取用户基本信息
		// getUserInfo(e) {
		// 	// 判断是否获取用户信息成功
		// 	if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！');
		// 	// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
		// 	// console.log(e.detail.userInfo)

		// 	// 将用户的基本信息存储到 vuex 中
		// 	this.updateUserInfo(e.detail.userInfo);

		// 	// 获取登录成功后的 Token 字符串
		// 	this.getToken(e.detail);
		// },
		async getUserInfo() {
			const [err, res] = await uni
				.getUserProfile({
					desc: '用于会员登录'
				})
				.catch(err => err);
			if (err?.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！');
			this.updateUserInfo(res.userInfo);
			// 获取登录成功后的 Token 字符串
			this.getToken(res);
		},

		// 调用登录接口，换取永久的 token
		async getToken(info) {
			// 调用微信登录接口
			let [err, res] = await uni.login().catch(err => err);

			if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败');

			// 准备参数对象
			const query = {
				code: res.code,
				encryptedData: info.encryptedData,
				iv: info.iv,
				rawData: info.rawData,
				signature: info.signature
			};

			// 获取token
			// let loginResult = await uni.$http.post('/api/public/v1/users/wxlogin', query);
			// if (loginResult.data.meta.status === 200) {
			// uni.$showMsg('登录成功！');

			// 保存 token 到 Vuex 中
			// this.updateToken(loginResult.message.token)
			// 因为后端接口不能用返回code为400，此处token先写死

			this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o');

			// 判断 vuex 中的 redirectInfo 是否为 null
			// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
			this.navigateBack();

			// } else {
			// uni.$showMsg('登录失败！');
			// }
		},
		// 返回登录之前的页面
		navigateBack() {
			// redirectInfo 不为 null，并且导航方式为 switchTab
			if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
				// 调用小程序提供的 uni.switchTab() API 进行页面的导航
				uni.switchTab({
					// 要导航到的页面地址
					url: this.redirectInfo.from,
					// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
					complete: () => {
						this.updateRedirectInfo(null);
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.login-container {
	height: 750rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f8f8f8;
	position: relative;
	overflow: hidden;

	&::after {
		content: ' ';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		border-radius: 100%;
		transform: translateY(50%);
	}

	.btn-login {
		background-color: #c00000;
		border-radius: 100px;
		margin: 15px 0;
		width: 90%;
	}
	.tips-text {
		font-size: 12px;
		color: gray;
	}
}
</style>
