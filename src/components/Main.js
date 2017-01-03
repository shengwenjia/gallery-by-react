require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关数据
// var imageDatas=require('../data/imageDatas.json');

var imageDatas=[
  {
    "fileName":"1.jpg",
    "title":"heaven of time",
    "desc":"hello word"
  },{
  "fileName":"2.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"3.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"4.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"5.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"6.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"7.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"8.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"9.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"10.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"11.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"12.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"13.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"14.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"15.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  },{
  "fileName":"16.jpg",
  "title":"heaven of time",
  "desc":"hello word"
  }
];





// let yeomanImage = require('../images/yeoman.png');
//将图片名字信息转换成URL信息
function genImageURL(imageDatasArr){

  for(var i=0;i<imageDatasArr.length;i++){
    
    var singleImageData=imageDatasArr[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }

  return imageDatasArr;
}

imageDatas=genImageURL(imageDatas);//可以使用自执行函数




//获取区间内的随机值 
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high-low)+low);
}

// 获取0~30之间的一个任意正负值
function get30DegRandom(){
  return((Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random()*30));

}

// 图片组件
var ImgFigure=React.createClass({


  // imgFigure的点击处理函数
  handleClick:function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
      
    }else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();

    
  },


  render(){
    // styleObj指代样式内容对象，将位置信息、css动画整合在一起，
    var styleObj={};
    // 如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;

    }
    // 如果图片的旋转角度有值并且不为0
    if(this.props.arrange.rotate){
      // 需要兼容所有浏览器的旧版本，所以需在前面加上浏览器前缀
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
         styleObj[value] = 'rotate('+ this.props.arrange.rotate +'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zindex=11;
    }

    // 在js中添加样式ClassName，即再添加一个类,注意' is-inverse'一开始的空格
    var imgFigureClassName='img-figure';
    imgFigureClassName+=this.props.arrange.isInverse ? ' is-inverse':' ';

    // class指定了css动画、样式，style指定了每张图片的位置信息，两者共同决定图片的显示
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>

        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
              <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
});



// 控制组件
var ControllerUnit=React.createClass({
  handleClick:function(e){
    // 如果点击的是当前选择态的图片，则翻转，否则则居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  },

  render:function(){

    var controllerUnitClassName='controller-unit';
    // 如果对应的是居中的图片，显示控制按钮的居中态
    if(this.props.arrange.isCenter){
      controllerUnitClassName+=' is-center';
      // 如果同时对应的是翻转图片，显示控制按钮的翻转态
      if(this.props.arrange.isInverse){
        controllerUnitClassName+=' is-inverse';
      }

    }else{

    }


    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>

    );
  }

});




