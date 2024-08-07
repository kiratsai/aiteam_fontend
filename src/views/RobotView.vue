<script setup>
import { onMounted, ref } from "vue";
import { jwtDecode } from "jwt-decode";
// import { useRouter } from 'vue-router';
import { addPageCSS, removeAllCSSExcept } from '../router/cssManager';

import robotCSS from '../assets/robot.css?inline';
import bootstrap from "../../node_modules/bootstrap/dist/css/bootstrap.css?inline";


const pageName = 'robot'; // Unique identifier for this page

// Add this page's CSS
addPageCSS(bootstrap + robotCSS , pageName);

const isDropdownOpen = ref(false);

// const toggleDropdown = () => {
//     isDropdownOpen.value = !isDropdownOpen.value;
// };

onMounted(() => {
    loadAsyncData();
    // Remove all CSS except for robot.css
    removeAllCSSExcept(pageName);

    // Add click event listener to close dropdown when clicking outside
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn') && isDropdownOpen.value) {
            isDropdownOpen.value = false;
        }
    });
});

const name = ref("");
const email = ref("");
// const router = useRouter();
const robotStatus = ref('STOP!!!');

// const logout = function () {
//     localStorage.removeItem('token');
//     router.push('/login');
// }

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


const up_robot = async () => {
    try {
        const response = await fetch('/api/python/open/up', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.text();
        robotStatus.value = data;
        console.log(data);
    } catch (error) {
        console.error("Error occurred while running the robot script", error);
    }
};

const down_robot = async () => {
    try {
        const response = await fetch('/api/python/open/down', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.text();
        robotStatus.value = data;
        console.log(data);
    } catch (error) {
        console.error("Error occurred while running the robot script", error);
    }
};

const stop_robot = async () => {
    try {
        const response = await fetch('/api/python/stop', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.text();
        console.log(data);
        robotStatus.value = data;
    } catch (error) {
        console.error("Error occurred while running the robot script", error);
    }
};

</script>

<template>
    <!-- <nav class="navbar">
        <img src="../image/YauLee.png" width="40" height="40" alt="">
        <div class="dropdown">
            <button @click.stop="toggleDropdown" class="dropbtn pr-4">NAME: {{ name }} ▼</button>
            <div :class="['dropdown-content', { 'show': isDropdownOpen }]">
                <a href="#">profile</a>
                <a @click="logout">Logout</a>
            </div>
        </div>
    </nav> -->

    <div class="container mt-3">
        <div class="robot-controls ">
            <div class="button-container">
                <button type="button" class="btn btn-blue text-center my-2 py-2" @click="up_robot">slider_up</button>
            </div>
            <div class="button-container">
                <button type="button" class="btn btn-blue text-center my-2 py-2"
                    @click="down_robot">slider_down</button>
            </div>
            <div class="button-container">
                <button type="button" class="btn btn-red text-center my-2 py-2" @click="stop_robot">STOP</button>
            </div>
        </div>

        <div class="status-container my-2">
            Status: <div>{{ robotStatus }}</div>
        </div>
    </div>
</template>


<style scoped>
/* ... (rest of the styles remain unchanged) */
</style>

