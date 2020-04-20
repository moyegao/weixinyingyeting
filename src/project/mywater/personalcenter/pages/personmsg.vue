<template>
  <div class="person-msg">
      <page-header>
      <header-link :left="true" :edge="true" v-back-link><icon icon="back"></icon>返回</header-link>
      <header-title>个人信息</header-title>
    </page-header>
    <page-content>
     <div class="content-padded">
        <div class="row">
          <div class="col-100">
          	<div class="user-card img_content">
          		<div class="card-content">
          			<div class="left-img">
          					<img :src="rabbit" alt="" />
          			</div>
          			<div class="right-content">
          				<h4>{{user | dealUser}}  
          				<!--<router-link :to="{ path: 'personmsg' }">
          			  	<b>我的个人资料</b>
				       		</router-link>-->
          				</h4>
          				<!-- <p><span>积分：</span>520</p> -->
          			</div>
          		</div>          		
          	</div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-100">
						<form-list>	
							<form-item>
								<div class="item-media">
									<img src="../../../assets/images/form/i-form-name.png" alt="" width="30" />
								</div>
								<div class="item-content">
									<div class="item-title label">姓名</div>
									<div class="item-input">
										<input type="text" placeholder="姓名">
									</div>
								</div>
							</form-item>
								<form-item>
								<div class="item-media">
									<img src="../../../assets/images/form/i-form-name.png" alt="" width="30" />
								</div>
								<div class="item-content">
									<div class="item-title label">手机号</div>
									<div class="item-input">
										<input type="text" placeholder="手机号">
									</div>
								</div>
							</form-item>
								<form-item>
								<div class="item-media">
									<img src="../../../assets/images/form/i-form-name.png" alt="" width="30" />
								</div>
								<div class="item-content">
									<div class="item-title label">身份证号</div>
									<div class="item-input">
										<input type="text" placeholder="身份证号">
									</div>
								</div>
							</form-item>
					
						</form-list>
						<div class="content-block content-padded">
							<div class="row">
								<div class="col-100"><m-button size="large">保存</m-button></div>
							</div>
						</div>
          </div>
        </div>
       </div>
     
    </page-content>
  </div>
</template>

<script>
export default {
	data(){
		return {
		     user:"小胖子",
				// header:require('@/project/assets/img/header.png'),
				// rabbit:require('@/project/assets/img/rabbit.jpg'),
					list:[
				{
					title:'用户编号',
					content:'1001111'
				},
					{
					title:'用户地址',
					content:'步埠路四级39号'
				}	
				],
				buttons:[
				{
							name:'切换用户'
				},
				{
							name:'充值'
				},
				{
							name:'缴费'
				}
				]
		}
	},
  filters: {
    dealUser: function (value) {
      if(value.length>3)
      return value.slice(0,3)+'...'
      else
        return value
    }
  },
	components:{

	},
	methods:{

	}
}
</script>

<style scoped lang="less">
.person-msg{
	
	.col-100{
		.list{
			margin: 0;
			.list-title{
				padding: 0;
			}
		}
		.user-card{
			border-radius: 10px;
			padding: 5px 0 20px 5px;
			/*background: url('../../../project/assets/img/grzx-bg.png') no-repeat;*/
			background-size:100%;
			&:after {
				display: block;
				width: 100%;
				height: 100%;
				content: "";
			}
			.card-header{
				.img{
				float:left
				}
				a{
					float:right;
					/*color: #fff;*/
					b{
						font-size: 16px;
						font-weight: normal;
						text-decoration:underline;
					}
				}
			}
			.card-content{
				/*border-bottom: 1px solid #e7e7e7;*/
				width: 100%;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				padding: 0 0 0 .75rem;
				position: relative;
				.left-img{
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					-webkit-box-pack: center;
					-ms-flex-pack: center;
					justify-content: center;
					padding: .25rem 0;
					width:30%;
					img{
					width: 100%;
						border-radius: 50%;
						overflow: hidden;
						/*width: 50%;*/
						}
					}
					.right-content{
							margin-left: .75rem;
							width: 100%;
							position: relative;
							padding: .4rem .75rem .4rem 0;
							h4,p{
								margin: 10px 0;
								color: #fff;
							}
							h4{
								a{
									color:#3193F6;
									float:right;
									font-size: 15px;
									line-height: 27px;
									font-weight: 500;
									padding-right: 15px;
									background: url('../../../../../static/img/right-arrow.png') no-repeat;
									background-position: right;
									background-size:9px ;
									b{
										text-decoration: underline;
									}
								}
							}
							p{
								font-size: 16px;
								span{
									padding-left: 20px;
									background: url('../../../../../static/img/coin.png') no-repeat;
									background-position: left bottom;
									background-size:14px ;
								}
							}
					}

			}
		}
		.img_content {
			height: 10rem;
			width: 100%;
			background: url('../../../../../static/img/juxing.png') no-repeat;
			background-size: 100% 100%;
		}
		
	}
}
</style>
