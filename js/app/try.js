define(function(require){
  var area = require('area');

  var areaJSON = JSON.parse(JSON.stringify(area));
  Object.freeze(areaJSON);
  var address1 = [{value:"天津", index:1}, {value:"北辰区", index:9}];
  var address2 = [{value:"天津", index:1}];

  function search(area, address, index){
    if(address && address.length>0){
      index++;
      if(index < address.length){
        if(area[address[index].index].hasOwnProperty("children")){
          area = area[address[index].index].children;
          search(area, address, index);
        }
        else{
          show(area[address[index].index]);
        }
      }
      else{
        show(area);
      }
    }
    else{
      show(area);
    }
  }
  function show(args){
    if(isArray(args)){
      args.forEach(function(item){
        console.log(item);
      });
    }
    else{
      console.log(args.value);
    }
  }
  function showParent(arg){
    alert(arg);
  }
  function isArray(arg){
    return Object.prototype.toString.call(arg) == "[object Array]";
  }
  search(areaJSON, address2, -1);
  search(areaJSON, address1, -1);
});