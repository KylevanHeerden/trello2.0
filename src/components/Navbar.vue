<template>
  <nav>
    <v-app-bar flat>
      <v-app-bar-nav-icon
        dark
        @click.stop="conditionalDrawer"
        data-cypress="navDrawerBtn"
      ></v-app-bar-nav-icon>
      <router-link
        style="color: white"
        text
        dark
        to="/"
        data-cypress="homeLink"
      >
        <v-toolbar-title class="text-uppercase NavTitle">
          <span class="font-weight-light">RAPTOR</span>
          <span class="App">App</span>
          <v-img
            src="@/assets/raptor.png"
            max-height="50px"
            max-width="50px"
          ></v-img>
        </v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>
      <div>
        <v-icon
          color="white"
          medium
          @click.stop="conditionalDrawer2"
          data-cypress="notificationBell"
        >
          notifications_none
        </v-icon>
        <v-icon
          v-if="notifications.length != 0 && logInStatus"
          color="red"
          small
          class="redDot"
        >
          fiber_manual_record
        </v-icon>
      </div>
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text dark left v-bind="attrs" v-on="on">
              <v-icon style="color: white !important">expand_more</v-icon>
              <span>Menu</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="link in links"
              :key="link.text"
              router
              :to="link.route"
            >
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <v-btn text dark v-if="!logInStatus">
          <span>sign in</span>
          <v-icon dark right>exit_to_app</v-icon>
        </v-btn>
        <v-btn text dark v-else data-cypress="logoutBtn" @click="logout()">
          <span>sign out</span>
          <v-icon dark right>exit_to_app</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
      class="blue-grey darken-3"
      data-cypress="navDrawer"
    >
      <v-layout column align-center text-center>
        <v-flex class="mt-9">
          <router-link :to="{ name: 'Profile' }">
            <v-avatar size="100">
              <img src="@/assets/avatar.jpg" />
            </v-avatar>
            <p class="white--text subheading mt-1">User One</p>
          </router-link>
        </v-flex>
      </v-layout>

      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon dark>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text" right>
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="drawer2"
      absolute
      bottom
      temporary
      class="grey lighten-5"
      right
      width="400"
      data-cypress="notificationDrawer"
    >
      <v-list-item class="blue-grey darken-3 notificationsHeader">
        <v-list-item-content>
          <v-list-item-title class="notificationsHeaderText"
            >Notifications</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-card v-for="n in notifications" :key="n.id" class="card border">
        <v-card-actions class="pt-2 pr-2 pb-0 align-right">
          <v-spacer></v-spacer>
          <v-btn icon x-small text @click="removeNotification(n.id)">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title
          class="cardTitle"
          @click="forward(n.id, n.product.product_id)"
        >
          {{ n.product.product_name }}
        </v-card-title>
        <v-card-subtitle
          class="cardSubtitle"
          @click="forward(n.id, n.product.product_id)"
        >
          {{ n.programme.programme_name }}
        </v-card-subtitle>
        <v-card-text @click="forward(n.id, n.product.product_id)">
          The purchase request for {{ n.product.product_name }} is awaiting
          <em v-if="n.status == 'Waiting'" class="emColor">Delivery</em>
          <em v-else-if="n.status == 'Procured'" class="emColor">
            Procurement</em
          >
          <em v-else class="emColor">{{ n.status }} approval</em>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      drawer: false,
      drawer2: false,
    };
  },

  methods: {
    ...mapActions({
      removeNotification: "removeNotification",

      logout: "logout",
    }),
    conditionalDrawer() {
      if (this.logInStatus) {
        this.drawer = !this.drawer;
      }
    },
    conditionalDrawer2() {
      if (this.logInStatus) {
        this.drawer2 = !this.drawer2;
      }
    },
    forward(notificationId, productId) {
      this.$router.push(`/product/${productId}`);

      this.removeNotification(notificationId);
    },
  },

  computed: {
    ...mapState({
      logInStatus: (state) => state.user.loggedIn,
      user: (state) => state.profile.userProfile,
      links: (state) => state.links,
      notifications(state) {
        let notifications = state.notifications.notifications;

        let filteredNotifications = notifications.filter(
          (notification) => notification.user_id == this.user.id
        );

        return filteredNotifications.sort((a, b) => {
          return b.createdOn - a.createdOn;
        });
      },
    }),
    ...mapGetters({}),
  },

  created() {
    this.$store.dispatch("getNotifications");
  },

  mounted() {},
};
</script>

<style scoped>
.v-toolbar {
  color: white !important;
  background-color: #37474f !important;
}

.theme--dark.v-btn.v-btn--disabled {
  color: white !important;
}

.notificationsHeader {
  min-height: 64px;
}

.notificationsHeaderText {
  font-size: large;
  color: white;
}

.card {
  margin: 10px;
}

.cardTitle {
  padding-top: 0px !important;
  font-size: medium;
}

.cardSubtitle {
  padding-bottom: 0px !important;
}

.cardClear {
  padding-bottom: 0px !important;
}

.redDot {
  position: relative;
  right: 6px;
  bottom: 5px;
}

.border {
  border-left: 3px solid #78909c !important;
}

.emColor {
  color: #37474f;
}

.NavTitle {
  display: flex;
}

.App {
  padding-right: 10px;
}

span {
  margin-top: 7px;
}
</style>
