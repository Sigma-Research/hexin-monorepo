<template>
    <div class="c-helloworld">
        message: {{ message }}
    </div>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator'
import './index.css';

@Component
export default class HelloWorld extends Vue {
    message = 'hello world';
}
</script>
<style>

</style>