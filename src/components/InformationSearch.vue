<template>
    <div class="page-group">
        <div class="page" id="page-transfer">
            <header class="bar bar-nav">
                <h3 class="title">{{$t('Information_search.title')}}</h3>
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
                        <!--<li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_search.name')}}</div>
                                <div class="item-input">
                                    <input id="from_Account" @change="onAccountChange" class="input-amount" type="text" maxlength="80" :placeholder="$t('Information_search.to_name')" value="">
                                </div>
                                <div class="item-after">
                                    <account-image :account="currentWallet.account" :size='14'></account-image>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_search.cell_phone_number')}}</div>
                                <div class="item-input">
                                    <input  class="input-amount" type="text" maxlength="11" :placeholder="$t('Information_search.to_cell_phone_number')" value="">
                                </div>
                                <div class="item-after">
                                    <account-image :account="currentWallet.account" :size='14'></account-image>
                                </div>
                            </div>
                        </li>-->
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.card_num')}}</div>
                                <div class="item-input">
                                    <input id="card_num" class="input-amount" type="text" maxlength="18" v-model="card_num"
                                           :placeholder="$t('Information_search.to_card_id')" value="">
                                </div>
                                <div class="item-after">
                                    <account-image :account="currentWallet.account" :size='14'></account-image>
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
                           :class="{disabled:submitEnable}">{{$t('Information_search.search_info')}}</a>
                    </p>
                </div>
                <div class="search-result" v-show="resultshow">
                    <ul>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.name')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.cell_phone_number')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.card_id')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.bank_card')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.plate_number')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item-content align-top">
                            <div class="item-inner">
                                <div class="item-title label">{{$t('Information_sub.memo')}}</div>
                                <div class="item-span">
                                    <span></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex';
    import util from '@/common/util';
    import filters from '@/filters';
    export default {
        filters,
        data () {
            let web3Utils = window.web3Utils;
            let wallet_index = web3Utils.getWalletIndex();
            let wallets = web3Utils.getAllWallets();
            return {
                transaction: null,
                amount: '',
                account: '',
                memo: '',
                card_num: '',
                balance: -1,
                password: '',
                wallets: wallets,
                resultshow: false,
                currentWallet: web3Utils.getCurrentWallet(),
                currentWalletIndex: wallet_index,
                error: {
                    account: '',
                    amount: '',
                    other: ''
                }
            };
        },
        watch: {
            account () {
                this.error.other = '';
                this.account = this.account.toLowerCase();
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
            this.account = this.$route.query.to || '';
            this.amount = this.$route.query.amount || '';
            this.memo = this.$route.query.memo || '';
            this.fetch_balance();
            $(this.$el).on('refresh', '.pull-to-refresh-content', (e) => {
                this.fetch_balance();
            });
        },
        methods: {
            show () {
                $.popup(this.$el);
            },
            onSubmit () {
                this.submitEnable = true;
                this.web3Utils.queryInfo();
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
                let account = this.account;
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
                            self.account = query.to || '';
                            self.amount = query.amount || '';
                            self.memo = query.memo || '';
                        } else {
                            self.account = result;
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
                this.currentWallet = this.wallets[index];
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
                return filters.asset(this.balance);
            },
            submitEnable () {
                return false;
                // this.account && this.amount;
            }
        },
        components: {
            // AccountImage
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
        color: lighten(#3d3d3b, 20%);
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

    .search-result {

    ul li {
        list-style: none;
        line-height: 2rem;
    }

    }
</style>
