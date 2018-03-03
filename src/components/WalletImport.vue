<template>
    <div class="page-group">
        <div class="page" id="page-wallet-import">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('wallet_import.title')}}</h3>
                <router-link :to="$route.query.from||link('/')" replace class="icon icon-left"></router-link>
            </header>
            <div class="content">
                <div class="list-block block-pwd">
                    <ul>
                        <li class="align-top">
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-input item-required">
                                        <span>*</span>
                                        <textarea id="Wallet_keystore" v-model="wifKey"
                                                  :placeholder="$t('wallet_import.placeholder.key')"
                                                  @change="wifKeyTextAreaChange"></textarea>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <!--                    <li>
                                                    <div class="item-content">
                                                        <div class="item-inner">
                                                            <div class="item-title label">{{$t('wallet_import.label.password')}}</div>
                                                            <div class="item-input">
                                                                <input v-model="pwd1" id="Wallet_pwd1" type="password" maxlength="30" :placeholder="$t('wallet_import.placeholder.password')">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="item-content">
                                                        <div class="item-inner">
                                                            <div class="item-title label">{{$t('wallet_import.label.confirm')}}</div>
                                                            <div class="item-input">
                                                                <input v-model="pwd2" id="Wallet_pwd2" type="password" maxlength="30">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>-->
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_import.account')}}</div>
                                    <div class="item-input">
                                        <input id="account_name" v-model="account_name" type="text" maxlength="30"
                                               :placeholder="$t('wallet_import.placeholder.password')">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block block-tip">
                    <div class="tip-error" v-if="error.common">
                        {{error.common}}
                    </div>
                </div>
                <div class="content-block block-button">
                    <p class="content-block">
                        <a @click="onSubmit" href="javascript:;" class="button button-gxb"
                           :class="{disabled:!isCommitEnable}">{{$t('wallet_import.confirm')}}</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                tabIndex: 1,
                submitting: false,
                wifKey: '',
                pwd1: '',
                pwd2: '',
                account: '',
                account_name: '',
                error: {
                    common: ''
                }
            };
        },
        watch: {
            tabIndex () {
                this.error = {
                    common: ''
                };
            },
            pwd1 () {
                this.error = {
                    common: ''
                };
            },
            pwd2 () {
                this.error = {
                    common: ''
                };
            },
            wifKey () {
                this.error.common = '';
            },
            account () {
                this.error = {
                    common: ''
                };
            }
        },
        computed: {
            /*
             isEqual () {
             return this.pwd1 == this.pwd2;
             },
             */
            isCommitEnable () {
                if (this.submitting) {
                    return false;
                }
                return this.wifKey.length > 0 && this.account_name.length > 6;
            }
        },
        mounted () {
            $.init();
            /*
             if (!get_disclaimer_accepted()) {
             let query = {
             from: this.$route.path
             };
             this.$router.push({
             path: this.link('/disclaimer', query)
             });
             }
             */
        },
        methods: {
            isValidWifKey (wifKey) {
                /*
                 let wif_regex = /^5[HJK][1-9A-Za-z]{300}$/;
                 if (wif_regex.test(wifKey)) {
                 return true;
                 } else {
                 return false;
                 }
                 */
                return true;
            },
            isValidAccount (account_name) {
                let v = localStorage.getItem('allwallets');
                let allwallets = null;
                let account_regex = /^[0-9A-Za-z]{6,30}$/;
                if (!account_regex.test(account_name)) {
                    this.error.common = this.$t('wallet_import.error.account');
                    return false;
                }
                if (v != '' && v != null) {
                    allwallets = JSON.parse(v);
                    for (var i = 0; i < allwallets.length; i++) {
                        if (allwallets[i].account == account_name) {
                            if (account_name.length > 2) {
                                this.error.common = this.$t('wallet_import.error.account_already_exist');
                                return false;
                            }
                        }
                    }
                }
                return true;
            },
            validate () {
                if (!this.isValidWifKey(this.wifKey)) {
                    this.error.common = this.$t('wallet_import.error.invalid_key');
                    return false;
                }
                if (!this.isValidAccount(this.account_name)) {
                    return false;
                }
                return true;
            },
            onSubmit () {
                let web3Utils = window.web3Utils;
                if (!this.isCommitEnable) {
                    return;
                }
                if (!this.validate()) {
                    return;
                }
                web3Utils.loadWallet(this.account_name, this.wifKey);
                this.$router.push({path: '/'});
                /*
                 this.wifKey = this.wifKey.trim();

                 if (this.submitting) {
                 return;
                 }
                 this.submitting = true;
                 this.createByWifKey();
                 */
            },
            createByWifKey () {
                $.showPreloader('正在导入中');
                setTimeout(() => {
                    /*
                     import_account(this.wifKey, this.pwd1).then((info) => {
                     this.submitting = false;
                     $.hidePreloader();
                     if (info.imported.length > 0) {
                     this.$router.replace({
                     path: this.link('/wallet-import-success', {
                     account: info.imported[0].account
                     })
                     });
                     } else {
                     if (info.exist.length > 0) {
                     this.error.common = this.$t('wallet_import.error.account_already_exist');
                     } else {
                     this.error.common = this.$t('wallet_import.error.no_reference_account');
                     }
                     }
                     }).catch((ex) => {
                     this.submitting = false;
                     $.hidePreloader();
                     this.error.common = this.$t('wallet_import.error.no_reference_account');
                     });
                     */
                    this.submitting = false;
                    $.hidePreloader();
                }, 500);
            },
            wifKeyTextAreaChange () {
                if (this.wifKey.indexOf('(hide)') > -1) {
                    this.wifKey = this.wifKey.replace('(hide)', '').trim();
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .block-pwd {

    ul:before {
        height: 0;
    }

    }

    .block-tab {
        margin: .2rem 0;

    ul {
        border-left: 0.05rem solid #e7e7e7;
        border-right: 0.05rem solid #e7e7e7;
    }

    }

    .block-button {
        margin-top: .6rem;
    }

    .block-tip {
        margin: .6rem 0 0 0;

    .tip-error {
        text-align: center;
    }

    }

    .item-required span {
        color: red;
        position: absolute;
        top: .5rem;
        font-weight: bold;
    }

    .item-required textarea {
        padding-left: 0.5rem;
    }
</style>
