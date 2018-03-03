<template>
    <div class="page-group">
        <div class="page" id="page-transfer">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('Information_sub.title')}}</h3>
                <router-link :to="link('/')" replace class="icon icon-left"></router-link>
            </header>
            <div class="content pull-to-refresh-content">
                <div class="pull-to-refresh-layer">
                    <div class="preloader">
                        <div class="line-scale">
                            <div></div>
                            <div></div>

                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div class="list-block">
                    <ul>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.name')}}</div>
                                <div class="item-input">
                                    <input id="user_name" v-model="user_name" class="input-amount" type="text"
                                           maxlength="80"
                                           :placeholder="$t('Information_sub.to_name')" value="">
                                </div>
                                <div class="item-after">
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.to_mobile')}}</div>
                                <div class="item-input">
                                    <input id="user_mobile" v-model="user_mobile" class="input-amount" type="text"
                                           maxlength="11"
                                           :placeholder="$t('Information_sub.to_mobile')" value="">
                                </div>
                                <div class="item-after">
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.card_id')}}</div>
                                <div class="item-input">
                                    <input id="card_num" v-model="card_num" class="input-amount" type="text"
                                           maxlength="18"
                                           :placeholder="$t('Information_sub.to_card_id')" value="">
                                </div>
                                <div class="item-after">
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.bank_card')}}</div>
                                <div class="item-input">
                                    <input id="card_num" v-model="card_num" type="number" class="input-amount"
                                           maxlength="19"
                                           :placeholder="$t('Information_sub.to_bank_card')" value="">
                                </div>
                                2222
                                <div class="item-after">
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.plate_number')}}</div>
                                <div class="item-input">
                                    <input v-model="plate_number" class="input-amount" type="text" maxlength="20"
                                           :placeholder="$t('Information_sub.to_plate_number')" value="">
                                </div>
                                <div class="item-after">
                                </div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.memo')}}</div>
                                <div class="item-input">
                                    <textarea v-model="memo"
                                              :placeholder="$t('Information_sub.memo_placeholder')"></textarea>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <p class="text-center tip-error" v-if="error.other">{{error.other}}</p>
                </div>
                <div class="content-block" id="result" v-html="html_result">

                </div>
                <div class="button-block content-block ">
                    <p>
                        <a @click="onSubmit" href="javascript:;" class="button button-gxb"
                           :class="{disabled:submitEnable}">{{$t('Information_sub.submit_info')}}</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex';

    export default {
        data () {
            let web3Utils = window.web3Utils;
            return {
                transaction: null,
                user_name: '',
                mobile: '',
                submitEnable: false,
                card_num: '',
                bank_card: '',
                plate_number: '',
                html_result: '',
                account: '',
                memo: '',
                balance: -1,
                wallets: '',
                currentWallet: web3Utils.getCurrentWallet(),
                currentWalletIndex: web3Utils.getWalletIndex(),
                error: {
                    account: '',
                    other: ''
                }
            };
        },
        watch: {
            user_mobile () {
                this.error.other = '';
                this.user_mobile = this.user_mobile.toLowerCase();
            },
            user_card () {
                this.error.other = '';
            }
        },
        mounted () {
            $.init();
            $.initPullToRefresh(this.$el);
            // this.account = this.$route.query.to || '';
            // this.amount = this.$route.query.amount || '';
            /*
             this.memo = this.$route.query.memo || '';
            this.fetch_balance();
             $(this.$el).on('refresh', '.pull-to-refresh-content', (e) => {
                 this.fetch_balance();
             });
             */
        },
        methods: {
            show () {
                $.popup(this.$el);
            },
            onSubmit () {
                this.submitEnable = true;
                this.web3Utils.putInfo();
            },
            validateAccount () {
                return true;
            },

            is_account_name_error () {
                let user_name = this.user_name;
                var length;
                if (!user_name) {
                    return 'empty_account';
                }
                length = this.user_mobile.length;
                if (length < 11) {
                    return 'account_should_be_longer';
                }
                if (length > 63) {
                    return 'account_should_be_shorter';
                }
                return null;
            },
            fetch_balance () {
                // 提交数据到服务器
            },
            switchAccount (e) {
                let index = e.target.value;
                this.currentWalletIndex = index;
                this.currentWallet = this.web3Utils.getAllWallet(index);
            }
        },
        computed: {
            ...mapGetters({
                isNative: 'isNative'
            }),
            formattedBalance () {
                if (!this.balance) {
                    return '0';
                }
                return this.web3Utils.getBalanceByUnit('', this.balance);
            }
        },
        components: {}
    };
</script>
<style scoped lang="scss">
    .tip-error,
    .tip-alert {
        word-break: break-word;
    }

    .tip-alert,
    .tip-success {
        padding-left: .75rem;
    }

    .color-gray {
        color: lighten(#3d3d3b, 20%)
    }

    .list-block .item-title.label {
        width: 4.5rem;
    }

    .list-block .input-account {
        text-transform: lowercase;
    }

    .list-block textarea {
        margin-top: .2rem;
    }

    .list-block .last .item-inner:after {
        height: 0;
    }

    .list-block .item-select {
        width: 100%;
    }
</style>
