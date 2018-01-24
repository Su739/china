define(function(require){
  var area = require('area');

  var areaJSON = JSON.parse(JSON.stringify(area));
  var areaBoard = document.getElementById("area-items");

  //表示某一级地址，其中：
  //value是地址名
  //index是在父一级的数组的索引
  function Address(value, index){
    this.value = value;
    this.index = index;
  }

  var addrTemp = [];//存储各级地址组合
    
  //从《JavaScript高级程序设计》上抄的
  var EventUtil = {
    addHandler: function(element, type, handler){
      if(element.addEventListener){
        element.addEventListener(type, handler, false);
      }
      else if(element.attachEvent){
        element.attachEvent("on"+type,handler);
      }
      else{
        element["on" + type] = handler;
      }
    },

    removeHandler:function(element, type, handler){
      if(element.removeEventListener){
        element.removeEventListener(type, handler, false);
      }
      else if(element.detachEvent){
        element.detachEvent("on"+type,handler);
      }
      else{
        element["on" + type] = null;
      }
    },

    getEvent:function(event){
      return event ? event:window.event;
    },

    getTarget:function(event){
      return event.target || event.srcElement;
    },

    prenentDefault:function(event){
      if(event.prenentDefault){
        event.prenentDefault();
      }
      else{
        event.returnValue = false;
      }
    }
  };

  //点击地址牌以外任意位置，关闭地址牌
  EventUtil.addHandler(document, "click", function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    if(target.tagName === "INPUT"){//点击input，返显地址牌儿 
      if(areaBoard.hidden === true){
        areaBoard.hidden = false;
      }
      else{
        areaBoard.hidden = true;
      }
    }
    else{
      areaBoard.hidden = true;
    }
  });

  //点击(选择)某个地址
  EventUtil.addHandler(areaBoard, "click", function(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event),
        i;

    event.stopPropagation();
    if(target.parentNode.id === "u1"){
      //todo,加上active类
      //
      if(target.title === "省/直辖市" || target.title === "常用城市"){
        addrTemp.splice(0,addrTemp.length);
        search(areaJSON, addrTemp, -1);
      }
      else{
        for(i=0; i<addrTemp.length;i++){
          //判断点击的地址等级是哪个（省市县）
          if(addrTemp[i].value === target.title){
            addrTemp.splice(i+1,addrTemp.length);
            //更新数据
            search(areaJSON, addrTemp, -1);
            break;
          }
        }
      }
      refreshU1(addrTemp);
    }
    else if(target.parentNode.id === "u2"){
      var addr = new Address(target.title, target.dataset.index);
      addrTemp.push(addr);
      search(areaJSON, addrTemp, -1, addr);
      refreshU1(addrTemp);
    }
  });

  //初始地址牌内容
  initAreaBoard();

  function initU1(){
    var ul1 = document.getElementById("u1"),
        li1 = null;
        li2 = null;

    //清除所有子节点
    while(ul1.hasChildNodes()){
      ul1.removeChild(ul1.lastChild);
    }
    li1 = document.createElement("li");
    li1.appendChild(document.createTextNode("常用城市"));
    li1.setAttribute("title", "常用城市");
    ul1.appendChild(li1);
    li2 = document.createElement("li");
    li2.appendChild(document.createTextNode("省/直辖市"));
    li2.setAttribute("title", "省/直辖市");
    //li2.setAttribute("class", "active");
    ul1.appendChild(li2);
  }

  function initAreaBoard(){
      initU1();
      show(areaJSON);
  }

  //显示选项
  //参数只能输入所有地址，当前地址组合，-1，当前选择的(某一级)地址
  //如果地址addrTemp是空，代表最顶级，显示省/直辖市
  //如果不是最具体(低级)的组合地址，递归遍历每一项，直到最具体地址，这时候注意：
  //要判断当前组合地址是否已满足具体地址，如果满足要更新最具体(最低级)地址
  function search(area, addrTemp, index, curAddr){
    if(addrTemp && addrTemp.length>0){
      index++;
      if(index < addrTemp.length){
        if(area[addrTemp[index].index].hasOwnProperty("children")){
          area = area[addrTemp[index].index].children;
          search(area, addrTemp, index, curAddr);
        }
        else{
          //生成最终地址
          if(index < addrTemp.length - 1){
            addrTemp.pop();
            addrTemp[addrTemp.length-1] = curAddr;
          }
          //收起地址牌
          areaBoard.hidden = true;
          createaddrTemp(addrTemp);
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

  //只要点U1就重新生成U1的内容
  function refreshU1(addr){
    var fragment = document.createDocumentFragment(),
        ul1 = document.getElementById("u1"), 
        li1 = null;

    initU1();
    if(addr.length>0){
      addr.forEach(function(item, index){
        li1 = document.createElement("li");
        li1.appendChild(document.createTextNode(item.value));
        li1.setAttribute("title", item.value);
        li1.setAttribute("data-index", item.index);
        fragment.appendChild(li1);
      });
      ul1.appendChild(fragment);
    }
    ul1.lastChild.setAttribute("class", "active");
  }

  //显示选项
  function show(args){
    var fragment = document.createDocumentFragment();
    var ul1 = document.getElementById("u1"); 
    var ul2 = document.getElementById("u2"); 
    var li2 = null;

    //清理
    while(ul2.hasChildNodes()){
      ul2.removeChild(ul2.lastChild);
    }
    if(isArray(args)){
      args.forEach(function(item, index){
        li2 = document.createElement("li");
        li2.appendChild(document.createTextNode(item.value));
        li2.setAttribute("title", item.value);
        li2.setAttribute("data-index", index);
        fragment.appendChild(li2);
      });
      ul2.appendChild(fragment);
    }
    fragment = null;
  }

  function createaddrTemp(addr){
    var input = document.getElementsByTagName("input"),
        str = "";
    addr.forEach(function(item){
      str += item.value;
    });
    input[0].value = str;
    input = null;
  }

  function isArray(arg){
    return Object.prototype.toString.call(arg) == "[object Array]";
  }
 
});