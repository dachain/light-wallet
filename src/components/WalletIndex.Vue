<template>
    <div class="page-group">
        <div class="page" id="page-wallet-index">
            <div ref="bar" class="bar bar-nav buttons-fixed" style="background: rgba(37, 40, 113, 0)">
                <a href="javascript:;" class="icon gxicon gxicon-user pull-left" @click="openPanel"></a>
                <a v-if="isNative" href="javascript:;" class="icon gxicon gxicon-scan pull-right" @click="openQRScaner">
                    <input ref="qrfile" @change="onFileUpload" v-if="!isNative" type="file" class="file-selector"/>
                </a>
            </div>
            <div ref="bg" id="bg"></div>
            <div class="content pull-to-refresh-content" ref="content">
                <div class="row-top" ref="top" :class="{ios:$route.query.platform=='ios'}">
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
                    <div class="loading" v-if="loadflag">
                        <div class="line-scale">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <!--wallets-->
                    <swiper :options="swiperOption" :not-next-tick="true" ref="mySwiper"
                            v-show="current_account.length>0">
                        <swiper-slide v-for="wallet in wallets" :key="wallet.name">
                            <div class="wallet-info">
                                <div class="text-center">
                                    <account-image :account="current_account" :size="30" v-show="false"></account-image>
                                    <img :src="imgUrl" :size="30">
                                    <div>
                                        <a @click="openQRCodeModal" href="javascript:;" class="link-qrcode">{{wallet.name}}&nbsp;
                                            <small class="icon icon-code"></small>
                                        </a>
                                    </div>
                                    <p class="bak-tip">
                                        <router-link :to="linkBackup(current_account)" class="btn-backup"
                                                     :class="{visible:!wallet.backup_date}" href="javascript:;">
                                            <small>{{$t('index.backup_wallet')}}&nbsp;
                                                <span class="red-dot"></span>
                                                <span class="icon icon-right"></span>
                                            </small>
                                        </router-link>
                                    </p>
                                </div>
                                <div class="row-balance">
                                    <!--<div class="item">
                                        <small>
                                            {{$t('index.asset_name')}}
                                            <span v-if="wallet.isAssetHidden" class="gxicon gxicon-eye-off"
                                                  @click="assetHideClick"></span>
                                            <span v-else class="gxicon gxicon-eye" @click="assetHideClick"></span>
                                        </small>
                                        <div v-if="wallet.isAssetHidden" class="digit balance">****</div>
                                        <div v-else class="digit balance">{{wallet.balance | asset(2)}}</div>
                                    </div>
                                    <div class="item item-middle">
                                        <div>≈</div>
                                    </div>
                                    <div class="item value">
                                        <small>{{$t('index.value')}}</small>
                                        <div v-if="wallet.isAssetHidden" class="digit balance">****</div>
                                        <div v-else class="digit balance">{{getMarketCap(wallet) | number(2)}}</div>
                                    </div>-->
                                </div>
                            </div>
                        </swiper-slide>
                        <div class="swiper-pagination" slot="pagination" v-show="current_account.length>1"></div>
                    </swiper>

                </div>
                <!--function entries-->
                <div class="row-operation">
                    <div class="row-button">
                        <a @click="goSendEth" class="item">
                            <span class="item-text">{{$t('index.transfer')}}eth</span>
                        </a>
                        <a @click="openQRCodeModal" class="item" href="javascript:;">
                            <span class="item-text">{{$t('index.receive')}}</span>
                        </a>

                    </div>
                    <div class="sep"></div>
                    <div class="row-button">
                        <a @click="goSendToken" class="item">
                            <span class="item-text">{{$t('index.transfer')}}Token</span>
                        </a>
                        <a @click="RefreshList(index)" class="item" href="javascript:;">
                            <span class="item-text">{{$t('index.refresh')}}</span>
                        </a>
                    </div>
                </div>
                <!--exchange list-->
                <div class="table-exchanges">
                    <div class="list-block media-list">
                        <!--<router-link :to="link('/login')" class="item" href="javascript:;">
                            <span class="gxicon x2 gxicon-transfer"></span>
                            <span class="item-text">{{$t('index.transfer')}}</span>
                        </router-link>-->
                        <ul>
                            <li v-if="ethlist!=''">
                                <div class="item-content item-exchange">
                                    <div class="item-inner">
                                        <div class="title-ex-name">
                                            <div class="asset-name">{{current_account}}</div>
                                        </div>
                                        <div class="price">
                                            <div class="price_primary">
                                                {{ethlist}}(eth)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li v-if="ethlist!=''">
                                <div class="item-content item-exchange">
                                    <div class="item-inner">
                                        <div class="title-ex-name">
                                            <div class="asset-name">{{current_account}}</div>
                                        </div>
                                        <div class="price">
                                            <div class="price_primary">
                                                {{tokenlist}}(token)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <left-panel ref="panel" v-show="transferidShow==false?true:false" id="left_panel_id"></left-panel>
        <account-q-r-code ref="qrcode" :account="this.currentWallet"></account-q-r-code>
    </div>
