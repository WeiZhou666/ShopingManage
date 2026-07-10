<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义侧边栏 -->
      <common-aside />
      <el-container>
        <el-header class="el-header">
          <common-header />
        </el-header>
        <common-tab />
        <el-main class="right-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTab from '@/components/CommonTab.vue'
</script>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100%;
}

.el-header {
  background-color: #333;
  height: 50px;
  padding: 0;
}

.right-main {
  padding: 0;
  background: #f5f7fa;
}
</style>