// 舞台——大管家
// class AppComponent extends React.Component
var AppComponent =React.createClass({
  Constant:{
    centerPos:{
      left:0,
      right:0
    },
    hPosRange:{
      leftSecX:[0,0],
      rightSecX:[0,0],
      y:[0,0]
    },
    vPosRange:{
      x:[0,0],
      topY:[0,0]
    }
  },


  // 翻转图片，
  // @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  // @return{Function} 这个一个闭包函数，其内return一个真正待被执行的函数
  inverse:function(index){
    return function(){
      var imgsArrangeArr=this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
      // 触发视图的重新渲染
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }.bind(this);
  },


  // 重新布局所有图片，
  // centerIndex指定中心图片
  rearrange:function(centerIndex){
      var imgsArrangeArr=this.state.imgsArrangeArr,
          Constant=this.Constant,
          centerPos=Constant.centerPos,
          hPosRange=Constant.hPosRange,
          vPosRange=Constant.vPosRange,
          hPosRangeLeftSecX=hPosRange.leftSecX,
          hPosRangeRightSecX=hPosRange.rightSecX,
          hPosRangeY=hPosRange.y,
          vPosRangeTopY=vPosRange.topY,
          vPosRangeX=vPosRange.x,


          imgsArrangeTopArr=[],
          topImgNum=Math.floor(Math.random()*2),//应该要向下取整
          topImgSpliceIndex=0,
          imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);


          // 首先居中centerIndex的图片
          imgsArrangeCenterArr[0].pos=centerPos;
          // 居中的centerIndex的图片的旋转角度为0
          imgsArrangeCenterArr[0].rotate=0;

          imgsArrangeCenterArr[0].isCenter=true;



          // 取出要布局上侧的图片的状态信息
          topImgSpliceIndex=Math.ceil(Math.random() * (imgsArrangeArr.length-topImgNum));
          imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,1);

          // 对上侧图片进行布局
          imgsArrangeTopArr.forEach(function(value,index){

              imgsArrangeTopArr[index]={

                pos:{
                  top:getRangeRandom(vPosRangeTopY[0] ,vPosRangeTopY[1]),
                  left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
                },
                rotate:get30DegRandom(),
                isCenter:false


              };

                
          });

          // 布局左右两侧的图片
          // imgsArrangeTopArr.forEach(function(value,index){
          //     imgsArrangeArr[index].pos={
          //       top:
          //       left:
          //     }

          // });
          for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
            var hPosRangeLORX=null;
            if(i<k){
              hPosRangeLORX=hPosRangeLeftSecX;
            }else{
              hPosRangeLORX=hPosRangeRightSecX;
            }

            imgsArrangeArr[i]={
              pos:{
                left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
                top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
              },
              rotate:get30DegRandom(),
              isCenter:false
              
            };


          }

          if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
          }

          imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

          this.setState({
            imgsArrangeArr:imgsArrangeArr
          });


  },


  // 利用rearrange函数，居中对应index的图片
  // @param index 需要被居中的图片信息数组的index值
  // @return {Function}
  center:function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
      
  },




  getInitialState:function(){
    return {
      imgsArrangeArr:[
      // {
      //   pos:{
      //     left:'0',
      //     top:'0'
      //   },
            // rotate:0  ,        //图片旋转角度
            // isInverse:false,  //图片正反面
            // isCenter:false     //图片是否居中
      // }
      ]
    };


  },

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount:function(){
      // 首先拿到舞台的大小
     var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
          stageW=stageDOM.scrollWidth,//实际内容的高度，不包含滚动条
          stageH=stageDOM.scrollHeight,
          halfStageW=Math.ceil(stageW/2),
          halfStageH=Math.ceil(stageH/2);


     //拿到一个imgFigure的大小
     var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW=imgFigureDOM.scrollWidth,  
          imgH=imgFigureDOM.scrollHeight,  
          halfImgW=Math.ceil(imgW/2),
          halfImgH=Math.ceil(imgH/2);  




      // 计算中心区域的位置点
       this.Constant.centerPos={
          left:halfStageW-halfImgW,
          top:halfStageH-halfImgH
       };

      // 计算左侧和右侧区域图片排布位置的取值范围
       this.Constant.hPosRange.leftSecX[0]=-halfImgW; 
       this.Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW * 3;

       this.Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
       this.Constant.hPosRange.rightSecX[1]=stageW-halfImgW;

       this.Constant.hPosRange.y[0]=-halfImgH;
       this.Constant.hPosRange.y[1]=stageH-halfImgH;


      // 计算上侧区域图片排布位置的取值范围
       this.Constant.vPosRange.topY[0]=-halfImgH;
       this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;
       this.Constant.vPosRange.x[0]=halfImgW-imgW;
       this.Constant.vPosRange.x[1]=halfImgW;  

       this.rearrange(0);   
  },



  render : function() {
      var controllerUnits=[],
          imgFigures=[];


      // console.log(imageDatas);
      
      imageDatas.forEach(function (value,index){

        if(!this.state.imgsArrangeArr[index]){
          this.state.imgsArrangeArr[index]={
            pos:{
               left:'0',
               top:'0'
            },
            rotate:0,
            isInverse:false,
            isCenter:false
          };
        }

        // 设置图片的props:inverse,其实是一个函数,同数据arrange传输一样,这样图片组件就可以调用大管家舞台封装的函数
        imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
        //data属性是每张图片的url、title、description信息，arrange属性是每张图片的位置、是否居中、是否翻转等信息
        controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);

      }.bind(this));


      return (

       

        <section className="stage" ref="stage">
          <section className="img-sec" >
            {imgFigures}

          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>






      );
    }
});

AppComponent.defaultProps = {
};

export default AppComponent;