</template>
<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import AccountImage from './sub/AccountImage.vue';
    import LeftPanel from './sub/LeftPanel.vue';
    import AccountQRCode from './sub/AccountQRCode.vue';
    import util from '@/common/util';
    export default {
        data () {
            let web3Utils = window.web3Utils;
            let self = this;
            let wallets = web3Utils.getAllWallets();
            wallets = wallets.map((w) => {
                w.balance = this.$t('index.balance_loading');
                return w;
            });
            let wallet_index = web3Utils.getWalletIndex();
            return {
                flag: false,
                ethlist: '',
                index: 0,
                tokenlist: '',
                imgUrl: '../static/img/logo.png',
                loadflag: true,
                transferidShow: false,
                walletimportidShow: false,
                walletcreatestep1Show: false,
                walletcreatestep2Show: false,
                accountCopied: false,
                stopFetchingMarket: false,
                wallets: wallets,
                current_account: web3Utils.getCurrentWallet(),
                currentWalletIndex: wallet_index,
                exchanges: [],
                swiperOption: {
                    pagination: '.swiper-pagination',
                    autoplay: false,
                    keyboardControl: true,
                    paginationClickable: true,
                    initialSlide: wallet_index,
                    onSlideChangeEnd: function (s) {
                        let wallet = web3Utils.getAllWallets(s.activeIndex);
                        self.currentWalletIndex = s.activeIndex;
                        self.isAssetHidden = wallet.isAssetHidden;
                        this.index = s.activeIndex;
                    }
                },
                isAssetHidden: ''
            };
        },
        watch: {
            currentWalletIndex () {
                this.loadBalance(this.currentWallet);
            }
        },
        beforeUpdate () {
            this.walletimportidShow = this.$store.state.isState;
        },
        methods: {
            change () {
                console.log(this.$store.state.isState);
            },
            RefreshList (index) {
                console.log(index);
                let web3Utils = window.web3Utils;
                this.ethlist = web3Utils.getEth(index);
                this.tokenlist = web3Utils.getToken(index);
            },
            loadMarketInfo () {
                /*
                 get_market_info(localStorage.getItem('version')).then((resp) => {
                 this.exchanges = resp;
                 setTimeout(() => {
                 if (!this.stopFetchingMarket) {
                 this.loadMarketInfo();
                 }
                 }, 3000);
                 }).catch(ex => {
                 console.error(ex);
                 setTimeout(() => {
                 if (!this.stopFetchingMarket) {
                 this.loadMarketInfo();
                 }
                 }, 3000);
                 });
                 */
            },
            goSendEth () {
                this.$router.push({path: '/send-eth'});
            },
            goSendToken () {
                this.$router.push({path: '/send-token'});
            },
            walletCreat () {
                this.$refs.walletcreatestep1.show();
            },
            loadWallets () {
                if (this.current_account.length == 0) {
                    /*
                     this.$router.replace({
                     path: this.link('/wallet-create')
                     });
                     */
                } else {
                    /*
                     this.wallets.forEach((wallet) => {
                     this.loadBalance(wallet);
                     });
                     */
                    window.web3Utils.loadWallet('', '');
                    this.current_account = window.web3Utils.getCurrentWallet();
                }
                setTimeout(() => {
                    $.pullToRefreshDone($(this.$el).find('.pull-to-refresh-content'));
                }, 500);
            },
            loadBalance (wallet) {
                /*
                 if (wallet.account) {
                 fetch_account_balance(wallet.account).then(function (balance) {
                 wallet.balance = balance.amount / 100000;
                 }).catch(ex => {
                 console.error(ex);
                 });
                 }
                 */
            },
            getMarketCap (wallet) {
                let balance = Number(wallet.balance);
                let price = this.price;
                if (!isNaN(balance) && price != '-') {
                    return wallet.balance * this.price;
                }
                return '-';
            },
            openPanel () {
                this.$refs.panel.open();
            },
            openQRScaner () {
                let self = this;
                if (this.isNative) {
                    cordova.exec(function (result) {// eslint-disable-line
                        let query = {
                            to: result
                        };
                        if (result.indexOf('qr://transfer') == 0) {
                            query = util.query2Obj(result.replace('qr://transfer', ''));
                        }
                        self.$router.push({
                            path: self.link('/transfer', query)
                        });
                    }, null, 'QRCode', 'scan', []);
                }
            },
            linkBackup (account) {
                let query = {
                    account: this.currentWallet.account,
                    from: this.$route.fullPath
                };
                return this.link('/wallet-backup-detail', query);
            },
            // TODO upload a qrcode image
            onFileUpload (e) {
                // let file = this.$refs.qrfile;
            },
            openQRCodeModal () {
                this.$refs.qrcode.show();
            },
            assetHideClick () {
                this.isAssetHidden = !this.isAssetHidden;
                this.wallets = this.wallets.map((w) => {
                    w.isAssetHidden = this.isAssetHidden;
                    return w;
                });
                // set_wallets(this.wallets);
            }
        },
        destroyed () {
            $.allowPanelOpen = true;
            $(this.$el).off('refresh');
            // $(this.$refs.content).off('scroll').off('touchmove').off('touchend');
            this.stopFetchingMarket = true;
        },
        mounted () {
            $.init();
            this.loadWallets();
            this.stopFetchingMarket = false;
            this.isAssetHidden = this.currentWallet.isAssetHidden;
            this.loadMarketInfo();
            if (this.isNative) {
                window.webview = {
                    reload: () => {
                        this.loadWallets();
                    }
                };
                cordova.exec(null, null, 'statusBar', 'styleLightContent', []);// eslint-disable-line
            }
            $(this.$el).on('refresh', '.pull-to-refresh-content', (e) => {
                this.loadWallets();
            });
            $(this.$refs.content).on('scroll', () => {
                let offset = $(this.$el).find('.row-top').offset().top;
                if (offset < -20) {
                    let percent = Math.min((-40 - offset) / 40, 1);
                    $(this.$refs.bar).css({
                        background: `rgba(37, 40, 113, ${percent})`
                    });
                } else {
                    $(this.$refs.bar).css({
                        background: 'rgba(37, 40, 113, 0)'
                    });
                }
            }).on('touchmove', (e) => {
                $(this.$refs.bg).css({
                    height: Math.max($(this.$refs.top).height() + $(this.$refs.top).offset().top, $(
                        this.$refs.top).height()),
                    transition: 'none',
                    webkitTransition: 'none'
                });
                return true;
            }).on('touchend', () => {
                const end = () => {
                    $(this.$refs.bg).attr('style', '');
                    clearTimeout(timer);
                };
                let timer = setTimeout(end, 1000);
            });
            this.loadflag = false;
            if (this.current_account.length < 5) {
                this.current_account = '没有账户';
            }
            this.swiper.update();
        },
        computed: {
            showLoyaltyProgram () {
                return localStorage.getItem('version') != '1.2.0';
            },
            qrcode () {
                return `qr://transfer?account=${this.currentWallet.account}`;
            },
            currentWallet () {
                if (this.wallets.length > 0) {
                    return this.wallets[this.currentWalletIndex];
                }
                return {};
            },
            price () {
                if (!this.exchanges || this.exchanges.length == 0) {
                    return '-';
                } else {
                    let best_price = 0;
                    this.exchanges.forEach((exchange) => {
                        if (this.$i18n.locale == 'zh-CN') {
                            best_price = Math.max(Number(exchange.price_rmb), best_price);
                        } else {
                            best_price = Math.max(Number(exchange.price_dollar), best_price);
                        }
                    });
                    return best_price;
                }
            },
            swiper () {
                return this.$refs.mySwiper.swiper;
            }
        },
        components: {
            swiper,
            swiperSlide,
            AccountImage,
            LeftPanel,
            AccountQRCode
        }
    };
