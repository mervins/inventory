<template>
    <div class="header-popup-con" v-if="isShow">
        <div class="header-popup-bg" @click="hide"></div>
        <div class="header-popup-card" ref="cardRef">
            <div class="header-name-holder">
                <div class="hnh-init-letter">
                    {{ username ? username[0] : "" }}
                    
                </div>
                <div class="hnh-full-name text-center">{{username}}</div>
            </div>
            <div class="hpopup-btns">
                <button @click="onStatus('inventory')">
                    <div class="m-icon"><v-icon class="black--text">mdi-basket</v-icon></div>
                    <div>Inventory</div>
                </button>
                <button @click="onStatus('cashier')">
                    <div class="m-icon"><v-icon class="black--text">mdi-cart</v-icon></div>
                    <div>Cashier</div>
                </button>
                <button>
                    <div class="m-icon"><v-icon class="black--text">mdi-account-settings</v-icon></div>
                    <div>Profile</div>
                </button>
                <button  @click="users" v-if="user.type == 'Administrator'">
                    <div class="m-icon"><v-icon class="black--text">mdi-account-multiple</v-icon></div>
                    <div>Users</div>
                </button>
                <button @click="onLogout">
                    <div class="m-icon"><v-icon  class="black--text">mdi-logout</v-icon></div>
                    <div>Logout</div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { gsap } from 'gsap';
import Helper from "../../views/helper/helper.js";
export default {
    name: 'HeaderAccountPopup',
    mixins:[Helper],
    props: ['username'],
    emits: ['logout', 'statusCode'],
    data(){
        return {
            isShow: false
        };
    },
    methods: {
        show(){
            this.isShow = true;
        },

        hide(){
            gsap.to(
                this.$refs['cardRef'],
                {
                    scale: 0,
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        this.isShow = false;
                    }
                }
            )
        },

        onLogout(){
            this.$emit('logout', {});
            this.hide();
        },

        onStatus(stats){
            this.$emit('statusCode', {stats});
            this.hide();
        },
        users(){ 
                  this.$router.push({
                          name: "User",
                        }).catch(()=>{});
                                  this.hide();
        }
    }
}
</script>

<style>
    .header-popup-con{
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        z-index: 101;
        padding: 16px;
        overflow: auto;
    }

    .header-popup-bg{
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: rgba(0,0,0,0);
       
    }

    .header-popup-card{
        width: 100%;
        /* min-height: 200px; */
        background-color: #FFF;
        margin: auto;
        z-index: 1011;
        max-width: 240px;
        margin-top: 56px;
        margin-right: 0px;
        border-radius: 8px;
        box-shadow: 0px 6px 24px rgba(0,0,0,0.5);
        transform-origin: top right;
        animation: erl-pop-enter 0.2s;
    }

    .hpopup-btns{
        display: flex;
        flex-direction: column;
        padding: 16px;
    }

    .hpopup-btns button{
        display: flex;
        align-items: center;
        flex-direction: row;
        background-color: rgba(0,0,0,0);
        height: 40px;
        border-radius: 8px;
        margin-top: 4px;
        margin-bottom: 4px;
        color: #555;
    }

    .hpopup-btns button:hover{
        background-color: rgba(0,0,0,0.1);
    }

    .hpopup-btns button .m-icon{
        height: 40px;
        width: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header-name-holder{
        padding: 16px;
    }

    .hnh-init-letter{
        height: 72px;
        width: 72px;
        margin: auto;
        background-color: rgb(76, 29, 149);
        color: #FFF;
        font-size: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 600;
    }

    .hnh-full-name{
        margin-top: 16px;
        font-weight: 600;
    }

    @keyframes erl-pop-enter{
        from{
            opacity: 0;
            transform: scale3d(0,0,0);
        }

        to{
            opacity: 1;
            transform: scale3d(1,1,1);
        }
    }
</style>