<template>
  <div class="water-analyze">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>用水分析</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">

        <headerThree :message='message'></headerThree>
        <!-- <div class="row">
          <div class="col-100">
            <div class="user-card">
              <div class="card-header">
                <img :src="header" alt="" width="35%" />
              </div>
              <div class="card-content">
                <ul>
                  <li>
                    <span>{{formData.groupArea}}</span>
                  </li>
                  <li>
                    <span>{{formData.userName}}&nbsp;&nbsp;({{formData.userNo}})</span>
                  </li>
                  <li>
                    <span>{{formData.userAddress}}</span>
                  </li>
                </ul>

                <ol>
                  <li class="kr-img">
                    <img src="../../../../../static/img/jingbao.png" alt="">
                  </li>
                  <li>
                    <p style="text-align: center;">疑似漏水!</p>
                    <p style="text-align: center;">{{result}}</p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="kr-tishi">
        <span>最近12个月的用水量和水费</span>
      </div>
      <div id="water-Analyze-echarts"></div>
      <div class="kr-tishi">
        <span style="color:#3193f6;font-size:13px;">点击月份区间，可查看月用水量详情</span>
      </div>
    </page-content>

  </div>
</template> 
 
<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import { Icon, PullRefresh } from 'vant';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      header: require('../../../../../static/img/header1.png'),
      status: 2,//1 有漏水 2 无漏水
      result: "",
      formData: {
        groupArea: "",
        userName: "",
        userNo: "",
        userAddress: "",
      },
      message: {
        title: "",
        span1: "",
        span2: "",
        isShow: '',
      },
      erchartMonth: [],
      erchartValue: [],
      // 水费
      waterPrice: [],
      // 用水量
      waterNum: [],
      // 账期
      waterMonth: [],
      // 是否跳转newData
      newDataShow: true,
    };
  },
  filters: {

  },
  created() {
    this.formData.groupArea = this.$route.query.groupArea;
    this.formData.userName = this.$route.query.userName;
    this.formData.userNo = this.$route.query.userNo;
    this.formData.userAddress = this.$route.query.userAddress;
    this.message = {
      title: "用水分析",
      span1: this.formData.groupArea,
      span2: this.formData.userName + ' (' + this.formData.userNo + ')',
      span3: this.formData.userAddress,
      status: 0,
      warning1: '疑似漏水！',
      warning2: this.result,
    };
    this.initShow()
    // this.getEchartsData()
    this.getNewEcharts()
  },
  mounted() {
    $('#myTitle').html('用水分析')
  },
  methods: {
    // 该方法仅用来判断与允不允许进入newData页面
    goNewData(month, query) {
      var that = this
      let str = '';
      let year = month.slice(0, 4)
      let month1 = month.slice(4)
      str = year.toString() + month1.toString();
      let params = {
        data: {
          userNo: that.formData.userNo,
          groupCode: that.$route.query.groupCode,
          month: str,
        }
      }
      that.$api.fetch({
        params,
        apiUrl: '/myWater/dayFluxQuery.api',
      }).then(res => {
        that.$router.push({ path: '/newData', query })
      }).catch(err => {
      })
    },
    initShow() {
      let that = this;
      let data = {
        userNo: that.$route.query.userNo,
        groupCode: that.$route.query.groupCode,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/waterLoseQuery.api',//接口地址
      }).then(res => {
        console.log(res)
        that.status = res.status;
        that.result = res.result;
        that.message.warning2 = res.result
        that.message.status = res.status
      })
    },
    erchart() {
      let pie = this.$echarts.init(
        document.getElementById("water-Analyze-echarts")
      );
      this.drawPie(pie);
    },
    drawPie(name) {
      let that = this;
      let query = {};
      name.setOption(
        {
          color: ['#c23531', '#2f4554', '#61a0a8'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                // color: '#999'
                color: '#f0f'
              }
            }
          },
          legend: {
            data: ['用水量', '水费']
          },
          xAxis: [
            {
              type: 'category',
              data: that.waterMonth,
              axisPointer: {
                type: 'shadow'
              },
              axisLabel: {
                interval: 0,
                rotate: 40
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '用水量(m³)',
              axisLabel: {
                formatter: '{value}',
                interval: 0,
                rotate: 40
              }
            },
            // {
            //   type: 'value',
            //   name: '水费(元)',
            //   axisLabel: {
            //     formatter: '{value}'
            //   }
            // }
          ],
          series: [
            {
              name: '用水量',
              type: 'bar',
              data: that.waterNum,
              itemStyle: {
                normal: {
                  　　　　　　　　//这里是重点
                  color: function (params) {
                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                    var colorList = ['#adddf6'];
                    return colorList[params.dataIndex]
                  }
                }
              }
            },
            {
              name: '水费',
              type: 'bar',
              data: that.waterPrice,
              itemStyle: {
                normal: {
                  　　　　　　　　//这里是重点
                  color: function (params) {
                    //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                    var colorList = ['#ff7554'];
                    return colorList[params.dataIndex]
                  }
                }
              }
            },
          ],

          // xAxis:{

          // }
        }
      )
      // name.setOption(
      //   {
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'cross',
      //         label: {
      //           backgroundColor: '#6a7985'
      //         }
      //       }
      //     },
      //     grid: {
      //       left: '1%',
      //       right: '12%',
      //       bottom: '3%',
      //       containLabel: true
      //     },
      //     xAxis: [
      //       {
      //         type: 'category',
      //         boundaryGap: false,
      //         data: this.erchartMonth,
      //         name: '账期',
      //       }
      //     ],
      //     yAxis: [
      //       {
      //         type: 'value',
      //         name: '吨',
      //       }
      //     ],
      //     series: [
      //       {
      //         name: '月用水总量',
      //         type: 'line',
      //         stack: '总量',
      //         areaStyle: {
      //           color: '#3193f6',
      //         },
      //         label: {
      //           normal: {
      //             show: true,
      //             position: 'top'
      //           }
      //         },
      //         data: this.erchartValue,
      //       }
      //     ]
      //   }
      // )
      name.getZr().on("click", function (params) {
        var pointInPixel = [params.offsetX, params.offsetY];
        if (name.containPixel("grid", pointInPixel)) {
          /*此处添加具体执行代码*/

          var pointInGrid = name.convertFromPixel(
            { seriesIndex: 0 },
            pointInPixel
          );
          //X轴序号
          var xIndex = pointInGrid[0];

          //获取当前图表的option
          var op = name.getOption();

          //获得图表中我们想要的数据
          var month = op.xAxis[0].data[xIndex].toString();
          var value = op.series[0].data[xIndex];
          query.groupArea = that.formData.groupArea;
          query.userName = that.formData.userName;
          query.userNo = that.formData.userNo;
          query.groupCode = that.$route.query.groupCode;
          query.userAddress = that.$route.query.userAddress;
          query.month = month;
          that.goNewData(month, query)
          console.log(query)
          console.log(op);
          console.log(month + "：" + value);
          console.log(typeof month)
        }
      });
      window.addEventListener('resize', function () {
        name.resize();
      })
      setTimeout(() => {
        name.resize();
      }, 1000);
    },
    getNewEcharts() {
      let that = this;
      let data = {
        billStatus: "1",
        userNo: that.$route.query.userNo,
        area: that.$route.query.groupCode,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/bindUserBill',//接口地址
      }).then(res => {
        let list = res.billList.reverse();
        console.log(list);
        for (let i = 0; i < list.length; i++) {
          that.waterPrice.push(list[i].totalCost)
          that.waterNum.push(list[i].curWaterNum)
          that.waterMonth.push(list[i].billMonth);
        }
        console.log(that.waterPrice, that.waterNum, that.waterMonth);
        setTimeout(() => {
          that.erchart()
        }, 200);
      })
    },
    getEchartsData() {
      let that = this;
      let data = {
        userNo: that.$route.query.userNo,
        groupCode: that.$route.query.groupCode,
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/monthFluxQuery',//接口地址
      }).then(res => {
        that.erchartMonth = res.month;
        for (let i = 0; i < res.value.length; i++) {
          that.erchartValue.push(parseInt(res.value[i]))
        }
        setTimeout(() => {
          that.erchart()
        }, 200);
      })
    },
  }
};
</script>
 
