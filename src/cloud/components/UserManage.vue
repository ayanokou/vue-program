<template>
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>修改权限</th>
            <th>删除用户</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <el-dropdown>
                <el-button type="primary">
                  修改权限<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="changeRole(user, 'admin')">超级管理员</el-dropdown-item>
                    <el-dropdown-item @click="changeRole(user, 'user')">普通用户</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
          </td>
          <td><el-button type="primary" size="small"  @click="deleteUser(user.id)"  id="delete">删除</el-button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>


<script src="../js/userManage">

</script>

<style scoped>
/* User List */
.user-list {
  font-family: Arial, sans-serif;
  width: 80%;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  text-align: left;
  padding: 8px;
  border: 1px solid #ddd;
}

table th {
  background-color: #f2f2f2;
}

/* Header */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Rows */
tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

/* Cells */
td {
  vertical-align: middle;
}

/* Responsive */
@media screen and (max-width: 600px) {
  table {
    font-size: 14px;
  }
}
</style>