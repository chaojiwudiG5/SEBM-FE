<!--
 * @Description: 
 * @version: v1.0.0
 * @Author: GaoMingze
 * @Date: 2025-09-22 00:17:17
 * @LastEditors: GaoMingze
 * @LastEditTime: 2025-09-22 01:30:52
-->
<template>
    <div class="home-page">
        <van-swipe :autoplay="3000" lazy-render>
            <van-swipe-item v-for="image in images" :key="image">
                <img :src="image" />
            </van-swipe-item>
        </van-swipe>

        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
        <van-card
            num="2"
            price="2.00"
            desc="描述信息"
            title="商品标题"
            thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        />
    </div>
</template>
<script lang="ts" setup>
const images = [
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
]
</script>
<style scoped>
.home-page img {
    width: 100%; /* 宽度填满父容器 */
    height: auto; /* 保持原始比例 */
    display: block; /* 去掉默认 inline img 的间隙 */
}
</style>
