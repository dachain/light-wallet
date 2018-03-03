// 登录
<template>
    <div class="page-group">
        <div class="page" id="page-wallet-import">
            <div class="content">
                <div class="list-block block-pwd">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">{{$t('wallet_import.label.password')}}</div>
                                    <div class="item-input">
                                        <input v-model="pwd1" id="Wallet_pwd1" type="password" maxlength="30"
                                               :placeholder="$t('wallet_import.placeholder.password')">
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
            }
        },
        computed: {
            isEqual () {
                return this.pwd1 == this.pwd2;
            },
            isCommitEnable () {
                if (this.submitting) {
                    return false;
                }
                return this.wifKey.length > 0 && this.pwd1.length >= 6 && this.pwd2.length >= 6;
            }
        },
        mounted () {
            $.init();
        },
        methods: {
            isValidWifKey (wifKey) {
                let wif_regex = /^5[HJK][1-9A-Za-z]{49}$/;
                if (wif_regex.test(wifKey)) {
                    return true;
                    // oxx
                } else {
                    return true;
                }
            },
            validate () {
                if (!this.isEqual) {
                    this.error.common = this.$t('wallet_import.error.password_not_equal');
                    return false;
                }
                if (!this.isValidWifKey(this.wifKey)) {
                    this.error.common = this.$t('wallet_import.error.invalid_key');
                    return false;
                }
                return true;
            },
            onSubmit () {
                let web3Utils = window.web3Utils;
                web3Utils.loadWallet('', '');
                this.$router.push({path: '/'});
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

</style>
