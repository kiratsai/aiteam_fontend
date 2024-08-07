<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

import '../assets/registration.css';

const NewUser = ref({
    email: '',
    name: '',
    password: '',
    permission: [],
})

const router = useRouter();

function GetPermissionSelected() {
    const selected = NewUser.value.permission;
    const tbpermission = document.getElementById("tbpermission");
    const chks = tbpermission.getElementsByTagName("input");
    console.log(chks);
    for (let i = 0; i < chks.length; i++) {
        if (chks[i].checked) {
            selected.push(chks[i].value);
        }
    }
}


const submitUser = async function () {
    // post the booking to the backend
    GetPermissionSelected();
    console.log(NewUser.value);
    const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(NewUser.value)
    });
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // alert the user
    alert(JSON.stringify(json));
    NewUser.value.permission = [];
    console.log(NewUser.value);
    router.push('/login');
}
</script>

<template>
    <!-- <main> -->
    <!-- <form class="container my-5" @submit.prevent="submitUser">
            <div class="row mb-3">
                <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="inputEmail" v-model="NewUser.email" required>
                </div>
            </div>

            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputName" v-model="NewUser.name" required>
                </div>
            </div>

            <div class="row mb-3">
                <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" v-model="NewUser.password" required>
                </div>
            </div>

            <fieldset>
            <legend>User Permission:</legend>

            <div id="tbpermission">
            <div>
                <input type="checkbox" id="permission" name="permission" value="P1"/>
                <label for="permission1">permission 1</label>
            </div>

            <div>
                <input type="checkbox" id="permission" name="permission" value="P2"/>
                <label for="permission2">permission 2</label>
            </div>

            <div>
                <input type="checkbox" id="permission" name="permission" value="P3"/>
                <label for="permission3">permission 3</label>
            </div>
            </div>
            </fieldset>
    
            <button type="submit" class="btn btn-primary">New User</button>
        </form> -->

    <form class="" @submit.prevent="submitUser">
        <div class="card border-0 rounded-0 mb-5">
            <h1 class="mb-2">Register As User</h1>
            <small>Enter your details below</small>

            <label class="font-weight-bold mb-0">Fullname</label>
            <input type="text" class="form-control" id="inputName" v-model="NewUser.name" required>

            <label class="font-weight-bold mb-0">Email</label>
            <input type="email" class="form-control" id="inputEmail" v-model="NewUser.email" required>

            <label class="font-weight-bold mb-0">Phone Number</label>
            <input type="text" name="phno" class="mb-4" placeholder="1234567890">

            <label class="font-weight-bold mb-0">Password</label>
            <input type="password" class="form-control" id="inputPassword" v-model="NewUser.password" required>

            <fieldset>
                <br>
                <legend>User Permission:</legend>
                <div id="tbpermission">
                    <div>
                        <input type="checkbox" id="permission" name="permission" value="P1" />
                        <label for="permission1" class="pe-4">permission 1</label>

                        <input type="checkbox" id="permission" name="permission" value="P2" />
                        <label for="permission2">permission 2</label>
                    </div>
                    <div>
                        <input type="checkbox" id="permission" name="permission" value="P3" />
                        <label for="permission3" class="pe-4">permission 3</label>

                        <input type="checkbox" id="permission" name="permission" value="P4" />
                        <label for="permission3">permission 4</label>
                    </div>
                </div>
            </fieldset>

            <div class="custom-control custom-checkbox custom-control-inline mt-4">
                <input id="chk1" type="checkbox" name="chk" class="custom-control-input" checked>
                <label for="chk1" class="custom-control-label text-sm">I agree with Terms of Service, Terms of Privacy
                    Policy.</label>
            </div>

            <div class="row px-3 mt-5">
                <button type="submit" class="btn btn-blue text-center">Register</button>
                <small class="text-muted mr-3 mt-2">or login with</small>
                <img class="icon mr-2 mt-2" src="https://i.imgur.com/j8ZGqG2.png">
                <img class="icon ml-2 mt-2" src="https://i.imgur.com/AX2lVgH.png">
            </div>
        </div>
    </form>
    <!-- </main> -->
</template>