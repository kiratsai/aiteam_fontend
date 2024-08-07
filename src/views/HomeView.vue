<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/homev.css';
const router = useRouter();

const login = () => {
  router.push('/login');
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

    <body class="home-page bg">
      <div>
        <img
          src="https://cife.stanford.edu/sites/g/files/sbiybj18746/files/styles/card_1900x950/public/media/image/logo_yau_lee_0.jpg?h=851072b4&itok=6QWZ7F6a"
          class="logo">
      </div>
      <button type="button" id="animatebutton" class="btn btn-warning btn-icon-text animatebutton"
        @click.prevent="login"> <i class="fa fa-check btn-icon-prepend"></i> <B class='font-color-white'>LOGIN</B>
      </button>
    </body>
  </main>
</template>
