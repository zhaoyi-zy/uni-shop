<template>
	<view class="my-container">
		<!-- 用户登录组件 -->
		<!-- 判断是否有token，没有就在登录页面，有则跳转用户信息页面 -->
		<my-login v-if="!token"></my-login>

		<!-- 用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
import badgeMin from '@/mixins/tabbar-badge.js';

import { mapState } from 'vuex';

export default {
	mixins: ['badgeMin'],

	data() {
		return {};
	},
	computed: {
		...mapState('m_user', ['token'])
	}
};
</script>

<style lang="scss">
page,
.my-container {
	height: 100%;
}
</style>
