<template>
  <v-app>
    <Navbar />
    <v-main class="mx-4">
      <vue-confirm-dialog class="textPrimary"></vue-confirm-dialog>
      <router-view class="my-3"></router-view>
    </v-main>
    <v-footer>
      <v-col class="text-center" cols="12">
        <p>
          2020 - Nanodyn Systems Pty Ltd
          <v-icon color="#9e9e9e">copyright</v-icon>
        </p>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",

  components: { Navbar },

  data: () => ({
    //
  }),

  methods: {},

  created() {},
};
</script>

<style>
.v-application--wrap {
  background-color: #f5f5f5;
}

.v-breadcrumbs__item {
  text-decoration: none;
}

.v-application a {
  text-decoration: none;
}

.card-text-black {
  color: rgba(37, 37, 37, 0.87);
}

/* width */
::-webkit-scrollbar {
  width: 10px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 5px !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d4d4d4 !important;
  border-radius: 5px !important;
}

.vc-btn {
  color: #37474f !important;
}
</style>

<style scoped>
p {
  color: #9e9e9e;
}

.v-icon {
  font-size: medium;
}

.v-application a {
  text-decoration: none;
  color: #9e9e9e !important;
}
</style>