</script>
<style lang="scss" scoped="">
    @import "../assets/styles/components/refresh_layer";
    /*::-webkit-scrollbar {*/
    /*display: none;*/
    /*}*/

    #bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: linear-gradient(to bottom, #150838 0%, #3853bc 49%, #18bce2 100%);
        height: 16.75rem;
        transition: height .2s;
    }
    .swiper-slide img{
        margin: 0 auto;
    }
    #page-wallet-index {

    .content {
        top: 0;
        -webkit-overflow-scrolling: auto;
    }

    }

    .bar-nav.buttons-fixed .icon {
        font-size: 1.2rem;
        color: #fff;
    }

    .row-top {
        background: transparent;
        color: #fff;
        min-height: 14.8rem;
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;

    .loading {
        position: absolute;
    }

    &
    .ios {
        padding-top: 5px;
    }

    .icon {
        font-size: 1.2rem;
        color: #fff;
    }

    .swiper-container {
        width: 100%;
        display: block;
    }

    }

    .wallet-info {
        margin-top: 3.5rem;

    .account-header {
        display: inline-block;
    }

    .link-qrcode {
        color: #fff;

    .icon {
        position: relative;
        top: -1px;
        font-size: .8rem;
    }

    }
    .bak-tip {
        margin: .4rem 0;
    }

    .btn-backup {
        visibility: hidden;
        color: #fff;

    .red-dot {
        position: relative;
        display: inline-block;
        top: -8px;
        border-radius: 2px;
        width: 4px;
        height: 4px;
        background: #ff6729;
    }

    .icon-right {
        position: relative;
        top: -2px;
        font-size: .6rem;
        margin-left: .2rem;
    }

    }

    .row-balance {
        display: flex;
        flex-direction: row;
        padding: 0 .75rem;

    .item {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

    .gxicon-eye-off,
    .gxicon-eye {
        border: 5px solid transparent;
        background-clip: padding-box;
    }

    .digit {
        font-family: bebas;
        font-size: 1.1rem;
    }

    }
    .item-middle {
        flex: 1;
        align-items: center;
    }

    .value {
        align-items: flex-end;
    }

    }
    }

    .row-operation {
        height: 5rem;
        display: flex;
        padding: 0.75rem;
        background: #fff;
        position: relative;
        justify-content: space-around;
        z-index: 1;

    .row-button {
        display: flex;
        flex-direction: column;
        align-items: left;
    }

    .item {
        display: flex;
        flex: 2;
        font-weight: bold;
        flex-direction: row;
        justify-content: center;
        align-items: center;

    .gxicon {
        width: 35px;
        margin-right: 1.25rem;
    }

    }

    .sep {
        display: flex;
        height: 100%;
        width: 1px;
        background: #eee;
    }

    }

    .table-exchanges {
        position: relative;
        height: 25rem;
        background: #fff;

    .list-block {
        border-top: .2rem solid #e7e7e7;
        margin-top: 0;
        margin-bottom: 0;
    }

    .item-exchange .item-inner {
        display: flex;
        flex-direction: row;
        padding-top: .75rem;
        padding-bottom: .65rem;
        flex-wrap: wrap;

    .title-ex-name {
        text-align: left;

    .asset-name {
        color: #3d3d3b;
    }

    .ex-name {
        font-size: .7rem;
        color: #888;
    }

    }

    .price {
        text-align: right;

    .price_secondary {
        font-size: .7rem;
        color: #888;
    }

    }

    .quote {
        height: 1.2rem;
        line-height: 1.2rem;
        width: 3.5rem;
        text-align: right;
        padding: 0 .2rem;
        font-weight: bold;
        font-size: .65rem;
        color: #fff;
        background: #d63932;

    &
    .green {
        background: #076f8a;
    }

    }
    }
    }

    .pull-to-refresh-layer {
        position: absolute;
        top: 1rem;

    .line-scale > div {
        background-color: #fff !important;
    }

    }

    .link-loyalty-program {
        z-index: 2;
        position: absolute;
        top: 5.5rem;
        right: 0;
        width: 4.1rem;
        height: 1.6rem;

    img {
        width: 100%;
        height: 100%;
    }

    }
</style>

