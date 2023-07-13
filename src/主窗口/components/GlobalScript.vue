
<!-- <template>
    <el-dialog v-model="dialogVisibleGlobalScript" title="Tips" width="70%" @close="close()">
        <template #header>
            全局脚本
        </template>
        <div class="codeEditBox">
            <editor v-model="code" @init="editorInit" @input='codeChange' lang="javascript" :options="editorOptions"
                theme="chrome"></editor>

        </div>



    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import Editor from 'vue2-ace-editor';

export default {
    components: {
        Editor,
    },
    data() {
        return {
            code: '',
            editorOptions: {
                // 设置代码编辑器的样式
                enableBasicAutocompletion: true, //启用基本自动完成
                enableSnippets: true, // 启用代码段
                enableLiveAutocompletion: true, //启用实时自动完成
                tabSize: 2, //标签大小
                fontSize: 18, //设置字号
                showPrintMargin: false, //去除编辑器里的竖线
            },


        }
    },
    computed: {
        ...mapState(['dialogVisibleGlobalScript']),

    },
    mounted() {
    },
    methods: {
        close() {
            this.$store.commit('setDialogVisibleGlobalScript', false)
        },
        codeChange(val) {
            console.log(val);
        },
        editorInit() {
            require('brace/theme/chrome');
            require('brace/ext/language_tools'); //language extension prerequsite...
            require('brace/mode/yaml');
            require('brace/mode/json');
            require('brace/mode/less');
            require('brace/snippets/json');
            require('brace/mode/lua');
            require('brace/snippets/lua');
            require('brace/mode/javascript');
            require('brace/snippets/javascript');
        },


    }
}


</script>


<style scoped>
.codeEditBox {
    width: 100%;
    height: 200px;
    border: 1px solid #dcdee2;
}
</style> -->
<template>
    <el-dialog v-model="dialogVisibleGlobalScript" title="Tips" width="70%" @close="close()">
        <template #header>
            全局脚本
        </template>
        <div class="codeEditBox">
            <VAceEditor v-model:value="content" lang="html" theme="github" style="height: 300px" />
        </div>
        <div class="container">
            <el-button class="el-button" @click="run()">运行</el-button>
        </div>


    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { ref } from "vue";
import { VAceEditor } from "vue3-ace-editor"
import '../js/ace.config'

const content = ref("<div>Hello World</div>")


export default {
    components: {
        VAceEditor
    },
    data() {
        return {


        }
    },
    computed: {
        ...mapState(['dialogVisibleGlobalScript']),

    },
    mounted() {
    },
    methods: {
        close() {
            this.$store.commit('setDialogVisibleGlobalScript', false)
        },
        run() {
            try {
                // 使用eval()函数解析和执行代码
                eval(this.content);
            } catch (error) {
                console.error('Error running code:', error);
            }
        }


    },
    mounted() {
    // 在组件挂载后，初始化代码
    this.code = "console.log('Hello, World!');";
  }
}


</script>


<style scoped>
.container {
    display: flex;
    justify-content: flex-end;
    height: 30px;
    /* 设置容器宽度 */
}

.el-button {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
}
</style>