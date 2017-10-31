<template>
    <div :class="s.wrapper">
        <section :class="{[s.headerClasses]:true,[s.headerBorder]:!isActive}" @click="toggle">
            <slot name="title">
                <h6 :class="s.title" v-if="title">{{title}}</h6>
            </slot>
            <span :class="{[s.arrow]:true,[s.arrowDefault]:!isActive,[s.arrowExpand]:isActive}"></span>
        </section>
        <section :class="s.contentClasses" v-show="isActive">
            <slot name="content"></slot>
        </section>
    </div>
</template>
<script>
export default {
    name: 'collpaseItem',
    props: {
        title: {
            type: String,
            default: '标题'
        },
        name: {
            type: String
        }
    },
    data() {
        return {
            index: 0,
            isActive: false
        };
    },
    methods: {
        toggle() {
            this.$parent.toggle({
                name: this.name || this.index,
                isActive: this.isActive
            });
        }
    }
};
</script>
<style module="s" lang="scss">
@import './../../../static/scss/mixin.scss';
.headerClasses {
    // height: .99rem;
    padding-left: .29rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.headerBorder {
    @include border-v($pos: bottom);
}

.title {
    font-size: .34rem;
    color: #495060;
    font-weight: normal;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.arrow {
    display: flex;
    justify-content: center;
    width: .4rem;
    height: .4rem;
    margin-right:.29rem;
}

.arrowDefault {
    @include icon-arrow($dir: bottom);
}

.arrowExpand {
    @include icon-arrow($dir: top);
}

.contentClasses {
    background-color: #fafafa;
    padding: .5rem .29rem;
    position: relative;
    width:100%;
    overflow:hidden;
    &:before,
    &:after {
        left: -10%;
        top:0;
        content: '';
        display: block;
        height: 100%;
        width: 120%;
        position: absolute;
        background-color: transparent;
    }
    &:before {
        box-shadow: 0 -6px 20px #f2f2f2 inset;
    }
    &:after {
        box-shadow: 0 6px 20px #f2f2f2 inset;
    }
}
</style>