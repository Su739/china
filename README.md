<scripy>
  var aTagArr = [].slice.apply(document.getElementsByTagName("a"));
  aTagArr.forEach(function (e, i) {
  e.href.indexOf("_blank") > -1 ? e.target = "_blank" : null;
});
</script>
### 中国常用地址选择

实现了基本功能。

#### 点击下面链接查看效果

[我是链接](https://su739.github.io/china/?_blank)


