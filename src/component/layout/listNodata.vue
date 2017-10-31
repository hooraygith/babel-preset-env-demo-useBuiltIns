<template>
    <div :class="s.nodataInfo">
        <img :class="s.img" src="./../../static/images/noData.png" alt="nodata">
        <slot>
            <p :class="s.nodataTip">
                {{tip[0]}}
            </p>
            <p :class="s.nodataDesc">
                {{tip[1]}}
            </p>
        </slot>
    </div>
</template>
<script>
export default {
    props: {
        tip: {
            type: Array,
            default: ()=>(['提示信息', '描述信息'])
        }
    }
}
</script>
<style module="s">
.nodataInfo {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0, -50%);
    text-align: center;
}

.img {
    height: 1.98rem;
}

.nodataTip {
    font-size: .3rem;
    font-weight: bold;
    color: #495060;
    margin: .3rem 0 .25rem 0;
}

.nodataDesc {
    font-size: .24rem;
    color: #80848f;
}
</style>