<template>
  <div class="footer">
    <div class="links">
<!--      <a target="_blank" :key="index" :href="item.link ? item.link : 'javascript: void(0)'" v-for="(item, index) in linkList">-->
<!--        <a-icon v-if="item.icon" :type="item.icon"/>{{item.name}}-->
<!--      </a>-->
    </div>
    <div class="copyright">
      Copyright<a-icon type="copyright" />copyright
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
  props: ['copyright', 'linkList']
}
</script>

<style lang="less" scoped>
  .footer{
    padding: 48px 16px 24px;
    /*margin: 48px 0 24px;*/
    text-align: center;
    .copyright{
      color: black;
      font-size: 14px;
      i {
          margin: 0 4px;
      }
    }
    .links{
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a{
        color: black;
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
  }
</style>
