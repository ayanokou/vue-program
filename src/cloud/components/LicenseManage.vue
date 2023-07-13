<template>
    <el-table :data="tableData" style="width: 100%">

    <el-table-column prop="licenseName" label="license名称" width="180" />
    <el-table-column prop="procedureName" label="文件名" width="180" />
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="licenseKey" label="license注册码" />
    <el-table-column prop="expiryDate" label="license注册码截止时间" />
    <el-table-column fixed="right" label="Operations" width="120">
    <template #default="{ row }">
    <el-button link type="primary" size="small" @click="deletelicense(row.licenseName)"
      >删除</el-button
    >
    </template>

    </el-table-column>
    <el-table-column label="倒计时" width="200">
        <template #default="{ row }" v-if="tableData.length > 0">
            <el-countdown  format="DD [days] HH:mm:ss" :value="new Date(row.expiryDate)" >
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        <el-icon style="margin-right: 4px" :size="12">
                        <Calendar />
                        </el-icon>
                        Still to go until next month
                    </div>
                    </template>
            </el-countdown>
            <div class="countdown-footer" >
            {{  row.expiryDate}}
            </div>
        </template>
    </el-table-column>-->

    </el-table>
  

   
    
</template>

<script>
import axiosInstance from '../../axios';

export default {
    data(){
        return{
            value2:Date.now() + 1000 * 60 * 60 * 24 * 2,
            tableData:[],

        }

    },
    created() {
    // Fetch the table data when the component is created
    this.fetchTableData();
    },

    methods:{
        countdownValue(expiryDate) {
            const currentTime = new Date().getTime();
            const expiryTime = new Date(expiryDate).getTime();
            return expiryTime - currentTime;
        },

        isCountdownActive(expiryDate) {
            const currentTime = new Date().getTime();
            const expiryTime = new Date(expiryDate).getTime();
            return currentTime < expiryTime;
        },
        deletelicense(licenseName) {
            axiosInstance.post(`/deleteLicense/${licenseName}`)
                .then((response) => {
                    console.log(response.data);
                    this.$router.go(0);
                })
                .catch((error) => {
                    console.log(error);
                }); 

        },
        fetchTableData() {

            axiosInstance.get('/tableData')
                .then((response) => {
                    console.log(response.data);
                    console.log(this.value2);
                    const groupedData = {}; // 用于存储按照licensename分组的数据

                    response.data.forEach(item => {
                    const { licensename, procedurename, description ,licensekey,exp} = item;
                    if (!groupedData[licensename]) {
                        // 如果该licensename不存在于groupedData中，则创建一个新的数组
                        groupedData[licensename] = [];
                    }

      // 将数据添加到相应的licensename数组中
                    groupedData[licensename].push({ procedureName: procedurename ,Description : description,LicenseKey : licensekey,Exp:exp});
                    });

                    this.tableData = Object.keys(groupedData).map(licensename => {
                        const expiryDate = new Date(groupedData[licensename][0].Exp).toLocaleString('en-US', { hour12: false }); // 使用toLocaleString()将日期转换为本地字符串，设置hour12为false以避免12小时制
                        return {
                        licenseName: licensename,
                        procedureName: groupedData[licensename].map(data => data.procedureName),
                        description: groupedData[licensename][0].Description,
                        licenseKey: groupedData[licensename][0].LicenseKey,
                        expiryDate: expiryDate.replace(/T/, ' ').replace(/\.\d+/, ''), // 替换 'T' 和毫秒部分为空字符串
                        };
                    });
                    })
                .catch((error) => {
                    console.log(error);
                });           
        }
    }
    
}
</script>

