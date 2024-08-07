<script setup>
// imports
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/login.css';

const router = useRouter();

// credentials
const credentials = ref({
    email: '',
    password: ''
});

// show password toggle
const showPassword = ref(false);
const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password')

// methods
const login = async () => {
    try {
        // fetch
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials.value)
        });

        // response
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        // save token to local storage
        localStorage.setItem('token', data.token);

        router.push('/robot');
    } catch (error) {
        alert(error);
    }
}

const register = async () => {
    router.push('/registration');
}

onMounted(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    if (!hasReloaded) {
        sessionStorage.setItem('hasReloaded', 'true');
        window.location.reload();
    } else {
        sessionStorage.removeItem('hasReloaded');
    }
});

</script>

<template>
    <main>
        <!-- <form @submit.prevent="login">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" v-model="credentials.email" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" v-model="credentials.password">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button @click.prevent="register" class="btn btn-primary"> Registration </button>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form> -->

        <body className='snippet-body'>
            <form @submit.prevent="login">
                <div class="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 mx-auto">
                    <div class="card card0 border-0">
                        <div class="row d-flex">
                            <div class="col-lg-6">
                                <div class="card1 pb-5">
                                    <div class="row">
                                        <img src="https://cife.stanford.edu/sites/g/files/sbiybj18746/files/styles/card_1900x950/public/media/image/logo_yau_lee_0.jpg?h=851072b4&itok=6QWZ7F6a"
                                            class="logo">
                                    </div>
                                    <div class="row px-3 justify-content-center mt-4 mb-5 border-line">
                                        <img src="https://i.imgur.com/uNGdWHi.png" class="image">
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="card2 card border-0 px-4 py-5">
                                    <div class="row px-3">
                                        <label class="mb-1">
                                            <h6 class="mb-0 text-sm">Email Address</h6>
                                        </label>
                                        <input type="email" class="form-control" v-model="credentials.email"
                                            aria-describedby="emailHelp">
                                    </div>
                                    <div class="row px-3">
                                        <label class="mb-1">
                                            <h6 class="mb-0 text-sm">Password</h6>
                                        </label>
                                        <input :type="passwordFieldType" class="form-control" id="exampleInputPassword1"
                                            v-model="credentials.password">
                                    </div>
                                    <div class="row px-3 mb-4">
                                        <div
                                            class="d-flex justify-content-end custom-control custom-checkbox custom-control-inline ">
                                            <input id="chk1" type="checkbox" name="chk" class="custom-control-input"
                                                style="width: 30px;" v-model="showPassword">
                                            <label for="chk1" class="custom-control-label text-sm"> show password
                                            </label>
                                        </div>
                                        <a href="#" class="ml-auto mb-0 text-sm">Forgot Password?</a>
                                    </div>
                                    <div class="row mb-3 px-3">
                                        <button type="submit" class="btn btn-blue text-center">Login</button>
                                    </div>
                                    <div class="row mb-4 px-3">
                                        <small class="font-weight-bold">Don't have an account? <a
                                                @click.prevent="register" class="text-danger ">Register</a></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-blue py-4">
                            <div class="row px-3">
                                <small class="ml-4 ml-sm-5 mb-2">Copyright &copy; 2024. All rights reserved by Yau Lee
                                    Holding Limited.</small>
                                <div class="social-contact ml-4 ml-sm-auto">
                                    <span class="fa fa-facebook mr-4 text-sm"></span>
                                    <span class="fa fa-google-plus mr-4 text-sm"></span>
                                    <span class="fa fa-linkedin mr-4 text-sm"></span>
                                    <span class="fa fa-twitter mr-4 mr-sm-5 text-sm"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </body>

    </main>
</template>