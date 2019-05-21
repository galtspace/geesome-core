/*
 * Copyright ©️ 2018 Galt•Space Society Construction and Terraforming Company 
 * (Founded by [Nikolai Popeka](https://github.com/npopeka),
 * [Dima Starodubcev](https://github.com/xhipster), 
 * [Valery Litvin](https://github.com/litvintech) by 
 * [Basic Agreement](http://cyb.ai/QmSAWEG5u5aSsUyMNYuX2A2Eaz4kEuoYWUkVBRdmu9qmct:ipfs)).
 * ​
 * Copyright ©️ 2018 Galt•Core Blockchain Company 
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) and 
 * Galt•Space Society Construction and Terraforming Company by 
 * [Basic Agreement](http://cyb.ai/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS:ipfs)).
 */

import MediaElement from "../MediaElement/MediaElement";

const _ = require('lodash');
const ipfsHelper = require('../../../../libs/ipfsHelper');

export default {
    template: require('./ContentManifestItem.html'),
    props: ['manifest', 'previewMode'],
    components: {MediaElement},
    async created() {
        this.setContent();
    },

    async mounted() {

    },

    methods: {
        async setContent() {
            if(ipfsHelper.isIpldHash(this.manifest)) {
                this.manifestObj = await this.$coreApi.getIpld(this.manifest);
            } else {
                this.manifestObj = this.manifest;
            }
            
            this.srcLink = await this.$coreApi.getImageLink(this.manifestObj.content);
            this.previewSrcLink = await this.$coreApi.getImageLink(this.manifestObj.preview);
            
            if(this.type == 'text') {
                this.content = await this.$coreApi.getContentData(this.contentId);
            }
            if(this.type == 'image' || this.type == 'video' || this.type == 'audio' || this.type == 'file') {
                this.content = this.srcLink;
            }
        }
    },

    watch: {
        type() {
            this.setContent();
        },
        manifest() {
            this.setContent();
        }
    },

    computed: {
        type() {
            if(!this.manifestObj) {
                return null;
            }
            if(_.startsWith(this.contentType, 'image')) {
                return 'image';
            }
            if(_.startsWith(this.contentType, 'text')) {
                return 'text';
            }
            if(_.startsWith(this.contentType, 'video')) {
                return 'video';
            }
            if(_.startsWith(this.contentType, 'audio')) {
                return 'audio';
            }
            return 'file';
        },
        contentType() {
            return this.previewMode && this.manifestObj.preview ? this.manifestObj.previewMimeType : this.manifestObj.mimeType;
        },
        contentId() {
            return this.previewMode && this.manifestObj.preview ? this.manifestObj.preview : this.manifestObj.content;
        }
    },
    data() {
        return {
            manifestObj: null,
            content: '',
            previewSrcLink: null,
            srcLink: null
        }
    },
}