<style lang="less" scoped>
.water-analyze {
  .content-padded {
    margin: 0;
    height: 9rem;
    .row {
      height: 100%;
      .col-100 {
        height: 100%;
        .user-card {
          height: 100%;
        }
      }
    }
  }
  .col-100 {
    background: #fff;
    .user-card {
      // border-radius: 10px;
      padding: 15px;
      background: url("../../../../../static/img/shuidi.png") no-repeat;
      background-size: 100%;
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
      }
      .card-header {
        .img {
          float: left;
        }
        a {
          float: right;
          color: #fff;
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        padding-top: 10px;
        ul {
          width: 60%;

          li {
            color: #fff;
            padding: 7px;
            font-weight: 300;
            b {
              font-weight: 300;
            }
            font-size: 15px;
          }
        }
        ol {
          width: 40%;
          .kr-img {
            text-align: center;
          }
          li {
            // padding: 7px;
            a {
              display: inline-block;
              color: #3193f6;
            }
            p {
              text-align: left;
              color: red;
              font-family: PingFang_Bold;
              font-size: 15px;
            }
          }
        }
      }
    }
    .user-card:after {
      width: 0%;
      height: 0%;
    }
  }
  .kr-tishi {
    // height: 10%;
    text-align: center;
    padding: 1% 0;
    font-size: 0.8rem;
    // 3193f6;
  }
  #water-Analyze-echarts {
    width: 100%;
    // height: 70%;
    height: 55%;
  }
}
</style>