<template>
    <div class="page-group">
        <div class="page" id="page-transfer">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('transfer.title')}}Token</h3>
                <router-link :to="link('/')" replace class="icon icon-left"></router-link>
                <a v-if="isNative" href="javascript:;" class="icon gxicon gxicon-scan pull-right" @click="openQRScaner">
                    <input ref="qrfile" @change="onFileUpload" v-if="!isNative" type="file" class="file-selector"/>
                </a>
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
                                <div class="item-title label">{{$t('transfer.from')}}</div>
                                <div class="item-select">
                                    <input id="from_account" class="input-amount" type="text" maxlength="80"
                                           :placeholder="$t('transfer.from')" v-model="from_account" value="">
                                </div>
                                <div class="item-after">
                                    <account-image :account="from_account" :size='14'></account-image>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('transfer.to')}}</div>
                                <div class="item-input">
                                    <input id="to_account" v-model="to_account" @change="onAccountChange"
                                           class="input-account" type="text"
                                           maxlength="80" :placeholder="$t('transfer.to_placeholder')" value="">
                                </div>
                                <div class="item-after">
                                    <account-image :account="from_account" :size='14'></account-image>
                                </div>
                            </div>
                        </li>
                        <li class="tip-alert" v-if="error.account">
                            <div>{{error.account}}</div>
                        </li>
                        <li class="item-content last">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('transfer.amount')}}</div>
                                <div class="item-input">
                                    <input id="amount" @change="onAmountChange" class="input-amount" v-model="amount"
                                           type="number" maxlength="80" :placeholder="$t('transfer.amount_placeholder')"
                                           value="">
                                </div>
                            </div>
                        </li>
                        <li class="tip-alert" v-if="error.amount">
                            <div>{{error.amount}}</div>
                        </li>
                        <li class="tip-success" v-if="balance!=-1">
                            <div v-html="$t('transfer.available', {amount: formattedBalance})"></div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('transfer.memo')}}</div>
                                <div class="item-input">
                                    <textarea v-model="memo" :placeholder="$t('transfer.memo_placeholder')"></textarea>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <p class="text-center tip-error" v-if="error.other">{{error.other}}</p>
                </div>
                <div class="button-block content-block ">
                    <p>
                        <a @click="onSubmit" href="javascript:;" class="button button-gxb"
                           :class="{disabled:submitEnable}">{{$t('transfer.send')}}</a>
                    </p>
                </div>
            </div>
        </div>
        <!--<password-confirm ref="unlock" @unlocking="unlocking"></password-confirm>
        <transfer-confirm :transaction="transaction" :account="currentWallet.account" :pwd="password" :amount="amount" :to="account"
                          :memo="memo" ref="confirm"></transfer-confirm>-->
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex';
    import util from '@/common/util';
    import AccountImage from './sub/AccountImage.vue';
    // import PasswordConfirm from './PasswordConfirm.vue';
    // import TransferConfirm from './TransferConfirm.vue';
    // this.from_account, this.to_account,this.amount
    export default {
        data () {
            let web3Utils = window.web3Utils;
            return {
                transaction: null,
                amount: '',
                from_account: web3Utils.getCurrentWallet(),
                to_account: '',
                memo: '',
                balance: -1,
                password: '',
                wallets: '',
                currentWallet: web3Utils.getCurrentWallet(),
                currentWalletIndex: web3Utils.getWalletIndex(),
                error: {
                    account: '',
                    amount: '',
                    other: ''
                }
            };
        },
        watch: {
            to_account () {
                this.error.other = '';
                this.to_account = this.to_account.toLowerCase();
            },
            amount () {
                this.error.other = '';
            },
            currentWallet () {
                this.error.other = '';
                this.fetch_balance();
            }
        },
        mounted () {
            $.init();
            $.initPullToRefresh(this.$el);
            /*
             this.account = this.$route.query.to || '';
             this.amount = this.$route.query.amount || '';
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
                if (this.submitEnable) {
                    return;
                }
                let web3Utils = window.web3Utils;
                if (web3Utils.sendToken(this.from_account, this.to_account, this.amount)) {
                    this.$router.push({path: '/'});
                }
            },
            unlocking (pwd) {
                if (!pwd.trim()) {
                    this.error.other = this.$t('unlock.error.invalid_password');
                    this.$refs.unlock.unlocked();
                    return;
                }
            },
            onAmountChange () {
                // this.validateAmount();
            },
            onAccountChange () {
                // this.validateAccount();
            },
            validateAccount () {
                let account_err = this.is_account_name_error();
                if (account_err) {
                    this.error.account = this.$t(`transfer.error.account.${account_err}`);
                    return false;
                }
                if (this.currentWallet.account == this.account) {
                    this.error.account = this.$t('transfer.error.account.cannot_send_to_yourself');
                    return false;
                } else {
                    this.error.account = '';
                }
                return true;
            },
            validateAmount () {
                let amount = Number(this.amount);
                if (isNaN(amount) || amount == 0) {
                    this.error.amount = this.$t('transfer.error.amount.invalid');
                    return false;
                } else if (amount > this.balance) {
                    this.error.amount = this.$t('transfer.error.amount.insufficient_balance');
                    return false;
                }
                this.error.amount = '';
                return true;
            },
            is_account_name_error () {
                let account = this.from_account;
                var i, label, len, length;

                if (!account) {
                    return 'empty_account';
                }
                length = account.length;
                if (length < 3) {
                    return 'account_should_be_longer';
                }
                if (length > 63) {
                    return 'account_should_be_shorter';
                }

                let ref = account.split('.');
                for (i = 0, len = ref.length; i < len; i++) {
                    label = ref[i];
                    if (!/^[~a-z]/.test(label)) {
                        return 'account_should_start_with_a_letter';
                    }
                    if (!/^[~a-z0-9-]*$/.test(label)) {
                        return 'account_format_error';
                    }
                    if (/--/.test(label)) {
                        return 'account_one_dash_error';
                    }
                    if (!/[a-z0-9]$/.test(label)) {
                        return 'account_end_error';
                    }
                    if (!(label.length >= 3)) {
                        return 'account_segment_should_be_longer';
                    }
                }
                return null;
            },

            openQRScaner () {
                let self = this;
                if (this.isNative) {
                    cordova.exec(function (result) {// eslint-disable-line
                        if (result.indexOf('qr://transfer') > -1) {
                            let query = util.query2Obj(result.replace('qr://transfer', ''));
                            self.to_account = query.to || '';
                            self.amount = query.amount || '';
                            self.memo = query.memo || '';
                        } else {
                            self.to_account = result;
                        }
                    }, null, 'QRCode', 'scan', []);
                }
            },
            fetch_balance () {
                /*
                 fetch_account_balance(this.currentWallet.account).then((balance) => {
                 this.balance = balance.amount / 100000;
                 setTimeout(() => {
                 $.pullToRefreshDone($(this.$el).find('.pull-to-refresh-content'));
                 }, 500);
                 }).catch(ex => {
                 console.error(ex);
                 setTimeout(() => {
                 $.pullToRefreshDone($(this.$el).find('.pull-to-refresh-content'));
                 }, 500);
                 });
                 */
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
                return this.web3Utils.validateToken(this.to_account, this.balance);
            },
            submitEnable () {
                return false;
                // this.account && this.amount;
            }
        },
        components: {
            AccountImage
            // PasswordConfirm,
            // TransferConfirm
        }
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
