<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref("");
const email = ref("");


const logout = function () {
  localStorage.removeItem('token');
  router.push('/login');
}

const robot = function () {
  router.push('/robot');
}

const config = function(){
  router.push('/Configuration');
}


const loadAsyncData = async () => {
  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    console.log(decoded);
    name.value = `${decoded.name}`;
    email.value = `${decoded.email}`;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadAsyncData();
});

</script>

<template>

  <head>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  </head>
  <div class="d-flex">
    <div :class="['sidebar', { active: isActive }]">
      <div class="top">
        <!-- <div class="logo d-flex align-items-center">
            <i class='bx bx-layer'></i>
          <span>YauLee AI Team</span>
        </div> -->

        <i class="bx bx-menu" id="btn" @click="toggleSidebar"></i>
      </div>
      <div class="user">
        <img src="../image/YauLee.png" alt="me" class="user-img" />
        <div>
          <p class="bold">{{ email }}</p>
          <p>{{ name }}</p>
        </div>
      </div>
      <ut>
        <li>
          <a href="#" @click="robot">
            <i class="bx bxs-grid-alt"></i>
            <span class="nav-item">robot</span>
          </a>
          <span class="tooltip">robot</span>
        </li>
        <li>
          <a href="#" @click="config">
              <i class="bx bxs-shopping-bag"></i>
              <span class="nav-item">Config</span>
          </a>
          <span class="tooltip">Config</span>
        </li>
        <li>
          <a href="#">
            <i class="bx bx-list-check"></i>
            <span class="nav-item"> navigation</span>
          </a>
          <span class="tooltip"> navigation</span>
        </li>
        <li>
          <a href="#">
            <i class="bx bx-cog"></i>
            <span class="nav-item">Setting</span>
          </a>
          <span class="tooltip">Setting</span>
        </li>
        <li>
          <a href="#" @click="logout">
            <i class="bx bx-log-out"></i>
            <span class="nav-item">Logout</span>
          </a>
          <span class="tooltip">Logout</span>
        </li>
      </ut>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isActive = !this.isActive;
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.user-img {
  width: 50px;
  border-radius: 100%;
  border: 1px solid #eee;
  background-color: #fff;
}

.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px;
  background-color: #12171e;
  padding: 0.4rem 0.8rem;
  transition: all 0.5s ease;
}

.sidebar.active~.main-content {
  left: 250px;
  width: calc(100% - 250px);
}

.sidebar.active {
  width: 250px;
}

.sidebar #btn {
  position: absolute;
  color: #fff;
  top: .4rem;
  left: 50%;
  font-size: 1.2rem;
  padding-top: 10px;
  transform: translateX(-50%);
  cursor: pointer;
}

.sidebar.active #btn {
  left: 90%;
}

.sidebar.active .top .logo {
  color: #fff;
  opacity: 1;
}

.top .logo i {
  font-size: 2rem;
  margin-right: 6px;
}

.user {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}

.user p {
  color: #fff;
  opacity: 1;
  margin-left: 1rem;
}

.bold {
  font-weight: 600;
}

.sidebar p {
  opacity: 0;
}

.sidebar.active p {
  opacity: 1;
}

.sidebar ut li {
  position: relative;
  list-style-type: none;
  height: 50px;
  width: 90%;
  margin: 0.8rem auto;
  line-height: 50px;
}

.sidebar ut li a {
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  border-radius: 0.8rem;
}

.sidebar ut li a:hover {
  background-color: #fff;
  color: #12171e;
}

.sidebar ut li a i {
  min-width: 50px;
  text-align: center;
  height: 50px;
  border-radius: 12px;
  line-height: 50px;
}

.sidebar .nav-item {
  opacity: 0;
  visibility: hidden;
}

.sidebar.active .nav-item {
  opacity: 1;
  visibility: visible;
}

.sidebar ut li .tooltip {
  position: absolute;
  visibility: hidden;
  left: 125px;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0.5rem 0.8rem rgba(0, 0, 0, 0.2);
  border-radius: .6rem;
  padding: .4rem 1.2rem;
  background-color: #fff;
  color: #12171e;
  line-height: 1.8rem;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar ut li:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.sidebar.active ut li:hover .tooltip {
  display: none;
}
</style>